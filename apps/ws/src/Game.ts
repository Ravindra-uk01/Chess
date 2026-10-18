import { GameResult, GameStatus } from '@repo/db';
import { randomUUID } from 'crypto';
import { Chess, Move, Square } from "chess.js";
import { SocketManager, User } from './SocketManager';
import { db } from './db';
import { INIT_GAME, GAME_ENDED, MOVE } from './messages';

const GAME_TIME_MS = 10 * 60 * 60 * 1000;

function isPromoting(board:Chess, from:Square, to:Square) {
    if(!from) return false;

    const piece = board.get(from);
    
    if(piece?.type !== 'p' ) return false;

    if(piece?.color !== board.turn()) return false;

    if(!['1','8'].some((it)=> to.endsWith(it))) return false;

    return board
        .moves({square:from, verbose:true})
        .map(it => it.to)
        .includes(to);
}

export class Game {
    public gameId: string;
    public player1UserId: string;
    public player2UserId: string | null;
    public board:Chess;
    private moveCount = 0;
    private timer: NodeJS.Timeout | null = null;
    private moveTimer: NodeJS.Timeout | null = null;
    public result: null = null;
    private player1TimeConsumed:number = 0;
    private player2TimeConsumed:number = 0;
    private startTime = new Date(Date.now());
    private lastMoveTime = new Date(Date.now());

    constructor( player1UserId:string, player2UserId:string | null, gameId?: string, startTime?: Date ) {
        this.gameId = gameId ?? randomUUID();
        this.player1UserId = player1UserId;
        this.player2UserId = player2UserId;
        this.board = new Chess();
        if(startTime){
            this.startTime = startTime;
            this.lastMoveTime = startTime
        }
    }

    seedMoves(moves: {
        id: string;
        gameId: string;
        moveNumber: number;
        from: string;
        to: string;
        comments: string | null;
        timeTaken: number | null;
        createdAt: Date;
    }[]){
        moves.forEach((move) => {
            if(isPromoting(this.board, move.from as Square,  move.to as Square)){
                this.board.move({
                    from: move.from,
                    to: move.to,
                    promotion: 'q'
                });
            }else{
                 this.board.move({
                    from: move.from,
                    to: move.to
                });
            }
        });

        this.moveCount = moves.length;
        if(moves[moves.length-1]){
            this.lastMoveTime = moves[moves.length - 1].createdAt;
        }

        moves.map((move, index) => {
            if(move.timeTaken){
                if(index === 0 ){
                    this.player1TimeConsumed += move.timeTaken;
                }else{
                    this.player2TimeConsumed += move.timeTaken;
                }
            }
        })

        this.resetAbandonedTimer();
        this.resetMoveTimer();
    }

    async updateSecondPlayer(player2UserId: string) {
        this.player2UserId = player2UserId;

        const users = await db.user.findMany({
            where:{
                id: {
                    in : [this.player1UserId, this.player2UserId ?? '']
                }
            }
        });

        try {
            await this.createGameInDb();
        } catch (error) {
            console.error(error);
        }

        SocketManager.getInstance().broadcast(
            this.gameId,
            JSON.stringify({
                type: INIT_GAME,
                payload: {
                    gameId : this.gameId,
                    whitePlayer : {
                        name : users.find((user) => user.id === this.player1UserId)?.name,
                        id: this.player1UserId,
                    },
                    blackPlayer : {
                        name : users.find((user) => user.id === this.player2UserId)?.name,
                        id: this.player2UserId,
                    },
                    fen: this.board.fen(),
                    moves: []
                }
            })
        )
    }

    async createGameInDb(){
        this.startTime = new Date(Date.now());
        this.lastMoveTime = this.startTime;

        const game = await db.game.create({
            data: {
                id : this.gameId,
                whitePlayer: {
                    connect: {
                        id: this.player1UserId,
                    }
                },
                blackPlayer: {
                    connect: {
                        id: this.player2UserId ?? "",
                    }
                },
                timeControl: "CLASSICAL",
                status: "IN_PROGRESS",
                startAt: this.startTime,
                currentFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            },
            include: {
                whitePlayer: true,
                blackPlayer: true
            }
        });
        this.gameId = game.id;
    }

    async addMoveToDb(move:Move, moveTimeStamp: Date){
        await db.$transaction([
            db.move.create({
                data: {
                    gameId: this.gameId,
                    moveNumber: this.moveCount + 1,
                    from : move.from,
                    to: move.to,
                    comments: "",
                    before: move.before,
                    after: move.after,
                    timeTaken: moveTimeStamp.getTime() - this.lastMoveTime.getTime(),
                    san: move.san,
                    createdAt: moveTimeStamp
                }
            }),
            db.game.update({
                data: {
                    currentFen: move.after
                },
                where: {
                    id : this.gameId
                }
            })
        ]);
    }

