import React from 'react';

function Card({ suit, value, /*onClick*/ }) {

  const cardSkinFont = "SF_Compact_Rounded";
  const cardImage = `${value}_${suit}.png`;

  const getSuitSymbol = (suit) => {
    const symbols = {
      'Hearts': '♥',
      'Diamonds': '♦',
      'Clubs': '♣',
      'Spades': '♠'
    };
    return symbols[suit] || suit;
  };

  const getSuitColor = (suit) => {
    return ['Hearts', 'Diamonds'].includes(suit) ? 'red-500' : 'black';
  };

  return (
    <>
      <div className="w-[220px] h-72 flex flex-row bg-white rounded-[10px] shadow-[0px_4px_8px_0px_rgba(157,179,206,1.00)]">
        <div className="upper-wrapper items-center w-[1em] h-full flex flex-col m-1">
          <div className={`upper-value text-${getSuitColor(suit)} text-4xl font-['${cardSkinFont}']`}>{value}</div>
          <div className={`upper-suit text-${getSuitColor(suit)} text-4xl font-['${cardSkinFont}']`}>{getSuitSymbol(suit)}</div>
        </div>
        <img className="w-sm h-auto mt-5 mb-5 ml-2 mr-2 outline-[2px] outline-black" src={cardImage} />
        <div className="lower-wrapper items-center w-[1em] h-full flex flex-col m-1 -rotate-180">
          <div className={`lower-value text-${getSuitColor(suit)} text-4xl font-['${cardSkinFont}']`}>{value}</div>
          <div className={`lower-suit text-${getSuitColor(suit)} text-4xl font-['${cardSkinFont}']`}>{getSuitSymbol(suit)}</div>
        </div>
      </div>
    </>
  );
}

export default Card;