import { useEffect, useState } from "react";
import { Chessboard } from "../components/Chessboard";
import { useSocket } from "../hooks/useSocket";
import "../styles/common.css";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME: {
          setBoard(chess.board());
          setStarted(true);
          break;
        }
        case MOVE: {
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          break;
        }
        case GAME_OVER: {
          console.log(" game over");
          break;
        }
      }
    };
  }, [socket]);

  if (!socket) return <div>Connecting...</div>;
  return (
    <div className="base-container ">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4 w-full">
          {/* <div className="col-span-4 bg-red-200 flex justify-center">
            <div>
              <p>opponet info</p>
            </div>
            <div className="flex justify-center items-center w-full ">
              <Chessboard board={board} />
            </div>
            <div></div>
          </div> */}
          <div className="col-span-4 w-full flex justify-center">
            <Chessboard chess={chess} board={board} setBoard={setBoard} socket={socket} />
          </div>

          <div className="col-span-2 pt-8 bg-[#0003]">
           {!started && <div className=" bg-green-700 m-4 p-4 w-40 text-white text-bold ">
              <button
                onClick={() => {
                  socket.send(
                    JSON.stringify({
                      type: INIT_GAME,
                    })
                  );
                }}
                type="button"
              >
                Play
              </button>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};
