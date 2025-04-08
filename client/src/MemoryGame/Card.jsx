import React from "react";

export default function Card({ card, onClick, flipped, disabled }) {
    return (
        <div
            className={`card ${flipped ? "flipped" : ""}`}
            onClick={() => !disabled && onClick(card)}
            style={{
                width: "80px",
                height: "80px",
                border: "1px solid #ccc",
                fontSize: "2rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: flipped || card.matched ? "#fff" : "#ddd",
                cursor: disabled ? "default" : "pointer",
                userSelect: "none",
            }}
        >
            {flipped || card.matched ? card.symbol : "❓"}
        </div>
    );
}
