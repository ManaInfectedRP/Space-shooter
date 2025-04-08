import React from "react";
import "./Card.css";

const suitSymbols = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
};

const Card = ({ rank, suit, onClick, isSelected }) => {
    const cardClass = `card ${suit} ${isSelected ? "selected" : ""}`;
    const colorClass = `suit-${suit}`;

    return (
        <div
            className={cardClass}
            onClick={onClick}
            style={isSelected ? { border: "3px solid blue", borderRadius: "8px" } : {}}
        >
            <div className={`card-header ${colorClass}`}>{rank} {suitSymbols[suit]}</div>
            <div className={`card-body ${colorClass}`}>
                {suitSymbols[suit]}
            </div>
            <div className={`card-footer ${colorClass}`}>{rank} {suitSymbols[suit]}</div>
        </div>
    );
};

export default Card;
