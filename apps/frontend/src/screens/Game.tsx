import { useUser } from "@repo/store/useUser";
import { useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import { useParams } from "react-router-dom";

function Game(){

    const user = useUser();

    useEffect(() => {
    if (!user) {
        window.location.href = '/login';
        }
    }, [user]);

    const socket = useSocket();
    const {gameId} = useParams();

    console.log('Current user in Game component:', user);
    console.log('Current gameId in Game component:', gameId);
    return (
        <h1> Game</h1>
    )
}


export default Game;