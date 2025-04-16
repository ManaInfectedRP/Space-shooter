import React, { useState, useEffect } from "react";

export default function ClickerGame() {
    const WIDTH = 600;
    const HEIGHT = 800;

    const [score, setScore] = useState(0);
    const [clickPower, setClickPower] = useState(1);
    const [scoreMultiplier, setScoreMultiplier] = useState(1);
    const [autoClickers, setAutoClickers] = useState(0);
    const [autoClickerCost, setAutoClickerCost] = useState(100);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [event, setEvent] = useState(null);
    const [eventDuration, setEventDuration] = useState(0);
    const [prestigeLevel, setPrestigeLevel] = useState(0);
    const [prestigeCost, setPrestigeCost] = useState(10000);

    // Dark Mode Toggle
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Event System Logic
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() < 0.1 && !event) { // Only trigger if no event is active
                setEvent("Double Score");
                setEventDuration(30); // Event lasts for 30 seconds
            }
        }, 5000); // Check every 5 seconds
        return () => clearInterval(interval);
    }, [event]); // Watch for changes to the event state

    // Event Duration Logic
    useEffect(() => {
        if (eventDuration > 0) {
            const timer = setTimeout(() => {
                setEventDuration(eventDuration - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setEvent(null); // Reset event when duration is over
        }
    }, [eventDuration]);

    // Prestige System Logic
    const handlePrestige = () => {
        if (score >= prestigeCost) {
            setPrestigeLevel(prestigeLevel + 1);
            setScore(0); // Reset score
            setAutoClickers(autoClickers + 1); // Reward with an extra auto-clicker
            setScoreMultiplier(1); // Reset score multiplier
            setPrestigeCost(prestigeCost * 2); // Increase prestige cost
        } else {
            alert("Not enough score to prestige!");
        }
    };

    // Handle Click Logic
    const handleClick = () => {
        const multiplier = event === "Double Score" ? 2 : 1;
        setScore(score + clickPower * scoreMultiplier * multiplier);
    };

    // Auto-Clicker Logic
    useEffect(() => {
        const interval = setInterval(() => {
            if (autoClickers > 0) {
                setScore(prevScore => prevScore + autoClickers * clickPower * scoreMultiplier); // Auto-clicker adds score
            }
        }, 1000); // Every 1000ms (1 second)

        return () => clearInterval(interval);
    }, [autoClickers, clickPower, scoreMultiplier]);

    // Buy Auto-Clicker with Cookie Drain
    const handleAutoClickerPurchase = () => {
        if (score >= autoClickerCost) {
            setScore(prevScore => prevScore - autoClickerCost); // Deduct cookies for purchase
            setAutoClickers(prevAutoClickers => prevAutoClickers + 1); // Increase auto-clicker count
            setAutoClickerCost(prevCost => prevCost * 1.5); // Increase auto-clicker cost for the next purchase
        } else {
            alert("Not enough cookies to buy Auto-Clicker!");
        }
    };

    // Progress Bar Component
    const ProgressBar = ({ progress, max }) => {
        const percentage = (progress / max) * 100;
        return (
            <div style={{
                width: "100%",
                height: "20px",
                backgroundColor: isDarkMode ? "#444" : "#e0e0e0",
                borderRadius: "10px",
                overflow: "hidden",
                marginBottom: "10px"
            }}>
                <div
                    style={{
                        width: `${percentage}%`,
                        height: "100%",
                        backgroundColor: "#4CAF50",
                        borderRadius: "10px",
                    }}
                ></div>
            </div>
        );
    };

    // Styles based on dark mode
    const gameStyles = {
        backgroundColor: isDarkMode ? "#333" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
        width: WIDTH,
        height: HEIGHT,
        margin: "auto",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Arial', sans-serif",
        borderRadius: "10px",
        boxShadow: isDarkMode ? "0 0 20px rgba(0, 0, 0, 0.5)" : "0 0 20px rgba(0, 0, 0, 0.2)",
        padding: "20px",
    };

    const buttonStyles = {
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
        transition: "0.3s ease-in-out",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    };

    const buttonHoverStyles = {
        backgroundColor: "#45a049",
        transform: "scale(1.05)",
    };

    const toggleButtonStyles = {
        backgroundColor: isDarkMode ? "#444" : "#ddd",
        color: isDarkMode ? "#fff" : "#000",
        border: "none",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
        transition: "0.3s ease-in-out",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    };

    const buttonContainerStyles = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
    };

    return (
        <div style={gameStyles}>
            <div style={buttonContainerStyles}>
                <button
                    onClick={toggleDarkMode}
                    style={toggleButtonStyles}
                >
                    Toggle Dark Mode
                </button>
                <h3>Score: {score} | Click Power: {clickPower} | Auto-Clickers: {autoClickers}</h3>
                <ProgressBar progress={score} max={10000}/>
                <ProgressBar progress={autoClickers} max={10}/>

                <button
                    onClick={handleClick}
                    style={{...buttonStyles, marginBottom: "10px"}}
                    onMouseOver={(e) => (e.target.style = buttonHoverStyles)}
                    onMouseOut={(e) => (e.target.style = buttonStyles)}
                >
                    Click!
                </button>

                <button
                    onClick={handleAutoClickerPurchase}
                    style={{...buttonStyles, marginBottom: "10px"}}
                    onMouseOver={(e) => (e.target.style = buttonHoverStyles)}
                    onMouseOut={(e) => (e.target.style = buttonStyles)}
                >
                    Buy Auto-Clicker (Cost: {autoClickerCost} cookies)
                </button>

                <button
                    onClick={handlePrestige}
                    style={{...buttonStyles, marginBottom: "10px"}}
                    onMouseOver={(e) => (e.target.style = buttonHoverStyles)}
                    onMouseOut={(e) => (e.target.style = buttonStyles)}
                >
                    Prestige (Cost: {prestigeCost})
                </button>

                <h3>Prestige Level: {prestigeLevel}</h3>
                <h3>{event ? `${event} (Time left: ${eventDuration}s)` : "No event active"}</h3>
            </div>
            <div>
                <button onClick={() => window.location.reload()} className="button-style">Main Menu</button>
            </div>
        </div>
    );
}
