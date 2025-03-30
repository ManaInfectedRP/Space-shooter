import React, { useState, useEffect } from "react";
import "./CandyCrush.css";

const numRows = 8;
const numCols = 8;
const emojis = ["🍎", "🔵", "🍀", "🌞", "🍇", "🍊", "🍬", "💎"];

// Funktion för att slumpa en emoji
const getRandomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

// Skapar spelplanen med slumpmässiga emojis
const createBoard = () => {
    return Array.from({ length: numRows }, () => Array.from({ length: numCols }, getRandomEmoji));
};

const CandyCrush = () => {
    const [board, setBoard] = useState(createBoard()); // Håller spelplanen
    const [score, setScore] = useState(0); // Håller spelarens poäng
    const [selected, setSelected] = useState(null); // Håller koll på vald ruta
    const [gameOver, setGameOver] = useState(false); // Håller koll om spelet är över
    const [swaps, setSwaps] = useState(10); // Antal byten kvar

    // Använder en useEffect för att kontinuerligt kolla efter matchningar
    useEffect(() => {
        const interval = setInterval(() => {
            checkMatches();
        }, 200);
        return () => clearInterval(interval);
    }, [board]);

    // Hanterar när en ruta klickas
    const handleTileClick = (row, col) => {
        if (gameOver) return;
        if (!selected) {
            setSelected({ row, col });
        } else {
            swapTiles(selected.row, selected.col, row, col);
            setSelected(null);
        }
    };

    // Byter plats på två valda rutor
    const swapTiles = (row1, col1, row2, col2) => {
        if (gameOver || Math.abs(row1 - row2) + Math.abs(col1 - col2) !== 1) return;

        let newBoard = board.map(row => [...row]);
        [newBoard[row1][col1], newBoard[row2][col2]] = [newBoard[row2][col2], newBoard[row1][col1]];

        setBoard(newBoard);
        setSwaps(prev => prev - 1);
        if (swaps - 1 <= 0) {
            setGameOver(true);
        }
        setTimeout(checkMatches, 200);
    };

    // Kollar efter tre-i-rad och tar bort matchningar
    const checkMatches = () => {
        let matches = new Set();
        let newBoard = board.map(row => [...row]);

        // Kolla horisontella matchningar
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols - 2; col++) {
                if (
                    newBoard[row][col] &&
                    newBoard[row][col] === newBoard[row][col + 1] &&
                    newBoard[row][col] === newBoard[row][col + 2]
                ) {
                    matches.add(`${row}-${col}`);
                    matches.add(`${row}-${col + 1}`);
                    matches.add(`${row}-${col + 2}`);
                }
            }
        }

        // Kolla vertikala matchningar
        for (let col = 0; col < numCols; col++) {
            for (let row = 0; row < numRows - 2; row++) {
                if (
                    newBoard[row][col] &&
                    newBoard[row][col] === newBoard[row + 1][col] &&
                    newBoard[row][col] === newBoard[row + 2][col]
                ) {
                    matches.add(`${row}-${col}`);
                    matches.add(`${row + 1}-${col}`);
                    matches.add(`${row + 2}-${col}`);
                }
            }
        }

        if (matches.size > 0) {
            matches.forEach(match => {
                const [r, c] = match.split("-").map(Number);
                newBoard[r][c] = ""; // Tar bort matchade emojis
            });

            setTimeout(() => {
                dropCandies(newBoard);
                setScore(prev => prev + matches.size * 10); // Uppdaterar poängen
            }, 200);
        }
    };

    // Fyller på spelplanen med nya emojis efter att matchningar har försvunnit
    const dropCandies = (board) => {
        for (let col = 0; col < numCols; col++) {
            let emptySpaces = 0;
            for (let row = numRows - 1; row >= 0; row--) {
                if (!board[row][col]) {
                    emptySpaces++;
                } else if (emptySpaces > 0) {
                    board[row + emptySpaces][col] = board[row][col];
                    board[row][col] = "";
                }
            }
            for (let r = 0; r < emptySpaces; r++) {
                board[r][col] = getRandomEmoji();
            }
        }
        setBoard([...board]);
    };

    // Startar om spelet
    const restartGame = () => {
        setBoard(createBoard());
        setScore(0);
        setSwaps(10);
        setGameOver(false);
    };

    return (
        <div>
            <h1>Candy Crush</h1>
            <h2>Poäng: {score}</h2>
            <h2>Swaps kvar: {swaps}</h2>
            {gameOver ? (
                <div>
                    <h2>Spelet är över!</h2>
                    <h3>Din poäng: {score}</h3>
                    <button onClick={restartGame}>Starta om</button>
                </div>
            ) : (
                <div className="board">
                    {board.map((row, rIdx) =>
                        row.map((emoji, cIdx) => (
                            <div
                                key={`${rIdx}-${cIdx}`}
                                className={`tile ${selected && selected.row === rIdx && selected.col === cIdx ? "selected" : ""}`}
                                onClick={() => handleTileClick(rIdx, cIdx)}
                            >
                                {emoji || "⬜"} {/* Om en ruta är tom, visa en vit fyrkant */}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default CandyCrush;