    async makeMove(user:User, move:Move){
        const turn = this.board.turn();
        if(turn === 'b' && user.userId === this.player1UserId){
            return;
        }
        if(turn === 'w' && user.userId === this.player2UserId)
            return;

        if(this.result){
            console.error(`user ${user.userId} is making move post game completion`);
            return;
        }

        const moveTimeStamp = new Date(Date.now());

        try {
            if(isPromoting(this.board, move.from, move.to)){
                this.board.move({
                    from: move.from,
                    to: move.to,
                    promotion: 'q'
                });
            }else{
                this.board.move({
                    from: move.from,
                    to: move.to
                });
            }
        } catch (error) {
            console.error(`Error while making this move.`);
            return;
        }

        //board will be flipped after making move 
        const timeToMakeMove = moveTimeStamp.getTime() - this.lastMoveTime.getTime();
        if(turn === 'b' ){
            this.player1TimeConsumed = this.player1TimeConsumed + timeToMakeMove;
        }else{
            this.player2TimeConsumed = this.player2TimeConsumed + timeToMakeMove;
        }

        await this.addMoveToDb(move, moveTimeStamp);
        this.resetAbandonedTimer();
        this.resetMoveTimer();

        this.lastMoveTime = moveTimeStamp;

        SocketManager.getInstance().broadcast(
            this.gameId,
            JSON.stringify({
                type: MOVE,
                payload: {
                    move,
                    player1TimeConsumed: this.player1TimeConsumed,
                    player2TimeConsumed: this.player2TimeConsumed
                }
            })
        )

        if(this.board.isGameOver()){
            const result = this.board.isDraw() 
            ? "DRAW" 
            : turn === 'b' ? "WHITE_WINS" : "BLACK_WINS";

            this.endGame("COMPLETED", result);
        }
        this.moveCount++;
    }

    getPlayer1TimeConsumed(){
        if(this.board.turn() === 'w'){
            return this.player1TimeConsumed + (new Date(Date.now()).getTime() - this.lastMoveTime.getTime());
        }
        return this.player1TimeConsumed;
    }

    getPlayer2TimeConsumed(){
        if(this.board.turn() === 'b'){
            return this.player2TimeConsumed + (new Date(Date.now()).getTime() - this.lastMoveTime.getTime());
        }
        return this.player2TimeConsumed;
    }

    async resetAbandonedTimer(){
        if(this.timer){
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(()=> {
            this.endGame("ABANDONED", this.board.turn() === 'b' ? "WHITE_WINS":"BLACK_WINS")
        }, 60*1000);
    }

    async resetMoveTimer(){
        if(this.moveTimer){
            clearTimeout(this.moveTimer);
        }

        const turn = this.board.turn();
        const timeLeft = GAME_TIME_MS - (turn === 'w' ? this.player1TimeConsumed: this.player2TimeConsumed);
        this.moveTimer = setTimeout(()=> {
            this.endGame("TIME_UP", turn === 'b' ? "WHITE_WINS": "BLACK_WINS")
        }, timeLeft);
    }

    async endGame(status:GameStatus, result:GameResult){
        const updatedGame = await db.game.update({
            data: {
                status,
                result
            },
            where: {
                id: this.gameId
            },
            include: {
                moves: {
                    orderBy: {
                        moveNumber: "asc"
                    }
                },
                whitePlayer: true,
                blackPlayer: true
            }
        });

        SocketManager.getInstance().broadcast(
            this.gameId,
            JSON.stringify({
                type: GAME_ENDED,
                payload: {
                    result,
                    status,
                    moves: updatedGame.moves,
                    whitePlayer:{
                        name: updatedGame.whitePlayer.name,
                        id: updatedGame.whitePlayer.id
                    },
                    blackPlayer:{
                        name: updatedGame.blackPlayer.name,
                        id: updatedGame.blackPlayer.id
                    },
                }
            })
        )

        this.clearMoveTimer();
        this.clearTimer();
    }

    async clearMoveTimer(){
        if(this.moveTimer){
            clearTimeout(this.moveTimer);
        }
    }

    async setTimer(timer : NodeJS.Timeout){
        this.timer = timer;
    }

    async clearTimer(){
        if(this.timer){
            clearTimeout(this.timer);
        }
    }
}