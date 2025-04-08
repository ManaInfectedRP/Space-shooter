import React, { useState } from "react";
import { Deck } from "./Deck";
import Card from "./Card";

const BlackjackGame = () => {
    const [deck, setDeck] = useState(new Deck());
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [winner, setWinner] = useState("");

    const startGame = () => {
        const newDeck = new Deck();
        newDeck.shuffle();
        setDeck(newDeck);
        setPlayerHand([...newDeck.draw(2)]);
        setDealerHand([...newDeck.draw(2)]);

        setGameOver(false);
        setGameStarted(true);
        setWinner("");
    };

    const restartGame = () => {
        setGameStarted(false);
        setGameOver(false);
        setPlayerHand([]);
        setDealerHand([]);
        setWinner("");
    };

    const hit = () => {
        if (gameOver) return;
        setPlayerHand([...playerHand, ...deck.draw(1)]);
    };

    const calculateScore = (hand) => {
        let score = 0;
        let aceCount = 0;
        hand.forEach(card => {
            if (card.rank === "A") {
                aceCount++;
                score += 11;
            } else if (["J", "Q", "K"].includes(card.rank)) {
                score += 10;
            } else {
                score += parseInt(card.rank);
            }
        });
        while (score > 21 && aceCount > 0) {
            score -= 10;
            aceCount--;
        }
        return score;
    };

    const stand = () => {
        let dealerScore = calculateScore(dealerHand);
        let newDealerHand = [...dealerHand];
        while (dealerScore < 17) {
            newDealerHand = [...newDealerHand, ...deck.draw(1)];
            dealerScore = calculateScore(newDealerHand);
        }
        setDealerHand(newDealerHand);

        const playerScore = calculateScore(playerHand);
        if (playerScore > 21 || (dealerScore <= 21 && dealerScore > playerScore)) {
            setWinner("Dealer vinner!");
        } else if (dealerScore > 21 || playerScore > dealerScore) {
            setWinner("Spelaren vinner!");
        } else {
            setWinner("Oavgjort!");
        }
        setGameOver(true);
    };

    return (
        <div>
            <h1>Blackjack</h1>
            <div className="hand-container">
                <h2>Spelare</h2>
                <div className="card-container">
                    {playerHand.map((card, index) => (
                        <Card key={index} rank={card.rank} suit={card.suit} />
                    ))}
                </div>
                <p>Poäng: {calculateScore(playerHand)}</p>
                {!gameStarted || !gameOver && <button onClick={hit}>Hit</button>}
                {!gameStarted || !gameOver && <button onClick={stand}>Stand</button>}
            </div>
            <div className="hand-container">
                <h2>Dealer</h2>
                <div className="card-container">
                    {dealerHand.map((card, index) => (
                        <Card key={index} rank={card.rank} suit={card.suit} />
                    ))}
                </div>
                {gameOver && <p>Poäng: {calculateScore(dealerHand)}</p>}
            </div>
            {gameOver && <div className="game-over"><h2>{winner}</h2></div>}
            {!gameStarted && <button onClick={startGame}>Starta Spelet</button>}
            {gameOver && <button onClick={restartGame}>Restart</button>}
            <div>
                <button onClick={() => window.location.reload()} className="button-style">Main Menu</button>
            </div>
        </div>
    );
};

export default BlackjackGame;