import React, { useState, useEffect } from "react";

// Konstanter för spelets storlek och hastigheter
const WIDTH = 800;
const HEIGHT = 600;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 10;
const PADDLE_SPEED = 20; // Ökad hastighet för paddlarna
const BALL_SPEED = 5;
const AI_SPEED = 5; // Hastighet för AI:n

const PingPong = () => {
    // State för paddlarnas positioner
    const [leftPaddleY, setLeftPaddleY] = useState(HEIGHT / 2 - PADDLE_HEIGHT / 2);
    const [rightPaddleY, setRightPaddleY] = useState(HEIGHT / 2 - PADDLE_HEIGHT / 2);

    // State för bollens position, rörelseriktning, poängsystem och spelstart
    const [ball, setBall] = useState({ x: WIDTH / 2, y: HEIGHT / 2, dx: 0, dy: 0 });
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    // Lyssnar på tangenttryckningar för att styra paddeln och starta spelet
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowUp" && leftPaddleY > 0) setLeftPaddleY(leftPaddleY - PADDLE_SPEED);
            if (e.key === "ArrowDown" && leftPaddleY < HEIGHT - PADDLE_HEIGHT) setLeftPaddleY(leftPaddleY + PADDLE_SPEED);

            // Starta spelet när Space trycks
            if (e.key === " " && !gameStarted) {
                setGameStarted(true);
                setBall({ x: WIDTH / 2, y: HEIGHT / 2, dx: BALL_SPEED, dy: BALL_SPEED });
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [leftPaddleY, gameStarted]);

    // Uppdaterar bollens rörelse och hanterar kollisioner
    useEffect(() => {
        if (gameOver || !gameStarted) return;
        const interval = setInterval(() => {
            setBall((prev) => {
                let newX = prev.x + prev.dx;
                let newY = prev.y + prev.dy;

                // Kollision med övre och nedre väggar
                if (newY <= 0 || newY >= HEIGHT - BALL_SIZE) {
                    prev.dy *= -1;
                }

                // Kollision med paddlarna och poängsystem
                if (
                    (newX <= PADDLE_WIDTH && prev.y >= leftPaddleY && prev.y <= leftPaddleY + PADDLE_HEIGHT) ||
                    (newX >= WIDTH - PADDLE_WIDTH - BALL_SIZE && prev.y >= rightPaddleY && prev.y <= rightPaddleY + PADDLE_HEIGHT)
                ) {
                    prev.dx *= -1;
                    setScore((s) => s + 1); // Öka poängen vid varje träff
                }

                // Kontrollera om bollen går utanför spelplanen (Game Over)
                if (newX <= 0 || newX >= WIDTH - BALL_SIZE) {
                    setGameOver(true);
                    return prev;
                }

                return { ...prev, x: newX, y: newY };
            });
        }, 20);

        return () => clearInterval(interval);
    }, [leftPaddleY, rightPaddleY, gameOver, gameStarted]);

    // AI för att kontrollera den högra paddeln
    useEffect(() => {
        if (gameOver || !gameStarted) return;
        const aiInterval = setInterval(() => {
            setRightPaddleY((prev) => {
                if (ball.y > prev + PADDLE_HEIGHT / 2) {
                    return Math.min(prev + AI_SPEED, HEIGHT - PADDLE_HEIGHT);
                } else if (ball.y < prev + PADDLE_HEIGHT / 2) {
                    return Math.max(prev - AI_SPEED, 0);
                }
                return prev;
            });
        }, 20);
        return () => clearInterval(aiInterval);
    }, [ball, gameOver, gameStarted]);

    // Funktion för att starta om spelet
    const resetGame = () => {
        setBall({ x: WIDTH / 2, y: HEIGHT / 2, dx: 0, dy: 0 });
        setScore(0); // Återställ poängen vid omstart
        setGameOver(false);
        setGameStarted(false);
    };

    return (
        <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: "black" }}>
            {/* Poängvisning */}
            <div style={{ position: "absolute", top: 10, left: WIDTH / 2 - 30, color: "white", fontSize: "20px" }}>Score: {score}</div>

            {/* Vänster paddel */}
            <div style={{ position: "absolute", left: 0, top: leftPaddleY, width: PADDLE_WIDTH, height: PADDLE_HEIGHT, background: "white" }}></div>
            {/* Höger paddel (AI) */}
            <div style={{ position: "absolute", right: 0, top: rightPaddleY, width: PADDLE_WIDTH, height: PADDLE_HEIGHT, background: "white" }}></div>
            {/* Bollen */}
            <div style={{ position: "absolute", left: ball.x, top: ball.y, width: BALL_SIZE, height: BALL_SIZE, background: "red" }}></div>

            {/* Game Over och Restart-knapp */}
            {gameOver && (
                <div style={{
                    position: "absolute",
                    top: HEIGHT / 2,
                    left: WIDTH / 2 - 75,
                    textAlign: "center",
                    color: "white"
                }}>
                    <h1>Game Over!</h1>
                    <p>Total Score: {score}</p>
                    <button onClick={resetGame} style={{padding: "10px", fontSize: "16px"}}>Restart</button>
                    <div>
                        <button onClick={() => window.location.reload()} className="button-style">Main Menu</button>
                    </div>
                </div>
            )}

            {/* Startmeddelande */}
            {!gameStarted && !gameOver && (
                <div style={{ position: "absolute", top: HEIGHT / 2 - 50, left: WIDTH / 2 - 100, textAlign: "center", color: "white" }}>
                    <h3>Press Space to Start</h3>
                </div>
            )}
        </div>
    );
};

export default PingPong;