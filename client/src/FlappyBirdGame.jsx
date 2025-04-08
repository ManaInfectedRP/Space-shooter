import React, { useEffect, useState, useRef } from "react";
import Bird from "./FlappyBird/Bird.jsx";
import Pipe from "./FlappyBird/Pipe.jsx";

const GAME_HEIGHT = 700;
const GAME_WIDTH = 600;
const GRAVITY = 2;
const JUMP_HEIGHT = 60;
const PIPE_WIDTH = 60;
const PIPE_GAP = 180;

export default function FlappyBirdGame() {
    const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
    const [pipes, setPipes] = useState([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const gameRef = useRef();

    // Gravity loop
    useEffect(() => {
        if (gameOver) return;
        const interval = setInterval(() => {
            setBirdY((prev) => Math.min(prev + GRAVITY, GAME_HEIGHT - 40));
        }, 24);
        return () => clearInterval(interval);
    }, [gameOver]);

    // Spawn pipes
    useEffect(() => {
        if (gameOver) return;
        const spawn = setInterval(() => {
            const topHeight = Math.floor(Math.random() * (GAME_HEIGHT - PIPE_GAP - 200)) + 50;
            setPipes((prev) => [
                ...prev,
                { x: GAME_WIDTH, top: topHeight, passed: false },
            ]);
        }, 2000);
        return () => clearInterval(spawn);
    }, [gameOver]);

    // Move pipes
    useEffect(() => {
        if (gameOver) return;
        const move = setInterval(() => {
            setPipes((prev) =>
                prev
                    .map((pipe) => ({ ...pipe, x: pipe.x - 5 }))
                    .filter((pipe) => pipe.x + PIPE_WIDTH > 0)
            );
        }, 24);
        return () => clearInterval(move);
    }, [gameOver]);

    // Check collisions
    useEffect(() => {
        for (const pipe of pipes) {
            if (
                pipe.x < 100 + 40 && // birdX + birdWidth
                pipe.x + PIPE_WIDTH > 100 && // birdX
                (birdY < pipe.top || birdY + 40 > pipe.top + PIPE_GAP)
            ) {
                setGameOver(true);
            }

            if (!pipe.passed && pipe.x + PIPE_WIDTH < 100) {
                pipe.passed = true;
                setScore((prev) => prev + 1);
            }
        }

        if (birdY >= GAME_HEIGHT - 40 || birdY <= 0) {
            setGameOver(true);
        }
    }, [pipes, birdY]);

    const handleJump = () => {
        if (gameOver) return;
        setBirdY((prev) => Math.max(prev - JUMP_HEIGHT, 0));
    };

    const handleRestart = () => {
        setBirdY(GAME_HEIGHT / 2);
        setPipes([]);
        setScore(0);
        setGameOver(false);
    };

    // Keyboard control
    useEffect(() => {
        const onKey = (e) => {
            if (e.code === "Space") handleJump();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [gameOver]);

    return (
        <div>
            <div
                ref={gameRef}
                onClick={handleJump}
                style={{
                    width: GAME_WIDTH,
                    height: GAME_HEIGHT,
                    background: "#70c5ce",
                    overflow: "hidden",
                    margin: "0 auto",
                    position: "relative",
                    border: "3px solid #333",
                }}
            >
                <Bird y={birdY}/>
                {pipes.map((pipe, index) => (
                    <Pipe key={index} x={pipe.x} topHeight={pipe.top} gap={PIPE_GAP}/>
                ))}
                <div
                    style={{
                        position: "absolute",
                        top: 10,
                        left: 20,
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#fff",
                        textShadow: "2px 2px #000",
                    }}
                >
                    Score: {score}
                </div>
                {gameOver && (
                    <div>
                        <h2>💀 Game Over</h2>
                        <p>Poäng: {score}</p>
                        <button onClick={handleRestart}>🔁 Försök igen</button>
                    </div>
                )}
            </div>
            <div>
            <button onClick={() => window.location.reload()} className="button-style">Main Menu</button>
            </div>
        </div>
    );
}
