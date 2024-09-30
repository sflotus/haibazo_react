import {useEffect, useState} from "react";
import Swal from "sweetalert2";

function Game() {
    const [inputNumber, setInputNumber] = useState(0)
    const [numCircles, setNumCircles] = useState(0)
    const [circles, setCircles] = useState([]);
    const [points, setPoints] = useState(0)
    const [time, setTime] = useState(0)
    const [isEndGame, setIsEndGame] = useState(false)
    const [isGameStarted, setIsGameStarted] = useState(false)
    const [nextCircleId, setNextCircleId] = useState(1)
    useEffect(() => {
        // khi numCircles thì sẽ render lại
        setCircles(generateCircles(numCircles));
    }, [numCircles]);

    useEffect(() => {
        //tính thời gian khi trò chơi bắt đầu
        let timer;
        if (isGameStarted && !isEndGame) {
            timer = setInterval(() => setTime((t) => t + 0.1), 100);
        }
        return () => clearInterval(timer);
    }, [isGameStarted, isEndGame]);
    //func khi người dùng nhấp vào một vòng tròn
    const handleCircleClick = (id) => {
        if (id === nextCircleId) {
            setCircles(circles.filter((circle) => circle.id !== id));
            setPoints(prevState => prevState+1); // thêm điểm khi click đúng
            setNextCircleId(prevState => prevState+1); // Cập nhật vòng tròn tiếp theo cần nhấp
            // End game nếu vòng cuối cùng được nhấp
            if (nextCircleId === numCircles) {
                setIsEndGame(true); // Kết thúc trò chơi khi tất cả vòng tròn bị xóa
                Swal.fire({
                    title: "ALL CLEARED!",
                    text: "You have finished the game",
                    icon: "success"
                });

            }
        }
    };
    const restartGame = () => {
        if(inputNumber <1){
            Swal.fire({
                title: "Error",
                text: "Number of Circles must be greater than 0",
                icon: "error"
            });
        } else {
            setNumCircles(inputNumber); // Cập nhật số lượng vòng tròn từ input
            setCircles(generateCircles(inputNumber)); // Tạo lại các vòng tròn
            setPoints(0); // Reset điểm
            setTime(0); // Reset thời gian
            setIsEndGame(false); // Trò chơi không còn kết thúc
            setIsGameStarted(true); // Bắt đầu trò chơi
            setNextCircleId(1); // Reset vòng tròn cần nhấp tiếp theo về 1
        }
    };
    const generateCircles = (num) => {
        const circles = [];
        for (let i = 1; i <= num; i++) {
            circles.push({ id: i, x: Math.random() * 800, y: Math.random() * 400 });
        }
        return circles;
    };
    return(
        <>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-4">LET'S PLAY</h1>
                <div className="mb-6">
                    <label className="mr-2">Number of Circles:</label>
                    <input
                        type="number"
                        min="1"
                        value={inputNumber}
                        onChange={(e) => setInputNumber(Number(e.target.value))}
                        className="px-2 py-1 border rounded"
                    />
                </div>
                <div className="flex space-x-6 mb-6">
                    <span className="text-lg">Points: {points}</span>
                    <span className="text-lg">Time: {time.toFixed(1)}s</span>
                </div>
                {isEndGame && <div className="text-green-500 font-bold mb-4"></div>}
                <button
                    onClick={restartGame}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mb-6"
                >
                    Restart
                </button>
                <div className="relative w-[1000px] h-[600px] bg-white border border-gray-300 rounded-lg">
                    {circles.map((circle) => (
                        <Circle key={circle.id} {...circle}
                                onClick={handleCircleClick}
                                nextCircleId={nextCircleId}/>
                    ))}
                </div>
            </div>
        </>
    )
}
function Circle({ id, x, y, onClick, nextCircleId  }) {
    const [isClicked, setIsClicked] = useState(false);
    const handleClick = () => {
        if(id === nextCircleId){
            setIsClicked(true); // chuyển thành clicked khi click vào vòng tròn
            setTimeout(() => {
                onClick(id); // Xóa vòng tròn sau khi hiệu ứng kết thúc
            }, 1000); // Thời gian delay 1s trước khi vòng tròn biến mất
        } else Swal.fire({
            title: "Error",
            text: `The next Circle is ${nextCircleId}`,
            icon: "error"
        });
    };
    return (
        <div
            className={`absolute flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transform transition-all duration-1000 ease-in-out
        ${isClicked ? "bg-red-500 scale-150 opacity-0" : "bg-blue-500 text-white"}`}
            style={{left: `${x}px`, top: `${y}px`}}
            onClick={handleClick}
        >
            {id}
        </div>
    );
}
export default Game