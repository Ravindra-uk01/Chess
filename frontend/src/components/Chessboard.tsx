import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const Chessboard = ({
  chess,
  board,
  setBoard,
  socket,
}: {
  chess: any;
  setBoard: any;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
}) => {

  const [from, setFrom] = useState<Square | null>(null);

  // interface SquareData {
  //   square: Square;
  //   type: PieceSymbol;
  //   color: Color;
  // }

  const handleMove = (squareData: Square ) => {
    if (!from) {
      setFrom(squareData);
    } else {
      socket.send(
        JSON.stringify({
          type: MOVE,
          payload: {
            move:{
              from,
              to:squareData,
            }
          },
        })
      );

      setFrom(null);
      chess.move({
        from,
        to:squareData,
      })
      setBoard(chess.board());
    }
  };

  console.log('adding the logic of chess here ')

  return (
    <div className="">
      {board.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row.map((square, j) => {
              const squareRepresantation = String.fromCharCode(97+ (j%8)) + "" + (8-i) as Square;
              return (
                <div
                  onClick={() => handleMove(squareRepresantation)}
                  key={j}
                  className={`w-16 h-16 ${
                    (i + j) % 2 ? "bg-[#f1f1f1]" : "bg-[#81b64c]"
                  }`}
                >
                  <div className="w-full flex justify-center h-full ">
                    <div className="flex flex-col justify-center h-full ">
                      {square ? (
                        <img src={`${square.color === 'b' ? `b${square.type}.png`: `w${square.type}.png`}`} alt="chess pieces" />
                      ) : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
