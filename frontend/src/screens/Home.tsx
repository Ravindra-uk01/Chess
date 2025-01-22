import { useNavigate } from "react-router-dom";
import "../styles/common.css";
import "../styles/home.css";

// TODO  need to add the logicc got bots play
export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="base-container">
      <div className="main-container">
        <div className="grid grid-cols-1 md:grid-cols-2 pt-8 w-full">
          <div className="flex flex-1 justify-center items-center">
            <img
              src="./chessboard.webp"
              alt="chessboard Image"
              width={500}
              height={500}
            />
          </div>
          <div className="flex-1 index_intro ">
            <h1 className="index_title ">
              <span>Play Chess </span>
              <span>Online </span>
              <span>on the #1 Site</span>
            </h1>
            <div className="index_info">
              <p className="index_infoItem">
                <span>1000</span> Games Today
              </p>
              <p className="index_infoItem">
                <span>100</span> Playing Now
              </p>
            </div>
            <div className="index_playButtonsDiv">
              <button type="button" className="index_playButtons" onClick={()=>navigate("/game")}>
                <div className="index_playHand_Icon"></div>
                <div className="index_playButton_info">
                  <h1>Play Online</h1>
                  <p>Play with someone at your level</p>
                </div>
              </button>
              <button type="button" className="index_playButtons">
                <div className="bot_play_Icon" ></div>
                <div className="index_playButton_info">
                  <h1>Play Bots</h1>
                  <p>Play Vs Customizable training bots </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
