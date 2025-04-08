import React, { useState, useEffect } from "react";

const GRID_SIZE = 10;
const MINES_COUNT = 15;

const generateBoard = () => {
    let board = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill({ mine: false, revealed: false, flagged: false, count: 0 }));
    let minesPlaced = 0;

    while (minesPlaced < MINES_COUNT) {
        let x = Math.floor(Math.random() * GRID_SIZE);
        let y = Math.floor(Math.random() * GRID_SIZE);

        if (!board[x][y].mine) {
            board[x][y] = { ...board[x][y], mine: true };
            minesPlaced++;
        }
    }

    // Calculate numbers
    for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
            if (!board[x][y].mine) {
                let count = 0;
                [-1, 0, 1].forEach(dx => {
                    [-1, 0, 1].forEach(dy => {
                        let nx = x + dx, ny = y + dy;
                        if (nx >= 0 && ny >= 0 && nx < GRID_SIZE && ny < GRID_SIZE && board[nx][ny].mine) {
                            count++;
                        }
                    });
                });
                board[x][y] = { ...board[x][y], count };
            }
        }
    }
    return board;
};

const Minesweeper = () => {
    const [board, setBoard] = useState(generateBoard());
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [debugMode, setDebugMode] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    useEffect(() => {
        if (!gameOver) {
            const allRevealed = board.flat().filter(cell => !cell.mine).every(cell => cell.revealed);
            if (allRevealed) {
                setGameWon(true);
            }
        }
    }, [board, gameOver]);

    const revealCell = (x, y) => {
        if (board[x][y].revealed || board[x][y].flagged || gameOver) return;
        if (board[x][y].revealed || board[x][y].flagged || gameOver || gameWon) return;
        if (board[x][y].mine) {
            setGameOver(true);
            setBoard(prevBoard => prevBoard.map(row => row.map(cell => ({ ...cell, revealed: true }))));
            return;
        }

        let newBoard = board.map(row => row.map(cell => ({ ...cell })));
        let newScore = score;

        const reveal = (cx, cy) => {
            if (cx < 0 || cy < 0 || cx >= GRID_SIZE || cy >= GRID_SIZE || newBoard[cx][cy].revealed || newBoard[cx][cy].mine) return;
            newBoard[cx][cy].revealed = true;
            newScore++;
            if (newBoard[cx][cy].count === 0) {
                [-1, 0, 1].forEach(dx => {
                    [-1, 0, 1].forEach(dy => {
                        if (dx !== 0 || dy !== 0) reveal(cx + dx, cy + dy);
                    });
                });
            }
        };
        reveal(x, y);
        setBoard(newBoard);
        setScore(newScore);
    };

    const restartGame = () => {
        setBoard(generateBoard());
        setGameOver(false);
        setGameWon(false);
        setScore(0);
    };

    return (
        <div style={{textAlign: "center", fontFamily: "Arial, sans-serif"}}>
            <h1>Minesweeper</h1>
            <h2>Score: {score}</h2>
            {gameOver && <h2 style={{color: "red"}}>Game Over!</h2>}

            {gameWon && <h2 style={{ color: "green" }}>Congratulations! You cleared the screen. Total Score: {score}</h2>}
            {gameOver || gameWon && <button onClick={restartGame}
                                 style={{padding: "10px", marginBottom: "10px", cursor: "pointer"}}>Restart</button>}
            {gameOver || gameWon &&
                <div>
                    <button onClick={() => window.location.reload()} className="button-style">Main Menu</button>
                </div>
            }
            <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(${GRID_SIZE}, 40px)`,
                gap: "2px",
                justifyContent: "center",
                marginTop: "20px"
            }}>
                {board.map((row, x) =>
                    row.map((cell, y) => (
                        <button
                            key={`${x}-${y}`}
                            onClick={() => revealCell(x, y)}
                            disabled={gameOver}
                            style={{
                                width: 40,
                                height: 40,
                                fontSize: "12px",
                                fontWeight: "bold",
                                textAlign: "center",
                                backgroundColor: cell.revealed ? (cell.mine ? "red" : "#ddd") : "#999",
                                border: "1px solid #666",
                                cursor: gameOver ? "not-allowed" : "pointer",
                                color: debugMode && cell.mine ? "red" : "black"
                            }}
                        >
                            {debugMode ? `${x + 1},${y + 1}` : cell.revealed ? (cell.mine ? "💣" : cell.count || "") : ""}
                        </button>
                    ))
                )}
            </div>
            <button
                id="toggle-debug"
                onClick={() => setDebugMode(!debugMode)}
                    style={{padding: "10px", marginLeft: "10px", cursor: "pointer"}}>Toggle Debug
            </button>

        </div>
    );
};

export default Minesweeper;
