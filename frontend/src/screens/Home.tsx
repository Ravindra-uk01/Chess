
export const Home = () => {
    return <div>
        <div className="flex gap-4 pt-8 w-full">
            <div className="flex flex-1 bg-red-200 justify-center items-center">
                <img src="../../public/chessboard.webp" alt="chessboard Image" width={500} height={500}/>
            </div>
            <div className="flex-1 ">
                <h1>Play Chess Online on the #1 Site</h1>
                <p><span>1000</span> Games Today</p>
                <p><span>100</span>Playing Now</p>
                <button>Play Online</button>
            </div>
        </div>
    </div>
}