import React, { useState, useEffect } from "react";
import Card from "./Card";
import { Deck } from "./Deck";

const AllCards = () => {
    const [deck, setDeck] = useState(new Deck());
    const [drawnCards, setDrawnCards] = useState([]);
    const [allCards, setAllCards] = useState([]);

    const handleDraw = () => {
        const newCard = deck.draw()[0]; // ta första kortet från arrayen
        if (newCard) {
            setDrawnCards([...drawnCards, newCard]);
        }
    };


    const resetDeck = () => {
        const newDeck = new Deck();
        newDeck.shuffle();
        setDeck(newDeck);
        setDrawnCards([]);
        setAllCards(newDeck.cards);
    };

    // Sortera kort efter värde
    const getCardValue = (rank) => {
        const rankValues = {
            "A": 1,
            "2": 2,
            "3": 3,
            "4": 4,
            "5": 5,
            "6": 6,
            "7": 7,
            "8": 8,
            "9": 9,
            "10": 10,
            "J": 11,
            "Q": 12,
            "K": 13,
        };
        return rankValues[rank];
    };

    useEffect(() => {
        const newDeck = new Deck();
        newDeck.shuffle();
        setDeck(newDeck);
        setAllCards(newDeck.cards);
    }, []);

    const sortedAllCards = [...allCards].sort((a, b) => getCardValue(a.rank) - getCardValue(b.rank));

    return (
        <div style={{width: "640px", margin: "0 auto", textAlign: "center"}}>
            <h2>Alla Kort i Leken</h2>
            <button onClick={handleDraw}>Dra Kort</button>
            <button onClick={resetDeck} style={{marginLeft: "10px"}}>Återställ Lek</button>
            <div>
                <button onClick={() => window.location.reload()} className="button-style">Main Menu</button>    
            </div>
            <h3 style={{marginTop: "20px"}}>Dragna Kort</h3>
            <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginTop: "10px"}}>
                {drawnCards.map((card, index) => (
                    <Card
                        key={`drawn-${index}`}
                        rank={card.rank}
                        suit={card.suit}
                        onClick={() => alert(`${card.rank} of ${card.suit}`)}
                    />
                ))}
            </div>

            <h3 style={{marginTop: "40px"}}>Alla Kort</h3>
            <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginTop: "10px"}}>
                {sortedAllCards.map((card, index) => (
                    <Card
                        key={`all-${index}`}
                        rank={card.rank}
                        suit={card.suit}
                    />
                ))}
            </div>
        </div>
    );
};

export default AllCards;