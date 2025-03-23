import React, { useState, useEffect, useRef } from "react";

const WIDTH = 600;
const HEIGHT = 800;

export default function SpaceShooter() {
    const [playerX, setPlayerX] = useState(WIDTH / 2 - 25);
    const [bullets, setBullets] = useState([]);
    const [enemies, setEnemies] = useState([]);
    const [lifeEnemies, setLifeEnemies] = useState([]); // Gula fiender som ger liv
    const [keys, setKeys] = useState(new Set());
    const [canShoot, setCanShoot] = useState(true);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(20);
    const [enemySpeed, setEnemySpeed] = useState(2);
    const [playerSpeed, setPlayerSpeed] = useState(5);
    const [gameOver, setGameOver] = useState(false);
    const moveRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => setKeys((prev) => new Set(prev.add(event.key)));
        const handleKeyUp = (event) => setKeys((prev) => {
            const newKeys = new Set(prev);
            newKeys.delete(event.key);
            return newKeys;
        });

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    useEffect(() => {
        const movePlayer = () => {
            setPlayerX((prev) => {
                let newX = prev;
                if (keys.has("ArrowLeft")) newX = Math.max(prev - playerSpeed, 0);
                if (keys.has("ArrowRight")) newX = Math.min(prev + playerSpeed, WIDTH - 50);
                return newX;
            });
            moveRef.current = requestAnimationFrame(movePlayer);
        };
        moveRef.current = requestAnimationFrame(movePlayer);
        return () => cancelAnimationFrame(moveRef.current);
    }, [keys, playerSpeed]);

    // Justera skjuthastigheten baserat på poängen
    const getShootInterval = () => {
        const speedIncrease = Math.floor(score / 100);
        return Math.max(50 - speedIncrease * 10, 100); // Minsta intervallet är 100ms
    };

    useEffect(() => {
        const fireBullet = () => {
            if (keys.has(" ") && canShoot) {
                setBullets((prevBullets) => [...prevBullets, { x: playerX + 22.5, y: HEIGHT - 80 }]);
                setCanShoot(false);
                setTimeout(() => setCanShoot(true), 500);
            }
        };

        // Ändra intervallet för skjutningen baserat på poäng
        const interval = setInterval(fireBullet, getShootInterval());
        return () => clearInterval(interval);
    }, [keys, canShoot, playerX, score]);

    useEffect(() => {
        const interval = setInterval(() => {
            setBullets((prev) => prev.map((b) => ({ ...b, y: b.y - 15 })).filter((b) => b.y > 0));

            setEnemies((prev) =>
                prev.filter((enemy) => {
                    enemy.y += enemySpeed;
                    if (enemy.y >= HEIGHT) {
                        setLives((prev) => (prev > 0 ? prev - 1 : 0));
                        if (lives - 1 <= 0) setGameOver(true);
                        return false;
                    }
                    return true;
                })
            );

            setLifeEnemies((prev) =>
                prev.filter((enemy) => {
                    enemy.y += enemySpeed;
                    if (enemy.y >= HEIGHT) return false;
                    return true;
                })
            );

            checkCollisions();
        }, 50);

        return () => clearInterval(interval);
    }, [bullets, enemies, lifeEnemies, enemySpeed]);

    useEffect(() => {
        const interval = setInterval(() => {
            setEnemies((prev) => [...prev, { x: Math.random() * (WIDTH - 50), y: 0 }]);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // 🔥 Spawnar liv-fiender vid random intervaller
    useEffect(() => {
        const spawnLifeEnemy = () => {
            setLifeEnemies((prev) => [...prev, { x: Math.random() * (WIDTH - 50), y: 0 }]);
            const nextSpawn = Math.random() * 5000 + 5000; // 5-10 sekunder
            setTimeout(spawnLifeEnemy, nextSpawn);
        };
        setTimeout(spawnLifeEnemy, Math.random() * 5000 + 5000);
    }, []);

    const checkCollisions = () => {
        // För att kontrollera om en kula träffar en fiende
        setEnemies((prevEnemies) =>
            prevEnemies.filter((enemy) => {
                const hit = bullets.some((bullet) => bullet.x > enemy.x && bullet.x < enemy.x + 50 && bullet.y < enemy.y + 50);
                if (hit) {
                    setScore((prev) => {
                        const newScore = prev + .5;
                        if (newScore % 10 === 0) setEnemySpeed((speed) => speed + 0.5);
                        if (newScore % 50 === 0) setPlayerSpeed((speed) => speed + .5);
                        return newScore;
                    });
                }
                return !hit;
            })
        );

        // Se till att bara liv-fiender uppdaterar liv
        setLifeEnemies((prevLifeEnemies) =>
            prevLifeEnemies.filter((enemy) => {
                const hit = bullets.some((bullet) => bullet.x > enemy.x && bullet.x < enemy.x + 50 && bullet.y < enemy.y + 50);
                if (hit) {
                    setLives((prev) => prev + .5); // 🔥 Ger +1 liv
                }
                return !hit;
            })
        );
    };

    const restartGame = () => {
        setPlayerX(WIDTH / 2 - 25);
        setBullets([]);
        setEnemies([]);
        setLifeEnemies([]);
        setKeys(new Set());
        setScore(0);
        setLives(20);
        setEnemySpeed(2);
        setPlayerSpeed(5);
        setGameOver(false);
    };

    return (
        <div style={{
            width: WIDTH,
            height: HEIGHT,
            backgroundColor: "black",
            position: "relative",
            overflow: "hidden",
            margin: "auto"
        }}>
            {gameOver ? (
                <div style={{
                    position: "absolute",
                    width: "100%", height: "100%",
                    backgroundColor: "rgba(0,0,0,0.8)",
                    display: "flex", flexDirection: "column",
                    justifyContent: "center", alignItems: "center",
                    color: "white", fontSize: "24px"
                }}>
                    <p>Game Over</p>
                    <p>Final Score: {score}</p>
                    <button onClick={restartGame} style={{ fontSize: "20px" }}>Restart</button>
                </div>
            ) : (
                <>
                    <div style={{
                        position: "absolute",
                        color: "white",
                        fontSize: "20px",
                        top: 10, left: 10
                    }}>
                        Score: {score} | Lives: {lives} | Speed: {playerSpeed}
                    </div>

                    <div style={{
                        position: "absolute",
                        width: 50, height: 50,
                        backgroundColor: "blue",
                        bottom: 30, left: playerX
                    }} />

                    {bullets.map((bullet, index) => (
                        <div key={index} style={{
                            position: "absolute",
                            width: 5, height: 20,
                            backgroundColor: "yellow",
                            left: bullet.x, top: bullet.y
                        }} />
                    ))}

                    {enemies.map((enemy, index) => (
                        <div key={index} style={{
                            position: "absolute",
                            width: 50, height: 50,
                            backgroundColor: "red",
                            top: enemy.y, left: enemy.x
                        }} />
                    ))}

                    {lifeEnemies.map((enemy, index) => (
                        <div key={index} style={{
                            position: "absolute",
                            width: 50, height: 50,
                            backgroundColor: "yellow",
                            borderRadius: "50%",
                            top: enemy.y, left: enemy.x
                        }} />
                    ))}
                </>
            )}
        </div>
    );
}
