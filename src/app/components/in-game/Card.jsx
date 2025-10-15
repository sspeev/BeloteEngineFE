import BackSide from '../../../assets/BackSide.png';

function Card({ suit, value, faceUp, extraStyles = "" }) {

  const cardSkinFont = "SF_Compact_Rounded";
  const cardImage = faceUp ? `../../../assets/images/${value}${suit}.png` : BackSide;

  const getSuitSymbol = (suit) => {
    const symbols = {
      'H': '♥',
      'D': '♦',
      'S': '♠',
      'C': '♣',
    };

    return symbols[suit] || suit;
  };

  const getSuitColor = (suit) => {
    return ['Hearts', 'Diamonds'].includes(suit) ? 'red-500' : 'black';
  };

  return (
    <>
      <div className={`w-card h-card flex flex-row justify-between bg-white rounded-sm shadow-default ${extraStyles}`}>
        <div className="upper-wrapper items-center h-full flex flex-col m-1">
          <div className={`upper-value text-${getSuitColor(suit)} text-sm font-['${cardSkinFont}']`}>{value}</div>
          <div className={`upper-suit text-${getSuitColor(suit)} text-sm`}>{getSuitSymbol(suit)}</div>
        </div>

        <img className="w-[80px] h-auto mt-4 mb-4 outline-[1px] outline-black rounded-sm" src={cardImage} />

        <div className="lower-wrapper items-center h-full flex flex-col m-1 -rotate-180">
          <div className={`lower-value text-${getSuitColor(suit)} text-sm font-['${cardSkinFont}']`}>{value}</div>
          <div className={`lower-suit text-${getSuitColor(suit)} text-sm font-['${cardSkinFont}']`}>{getSuitSymbol(suit)}</div>
        </div>
      </div>
    </>
  );
}

export default Card;