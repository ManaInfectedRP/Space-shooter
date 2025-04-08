import React, { useEffect, useState } from "react";
import Card from "./Card";
import { Deck } from "./Deck";

const PokerGame = () => {
    const [deck, setDeck] = useState(new Deck());
    const [playerHand, setPlayerHand] = useState([]);
    const [aiHand, setAiHand] = useState([]);
    const [playerBet, setPlayerBet] = useState(10);
    const [aiBet, setAiBet] = useState(10);
    const [pot, setPot] = useState(20);
    const [winner, setWinner] = useState(null);
    const [exchangesLeft, setExchangesLeft] = useState(3);
    const [selectedCards, setSelectedCards] = useState([]);
    const [playerChips, setPlayerChips] = useState(100);

    useEffect(() => {
        startNewRound();
    }, []);

    const startNewRound = () => {
        const newDeck = new Deck();
        const playerCards = [newDeck.draw()[0], newDeck.draw()[0], newDeck.draw()[0], newDeck.draw()[0], newDeck.draw()[0]];
        const aiCards = [newDeck.draw()[0], newDeck.draw()[0], newDeck.draw()[0], newDeck.draw()[0], newDeck.draw()[0]];
        setDeck(newDeck);
        setPlayerHand(playerCards);
        setAiHand(aiCards);
        setPot(playerBet + aiBet);
        setWinner(null);
        setExchangesLeft(3);
        setSelectedCards([]);
    };

    const toggleSelectCard = (index) => {
        if (selectedCards.includes(index)) {
            setSelectedCards(selectedCards.filter(i => i !== index));
        } else {
            setSelectedCards([...selectedCards, index]);
        }
    };

    const exchangeSelectedCards = () => {
        if (exchangesLeft === 0) return;
        const newHand = playerHand.map((card, index) =>
            selectedCards.includes(index) ? deck.draw()[0] : card
        );
        setPlayerHand(newHand);
        setSelectedCards([]);
        setExchangesLeft(exchangesLeft - 1);
    };

    const evaluateHand = (hand) => {
        const rankOrder = "23456789TJQKA";
        const ranks = hand.map(card => card.rank);
        const suits = hand.map(card => card.suit);

        const rankCounts = {};
        for (let rank of ranks) {
            const r = rank === "10" ? "T" : rank;
            rankCounts[r] = (rankCounts[r] || 0) + 1;
        }

        const values = Object.values(rankCounts).sort((a, b) => b - a);
        const isFlush = suits.every(s => s === suits[0]);
        const sortedRanks = [...new Set(ranks.map(r => rankOrder.indexOf(r === "10" ? "T" : r)).sort((a, b) => a - b))];
        const isStraight = sortedRanks.length === 5 && sortedRanks[4] - sortedRanks[0] === 4;

        if (isStraight && isFlush && sortedRanks[0] === 8) return { rank: 10, name: "Royal Flush" };
        if (isStraight && isFlush) return { rank: 9, name: "Straight Flush" };
        if (values[0] === 4) return { rank: 8, name: "Four of a Kind" };
        if (values[0] === 3 && values[1] === 2) return { rank: 7, name: "Full House" };
        if (isFlush) return { rank: 6, name: "Flush" };
        if (isStraight) return { rank: 5, name: "Straight" };
        if (values[0] === 3) return { rank: 4, name: "Three of a Kind" };
        if (values[0] === 2 && values[1] === 2) return { rank: 3, name: "Two Pair" };
        if (values[0] === 2) return { rank: 2, name: "One Pair" };

        const highCard = Math.max(...sortedRanks);
        return { rank: 1, name: "High Card", highCard };
    };

    const determineWinner = () => {
        const playerResult = evaluateHand(playerHand);
        const aiResult = evaluateHand(aiHand);

        if (playerResult.rank > aiResult.rank || (playerResult.rank === aiResult.rank && (playerResult.highCard || 0) > (aiResult.highCard || 0))) {
            setWinner(`Spelaren vinner med ${playerResult.name}`);
            setPlayerChips(prev => prev + pot);
        } else if (playerResult.rank < aiResult.rank || (playerResult.rank === aiResult.rank && (playerResult.highCard || 0) < (aiResult.highCard || 0))) {
            setWinner(`AI vinner med ${aiResult.name}`);
            setPlayerChips(prev => prev - playerBet);
        } else {
            setWinner("Oavgjort!");
        }
    };

    const increaseBet = () => {
        if (playerChips >= playerBet + 10) {
            const newPlayerBet = playerBet + 10;
            setPlayerBet(newPlayerBet);
            setPlayerChips(playerChips-10)
            setPot(newPlayerBet + aiBet); // potten blir korrekt summerad
        }
    };


    const increaseAiBet = () => {
        const newAiBet = aiBet + 10;
        setAiBet(newAiBet);
        setPot(playerBet + newAiBet); // potten uppdateras korrekt
    };


    return (
        <div style={{width: "640px", margin: "0 auto"}}>
            <h2>Spelarens Hand</h2>
            <div className="card-container">
                {playerHand.map((card, index) => (
                    <Card
                        key={index}
                        rank={card.rank}
                        suit={card.suit}
                        onClick={() => toggleSelectCard(index)}
                        isSelected={selectedCards.includes(index)}
                    />
                ))}
            </div>
            <p>Kortbyten kvar: {exchangesLeft}</p>
            <button onClick={exchangeSelectedCards} disabled={exchangesLeft === 0}>Byt valda kort</button>
            <button onClick={determineWinner}>Visa Vinnare</button>
            <button onClick={increaseBet}>Öka insats (+10)</button>
            <button onClick={increaseAiBet}>Öka AI:s insats (+10)</button>

            {winner && (
                <div className="game-over">
                    <p>{winner}</p>
                    <h3>AI:s hand:</h3>
                    <div className="card-container">
                        {aiHand.map((card, index) => (
                            <Card key={index} rank={card.rank} suit={card.suit}/>
                        ))}
                    </div>
                    <button onClick={startNewRound}>Ny runda</button>
                </div>
            )}

            <p>Total pott: {pot} (Spelare: {playerBet} + AI: {aiBet})</p>
            <p>Spelarens marker: {playerChips}</p>
            <button onClick={() => window.location.reload()} className="button-style">Main Menu</button>

        </div>
    );
};

export default PokerGame;
