import React, { useEffect, useState } from "react";
import { generateCards } from "./MemoryGame/cards";
import Card from "./MemoryGame/Card";

export default function MemoryGame() {
    const [cards, setCards] = useState([]);
    const [first, setFirst] = useState(null);
    const [second, setSecond] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minuter
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    useEffect(() => {
        startGame();
    }, []);

    useEffect(() => {
        let timer;
        if (timeLeft > 0 && !gameOver && !gameWon) {
            timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        } else if (timeLeft === 0) {
            setGameOver(true);
        }
        return () => clearInterval(timer);
    }, [timeLeft, gameOver, gameWon]);

    useEffect(() => {
        if (first && second) {
            setDisabled(true);
            if (first.symbol === second.symbol) {
                setCards((prev) =>
                    prev.map((card) =>
                        card.symbol === first.symbol ? { ...card, matched: true } : card
                    )
                );
                resetTurn();
            } else {
                setTimeout(() => resetTurn(), 1000);
            }
        }
    }, [first, second]);

    useEffect(() => {
        if (cards.length > 0 && cards.every((card) => card.matched)) {
            setGameWon(true);
        }
    }, [cards]);

    const handleClick = (card) => {
        if (disabled || gameOver || gameWon) return;
        if (!first) {
            setFirst(card);
        } else if (first.id !== card.id) {
            setSecond(card);
        }
    };

    const resetTurn = () => {
        setFirst(null);
        setSecond(null);
        setDisabled(false);
    };

    const startGame = () => {
        setCards(generateCards());
        setFirst(null);
        setSecond(null);
        setDisabled(false);
        setTimeLeft(120);
        setGameOver(false);
        setGameWon(false);
    };

    return (
        <div style={{textAlign: "center", padding: "20px"}}>
            <h1>🧠 Memory Game</h1>
            <h2>⏱️ Tid kvar: {timeLeft} sek</h2>

            {(gameOver || gameWon) && (
                <div style={{margin: "20px"}}>
                    {gameOver && <h2>⛔ Tiden är slut!</h2>}
                    {gameWon && <h2>🎉 Du vann!</h2>}
                    <button onClick={startGame}>🔁 Försök igen</button>
                </div>
            )}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 80px)",
                    gap: "10px",
                    justifyContent: "center",
                    opacity: gameOver ? 0.4 : 1,
                }}
            >
                {cards.map((card) => (
                    <Card
                        key={card.id}
                        card={card}
                        onClick={handleClick}
                        flipped={card === first || card === second || card.matched}
                        disabled={disabled}
                    />
                ))}
            </div>
            <div>
                <button onClick={() => window.location.reload()} className="button-style">Main Menu</button>
            </div>
        </div>

    );
}