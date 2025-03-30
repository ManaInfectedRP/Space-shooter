import React, {useState, useEffect} from "react";
import './Main.css'

export default function ObstacleAvoidance() {
    const [playerX, setPlayerX] = useState(375);
    const [obstacles, setObstacles] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        if (gameOver) return;
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft" && playerX > 50) {
                setPlayerX((prev) => prev - 50);
            } else if (e.key === "ArrowRight" && playerX < 700) {
                setPlayerX((prev) => prev + 50);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [playerX, gameOver]);

    useEffect(() => {
        if (gameOver) return;
        const interval = setInterval(() => {
            setObstacles((prev) =>
                prev
                    .map((obstacle) => ({ ...obstacle, y: obstacle.y + 10 }))
                    .filter((obstacle) => obstacle.y < 600)
            );
            setTimer((prev) => prev + 1);
            if (Math.random() < 0.1) {
                const obstacleWidth = (Math.floor(Math.random() * 2) + 4) * 50; // 4-5 blocks wide
                const obstacleX = Math.random() * (800 - obstacleWidth);
                setObstacles((prev) => [...prev, { x: obstacleX, y: 0, width: obstacleWidth }]);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [gameOver]);

    useEffect(() => {
        obstacles.forEach((obstacle) => {
            if (
                obstacle.y > 550 &&
                playerX + 50 > obstacle.x &&
                playerX < obstacle.x + obstacle.width
            ) {
                setGameOver(true);
            }
        });
    }, [obstacles, playerX]);

    return (
        <div style={{ width: 800, height: 600, background: "black", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: playerX, top: 550, width: 50, height: 50, background: "blue" }} />
            {obstacles.map((obstacle, index) => (
                <div key={index} style={{ position: "absolute", left: obstacle.x, top: obstacle.y, width: obstacle.width, height: 50, background: "red" }} />
            ))}
            <div style={{ position: "absolute", top: 10, left: 10, color: "white" }}>Time: {timer}</div>
            {gameOver && (
                <div style={{position: "absolute", top: 250, left: 250, color: "white", fontSize: 30}}>
                    Game Over! Time: {timer} <br/>
                    <button onClick={() => {
                        setPlayerX(375);
                        setObstacles([]);
                        setTimer(0);
                        setGameOver(false);
                    }}>Restart
                    </button>
                    <div>
                        <button onClick={() => window.location.reload()} className="button-style">Main Menu</button>
                    </div>
                </div>
            )}
        </div>
    );
}
