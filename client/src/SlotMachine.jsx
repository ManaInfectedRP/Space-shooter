import React, { useState } from "react";

export default function SlotMachine() {
    const [symbols, setSymbols] = useState(["🍒", "🍋", "🍉"]);
    const [spinning, setSpinning] = useState(false);
    const [results, setResults] = useState(["", "", ""]);
    const [win, setWin] = useState(false);

    const handleSpin = () => {
        if (spinning) return;
        setSpinning(true);

        // Simulate a slot spin
        const newResults = symbols.map(
            () => symbols[Math.floor(Math.random() * symbols.length)]
        );
        setResults(newResults);

        // Check if all results are the same
        if (newResults.every((symbol) => symbol === newResults[0])) {
            setWin(true);
        } else {
            setWin(false);
        }

        setSpinning(false);
    };

    return (
        <div
            style={{
                width: 400,
                height: 200,
                backgroundColor: "black",
                color: "white",
                textAlign: "center",
                margin: "auto",
                paddingTop: 20,
                borderRadius: 10,
            }}
        >
            <h2>Slot Machine</h2>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 20,
                }}
            >
                {results.map((result, index) => (
                    <div
                        key={index}
                        style={{
                            fontSize: "40px",
                            margin: "0 10px",
                            padding: "20px",
                            border: "2px solid white",
                            borderRadius: "5px",
                        }}
                    >
                        {result}
                    </div>
                ))}
            </div>
            {win && <p style={{fontSize: "20px", color: "green"}}>You Win!</p>}
            {!win && results.every((result) => result) && (
                <p style={{fontSize: "20px", color: "red"}}>Try Again!</p>
            )}
            <button
                onClick={handleSpin}
                disabled={spinning}
                style={{
                    padding: "10px 20px",
                    fontSize: "18px",
                    cursor: spinning ? "not-allowed" : "pointer",
                }}
            >
                {spinning ? "Spinning..." : "Spin"}
            </button>
            <div>
            <button onClick={() => window.location.reload()} className="button-style">Main Menu</button>
            </div>
        </div>
    );
}
