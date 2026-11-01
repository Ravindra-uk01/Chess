import { GameStatus } from '@repo/db';
import { Game } from "./Game";
import { WebSocket } from 'ws';
import { SocketManager, User } from "./SocketManager";
import { db } from "./db";
import { GAME_ALERT, GAME_ENDED, GAME_JOINED, GAME_NOT_FOUND, GAME_NOTIFY, INIT_GAME, JOIN_ROOM, MOVE, GAME_ADDED } from "./messages";


export class GameManager {
    private games: Game[];
    private users: User[];
    private pendingGameId: string | null;

    constructor() {
        this.games = [];
        this.users = [];
        this.pendingGameId = null;
    }

    addUser(user: User) {
        this.users.push(user);
        this.addHandler(user);
    }

    removeUser(socket: WebSocket) {
        const user = this.users.find((user) => user.socket === socket);

        if(!user){
            console.error('No user found ');
            return;
        }

        this.users = this.users.filter((user) => user.socket !== socket);
        SocketManager.getInstance().removeUser(user);
    }

    removeGame(gameId: string) {
        this.games = this.games.filter((game) => game.gameId !== gameId);
    }

    private addHandler(user:User){
        user.socket.on("message", async(data) =>{
            const message = JSON.parse(data.toString());
            if(message.type === INIT_GAME){
                const targetGameId = message.gameId || message.payload?.gameId;
                if (targetGameId) {
                    const game = this.games.find((g) => g.gameId === targetGameId);
                    if (!game) {
                        user.socket.send(JSON.stringify({
                            type: GAME_ALERT,
                            payload: { message: "Game not found or has already started." }
                        }));
                        return;
                    }
                    if (user.userId === game.player1UserId) {
                        user.socket.send(JSON.stringify({
                            type: GAME_ALERT,
                            payload: { message: "Trying to connect with yourself?" }
                        }));
                        return;
                    }

                    SocketManager.getInstance().addUser(user, game.gameId);
                    await game.updateSecondPlayer(user.userId);
                    if (this.pendingGameId === targetGameId) {
                        this.pendingGameId = null;
                    }
                    return;
                }

                if(this.pendingGameId){
                    const game = this.games.find((game) => game.gameId === this.pendingGameId);
                    if(!game){
                        console.error("Pending game not found");
                        return;
                    }

                    if(user.userId === game.player1UserId){
                        SocketManager.getInstance().broadcast(
                            game.gameId,
                            JSON.stringify({
                                type: GAME_ALERT,
                                payload: {
                                    message: "Trying to connect with yourself?"
                                }
                            })
                        );
                        return;
                    }

                    SocketManager.getInstance().addUser(user, game.gameId);
                    await game?.updateSecondPlayer(user.userId);
                    this.pendingGameId = null;
                }else{
                    const game = new Game(user.userId, null);
                    this.pendingGameId = game.gameId;
                    this.games.push(game);

                    SocketManager.getInstance().addUser(user, game.gameId);
                    SocketManager.getInstance().broadcast(
                        game.gameId,
                        JSON.stringify({
                            type: GAME_ADDED,
                            gameId: game.gameId
                        })
                    );
                }
            }

            if(message.type === MOVE){
                const gameId = message.payload.gameId;
                const game = this.games.find((game) => game.gameId === gameId);
                if(game){
                    game.makeMove(user, message.payload.move);
                    if(game.result){
                        this.removeGame(gameId);
                    }
                }
            }

            if(message.type === JOIN_ROOM){
                const gameId = message.payload?.gameId;
                if(!gameId){
                    console.error("No game Id found");
                    return ;
                }

                let availableGame = this.games.find((game) => game.gameId === gameId);

                // Handle pending game joining before DB creation
                if (availableGame && !availableGame.player2UserId) {
                    if (availableGame.player1UserId === user.userId) {
                        SocketManager.getInstance().addUser(user, availableGame.gameId);
                        user.socket.send(JSON.stringify({
                            type: GAME_ADDED,
                            gameId: availableGame.gameId
                        }));
                        return;
                    }

                    SocketManager.getInstance().addUser(user, availableGame.gameId);
                    await availableGame.updateSecondPlayer(user.userId);
                    if (this.pendingGameId === availableGame.gameId) {
                        this.pendingGameId = null;
                    }
                    return;
                }

                const gameFromDb = await db.game.findUnique({
                    where: {id: gameId},
                    include: {
                        moves: {
                            orderBy: {
                                moveNumber: "asc"
                            }
                        },
                        whitePlayer: true,
                        blackPlayer: true,
                    }
                });

                if(!gameFromDb){
                    user.socket.send(
                        JSON.stringify({
                            type: GAME_NOT_FOUND,
                        })
                    )
                    return;
                }

                if(gameFromDb.status !== GameStatus.IN_PROGRESS){
                    user.socket.send(JSON.stringify({
                        type: GAME_ENDED,
                        payload:{
                            result: gameFromDb.result,
                            status: gameFromDb.status,
                            moves: gameFromDb.moves,
                            whitePlayer: {
                                id: gameFromDb.whitePlayer.id,
                                name: gameFromDb.whitePlayer.name
                            },
                            blackPlayer: {
                                id: gameFromDb.blackPlayer.id,
                                name: gameFromDb.blackPlayer.name
                            }
                        }
                    }))
                    return;
                }

                if(!availableGame){
                    const game = new Game(
                        gameFromDb?.whitePlayer.id,
                        gameFromDb?.blackPlayer.id,
                        gameFromDb.id,
                        gameFromDb.startAt,
                    );
                    game.seedMoves(gameFromDb?.moves || []);
                    this.games.push(game);
                    availableGame = game;
                }

                user.socket.send(
                    JSON.stringify({
                        type: GAME_JOINED,
                        payload: {
                            gameId,
                            moves: gameFromDb.moves,
                            whitePlayer: {
                                id: gameFromDb.whitePlayer.id,
                                name: gameFromDb.whitePlayer.name
                            },
                            blackPlayer: {
                                id: gameFromDb.blackPlayer.id,
                                name: gameFromDb.blackPlayer.id
                            },
                            player1TimeConsumed: availableGame.getPlayer1TimeConsumed(),
                            player2TimeConsumed: availableGame.getPlayer2TimeConsumed()
                        }
                    })
                )

                SocketManager.getInstance().addUser(user, gameId);

            }

        });
    }

}