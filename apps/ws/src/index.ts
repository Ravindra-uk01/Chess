import { WebSocketServer } from 'ws';
import * as url from 'url';
import { extractUserId } from './auth';
import { GameManager } from './GameManager';
import { User } from './SocketManager';

const wss = new WebSocketServer({port: 8080});

const gameManager = new GameManager();

wss.on("connection", (ws, req)=> {

    console.log('reached here');
    const token = (url.parse(req.url ?? '', true).query.token as string) ?? '';
    const userId = extractUserId(token);
    if (!userId) {
        ws.close(1008, "Unauthorized");
        return;
    }

    gameManager.addUser(new User(ws, userId));

    ws.on('close', ()=> {
        gameManager.removeUser(ws);
    })
});

console.log('done');