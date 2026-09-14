import { WebSocketServer } from 'ws';


const wss = new WebSocketServer({port: 8080});

wss.on("connection", (ws, req)=> {

    console.log('reached here');
     //@ts-ignore
    // const token: string = url.parse(req.url, true).query.token;
    // const userId = extractUserId(token);
    // gameManager.addUser(new User(ws, userId));

    // ws.on('close', () => {
    //     gameManager.removeUser(ws);
    // });
});

console.log('done');