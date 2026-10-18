import { WebSocket } from 'ws';
import {randomUUID} from "crypto";

export class User {
    public id: string;
    public socket: WebSocket;
    public userId: string;

    constructor(socket: WebSocket, userId: string) {
        this.socket = socket;
        this.userId = userId;
        this.id = randomUUID(); 
    }
}

export class SocketManager {
    private static instance: SocketManager;
    private interestedSockets: Map<string, User[]> = new Map();
    private userRoomMapping: Map<string, string> = new Map(); 

    private constructor() {
        this.interestedSockets = new Map<string, User[]>();
        this.userRoomMapping = new Map<string, string>();
    }

    static getInstance(){
        if(this.instance){
            return this.instance;
        }

        this.instance = new SocketManager();
        return this.instance;
    }

    addUser(user:User, roomId: string){
        this.interestedSockets.set(roomId, 
            [
                ...(this.interestedSockets.get(roomId) || []),
                user
            ]
        )

        this.userRoomMapping.set(user.userId, roomId);
    }

    broadcast(roomId:string, message:string){
        const users = this.interestedSockets.get(roomId);
        if(!users){
            console.error('No users in room?');
            return;
        }
        users?.forEach(user => {
            user.socket.send(message);
        })
    }

    removeUser(user: User){
        const roomId = this.userRoomMapping.get(user.userId);
        if(!roomId){
            console.error("User was not interested in any room? ");
            return;
        }

        const remainingUsers = (this.interestedSockets.get(roomId) ?? []).filter(u => u.userId != user.userId) || [];
        this.interestedSockets.set(roomId, remainingUsers);

        if(remainingUsers.length === 0){
            this.interestedSockets.delete(roomId);
        }
        else {
            this.interestedSockets.set(roomId, remainingUsers);
        }

        this.userRoomMapping.delete(user.userId);
    }
}
