import React, { useState, useEffect, useCallback } from 'react';
import './Main.css'

export default function Snake() {
    const [snake, setSnake] = useState([{ x: 5, y: 5 }]); // Ormens position
    const [food, setFood] = useState({ x: 0, y: 0 }); // Sätt en initial värde för maten
    const [direction, setDirection] = useState('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    const gridSize = 20; // Gridstorlek (20x20)

    // Funktion för att generera mat
    const generateFood = () => {
        let x = Math.floor(Math.random() * gridSize);
        let y = Math.floor(Math.random() * gridSize);
        // Se till att maten inte spawns på ormen
        while (snake.some(segment => segment.x === x && segment.y === y)) {
            x = Math.floor(Math.random() * gridSize);
            y = Math.floor(Math.random() * gridSize);
        }
        return { x, y };
    };

    // Sätt initial food-värde när komponenten laddas
    useEffect(() => {
        setFood(generateFood());
    }, []); // Körs bara en gång vid initialisering

    useEffect(() => {
        if (gameOver) return; // Stoppa spelet om det är över
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp': setDirection('UP'); break;
                case 'ArrowDown': setDirection('DOWN'); break;
                case 'ArrowLeft': setDirection('LEFT'); break;
                case 'ArrowRight': setDirection('RIGHT'); break;
                default: break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameOver]);

    useEffect(() => {
        if (gameOver) return; // Stoppa spelet om det är över
        const gameInterval = setInterval(() => {
            moveSnake();
        }, 200); // Hastighet för spelet (justera om du vill att ormen ska röra sig långsammare)

        return () => clearInterval(gameInterval);
    }, [snake, direction, gameOver]);

    const moveSnake = useCallback(() => {
        const newHead = { ...snake[0] };
        switch (direction) {
            case 'UP': newHead.y -= 1; break;
            case 'DOWN': newHead.y += 1; break;
            case 'LEFT': newHead.x -= 1; break;
            case 'RIGHT': newHead.x += 1; break;
            default: break;
        }

        if (checkCollision(newHead)) {
            setGameOver(true);
            return;
        }

        const newSnake = [newHead, ...snake.slice(0, snake.length - 1)];
        if (newHead.x === food.x && newHead.y === food.y) {
            newSnake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
            setFood(generateFood());
            setScore(score + 1); // Uppdatera poängen när ormen äter maten
        }

        setSnake(newSnake);
    }, [snake, direction, food, score]);

    const checkCollision = (head) => {
        // Kolliderar med väggen eller ormen?
        return (
            head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize ||
            snake.some(segment => segment.x === head.x && segment.y === head.y)
        );
    };

    const restartGame = () => {
        setSnake([{ x: 5, y: 5 }]);
        setFood(generateFood());
        setDirection('RIGHT');
        setGameOver(false);
        setScore(0);
    };

    return (
        <div style={{
            display: "flex",              // Flexbox layout
            flexDirection: "column",      // Arrange items in a column
            justifyContent: "top",    // Center vertically
            alignItems: "center",        // Center horizontally
            textAlign: 'center',
            padding: '20px',
            backgroundColor: '#121212',
            color: 'white',
            height: "800px",              // Take full height of the screen
        }}>
            <h1>Snake Game</h1>
            {gameOver ? (
                <div>
                    <h2>Game Over!</h2>
                    <p>Score: {score}</p>
                    <button onClick={restartGame} className="button-style">Restart Game</button>
                    <button onClick={() => window.location.reload()} className="button-style">Main Menu</button>
                </div>
            ) : (
                <div>
                    <h2>Score: {score}</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${gridSize}, 20px)`, // Adjust the grid size
                        gap: "2px",                // Add some space between grid items
                    }}>
                        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                            const x = index % gridSize;
                            const y = Math.floor(index / gridSize);
                            const isSnake = snake.some(segment => segment.x === x && segment.y === y);
                            const isFood = food && food.x === x && food.y === y;

                            return (
                                <div
                                    key={index}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: isSnake ? 'green' : isFood ? 'red' : 'black',
                                        border: '1px solid #555',
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );

}