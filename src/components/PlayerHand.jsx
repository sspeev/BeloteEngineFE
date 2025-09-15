import React from 'react';
import { useGame } from '../context/gameContext';
import Card from './Card';

function PlayerHand() {
  const { currentHand, playCard, gamePhase } = useGame();

  const handleCardClick = (cardId) => {
    if (gamePhase === 'playing') {
      playCard(cardId);
    }
  };

  return (
    <div className="player-hand">
      <h3>Your Hand</h3>
      <div className="cards-container">
        {currentHand?.map((card) => (
          <Card
            key={card.id}
            card={card}
            onClick={() => handleCardClick(card.id)}
            clickable={gamePhase === 'playing'}
          />
        ))}
      </div>
    </div>
  );
}

export default PlayerHand;