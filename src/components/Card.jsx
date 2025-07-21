import React from 'react';

function Card({ card, onClick, clickable = false }) {
  const getSuitSymbol = (suit) => {
    const symbols = {
      'hearts': '♥',
      'diamonds': '♦',
      'clubs': '♣',
      'spades': '♠'
    };
    return symbols[suit.toLowerCase()] || suit;
  };

  const getSuitColor = (suit) => {
    return ['hearts', 'diamonds'].includes(suit.toLowerCase()) ? 'red' : 'black';
  };

  return (
    <div 
      className={`card ${clickable ? 'clickable' : ''} ${getSuitColor(card.suit)}`}
      onClick={clickable ? onClick : undefined}
    >
      <div className="card-value">{card.value}</div>
      <div className="card-suit">{getSuitSymbol(card.suit)}</div>
    </div>
  );
}

export default Card;