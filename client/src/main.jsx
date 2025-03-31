import { StrictMode, useState } from 'react'
import { Routes, Route, BrowserRouter} from "react-router";
import { createRoot } from 'react-dom/client'
import './index.css'
import './Main.css'
import SpaceShooter from './SpaceShooter.jsx'
import SlotMachine from "./SlotMachine.jsx";
import ObstacleAvoidance from "./ObstacleAvoidance.jsx";
import Snake from "./Snake.jsx";
import CandyCrush from "./CandyCrush.jsx";
import PingPong from "./PingPong.jsx";
import Minesweeper from "./Minesweeper.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route index path="" element={<MainMenu />} />
            </Routes>
        </BrowserRouter>

    </StrictMode>
)

export default function MainMenu() {
    const [currentGame, setCurrentGame] = useState(null);

    const games = [
        { name: "Space Shooter", component: <SpaceShooter /> },
        { name: "Slot Machine", component: <SlotMachine /> },
        { name: "Snake", component: <Snake /> },
        { name: "Obstacle Avoidance", component: <ObstacleAvoidance /> },
        { name: "Candy Crush", component: <CandyCrush /> },
        { name: "Ping Pong", component: <PingPong /> },
        { name: "Minesweeper", component: <Minesweeper /> },
        // Lägg till fler spel här om du vill
    ];

    return (
        <div style={{
            textAlign: "center",
            padding: "20px",
            backgroundColor: "#121212",
            color: "white",
            minHeight: "800px",
            minWidth: "600px",
            position: "relative",
        }}>
            {currentGame ? (
                <div>
                    {currentGame}
                </div>
            ) : (
                <div>
                    <h1 style={{ fontSize: "36px", marginBottom: "20px" }}>Game Selection</h1>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", // Dynamiskt grid med max 3 kolumner
                        gap: "20px",
                        justifyContent: "center"
                    }}>
                        {games.map((game, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: "20px",
                                    backgroundColor: "#1e1e1e",
                                    borderRadius: "10px",
                                    boxShadow: "0 4px 8px rgba(255, 255, 255, 0.2)",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    transition: "transform 0.2s"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                            >
                                <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>{game.name}</h2>
                                <button
                                    onClick={() => setCurrentGame(game.component)}
                                    style={{
                                        fontSize: "18px",
                                        padding: "10px 15px",
                                        borderRadius: "8px",
                                        border: "none",
                                        backgroundColor: "#4caf50",
                                        color: "white",
                                        cursor: "pointer" }}
                                >
                                    Start
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
