import {WebSocket} from "ws";
import {useEffect, useRef, useState} from "react";
import { useUser } from "@repo/store/useUser";

const WS_URL = import.meta.env.VITE_APP_WEBSOCKET_URL || "ws://localhost:8080";

export const useSocket = () => {

    const [socket, setSocket] = useState<WebSocket | null>(null);
    const user = useUser();

    useEffect(() => {
        if(!user){
            return;
        }

        const ws = new WebSocket(`{WS_URL}?token=${user.token}`);

        ws.onopen = () => {
            console.log("WebSocket connection established");
            setSocket(ws);
        }

        ws.onclose = () => {
            console.log("WebSocket connection closed");
            setSocket(null);
        }

        return () => {
            ws.close();
        }

    }, [user]);

    return socket;
};