import { WebSocket } from "ws";

export class Game{
    public player1: WebSocket;
    public player2: WebSocket;
    private board: string;
    private moves: string[];
    private startTime: Date;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = "";
        this.moves = [];
        this.startTime = new Date();
    }

    makeMove() {
        // validate move
        // is it correct user for move
        // is the move is valid 

        // update the board
        //push the move 

        // check if game is over 

        // send updated board to both the user

    }
}