import "../styles/home.css";

export const Home = () => {
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
          <div className="flex-1 bg-red-200 index_intro">
            <h1 className="index_title ">
              Play Chess Online on the #1 Site
            </h1>
            <div>
              <p>
                <span>1000</span> Games Today
              </p>
              <p>
                <span>100</span>Playing Now
              </p>
            </div>
            <div>
              <button type="button">Play Online</button>
              <button type="button">Play Bots</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
