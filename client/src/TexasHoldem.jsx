import React, { useState } from "react";
import { Deck } from "./Deck";
import Card from "./Card";

const TexasHoldem = () => {
    const [deck, setDeck] = useState(null);
    const [players, setPlayers] = useState([{ hand: [] }, { hand: [] }]);
    const [communityCards, setCommunityCards] = useState([]);
    const [stage, setStage] = useState("preflop");

    const startGame = () => {
        const newDeck = new Deck();
        newDeck.shuffle();
        setDeck(newDeck);

        const playerHands = [
            { hand: newDeck.draw(2) },
            { hand: newDeck.draw(2) }
        ];
        setPlayers(playerHands);
        setCommunityCards([]);
        setStage("flop");
    };

    const dealCommunityCards = () => {
        if (!deck) return;
        const newDeck = { ...deck, cards: [...deck.cards] };
        if (stage === "flop") {
            setCommunityCards(newDeck.draw(3)); // Flop
            setStage("turn");
        } else if (stage === "turn") {
            setCommunityCards([...communityCards, ...newDeck.draw(1)]); // Turn
            setStage("river");
        } else if (stage === "river") {
            setCommunityCards([...communityCards, ...newDeck.draw(1)]); // River
            setStage("showdown");
        }
        setDeck(newDeck);
    };

    const determineWinner = () => {
        if (stage !== "showdown") return "Spelet är inte klart än!";
        // Enkel jämförelse: Den med högsta kortet vinner
        const allHands = [...players[0].hand, ...players[1].hand, ...communityCards];
        const bestHand1 = Math.max(...players[0].hand.map(card => deck.ranks.indexOf(card.rank)));
        const bestHand2 = Math.max(...players[1].hand.map(card => deck.ranks.indexOf(card.rank)));
        if (bestHand1 > bestHand2) return "Spelare 1 vinner!";
        if (bestHand2 > bestHand1) return "Spelare 2 vinner!";
        return "Oavgjort!";
    };

    return (
        <div>
            <h1>Texas Hold'em</h1>
            <button onClick={startGame}>Starta Spelet</button>
            {stage !== "showdown" && <button onClick={dealCommunityCards}>Nästa kort</button>}
            {stage === "showdown" && <h2>{determineWinner()}</h2>}

            <h2>Spelare 1</h2>
            <div className="hand">
                {players[0].hand.map((card, index) => (
                    <Card key={index} rank={card.rank} suit={card.suit} />
                ))}
            </div>

            <h2>Spelare 2</h2>
            <div className="hand">
                {players[1].hand.map((card, index) => (
                    <Card key={index} rank={card.rank} suit={card.suit} />
                ))}
            </div>

            <h2>Community Cards</h2>
            <div className="hand">
                {communityCards.map((card, index) => (
                    <Card key={index} rank={card.rank} suit={card.suit} />
                ))}
            </div>
        </div>
    );
};

export default TexasHoldem;
