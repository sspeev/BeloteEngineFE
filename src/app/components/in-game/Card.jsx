import BackSide from '../../../assets/BackSide.png';

function Card({ suit, value, faceUp, extraStyles = "" }) {

  const cardSkinFont = "SF_Compact_Rounded";
  const cardImage = faceUp ? `../../../assets/images/${value}${suit}.png` : BackSide;

  const symbols = {
    '1': '♣',
    '2': '♦',
    '3': '♥',
    '4': '♠'
  };
  const suitColor = suit == 2 || 3 ? 'red-500' : 'black';

  return (
    <>
      <div className={`w-lg-card h-lg-card flex flex-row justify-between bg-white rounded-sm shadow-default ${extraStyles}`}>
        <div className="upper-wrapper items-center h-full flex flex-col m-1">
          <div className={`upper-value text-${suitColor} text-sm font-['${cardSkinFont}']`}>{value}</div>
          <i className={`uppder-suit text-sm text-${suitColor}`}>{symbols[suit]}</i>
        </div>

        <img className="w-[80px] h-auto mt-4 mb-4 outline-[1px] outline-black rounded-sm" src={cardImage} />

        <div className="lower-wrapper items-center h-full flex flex-col m-1 -rotate-180">
          <div className={`lower-value text-${suitColor} text-sm font-['${cardSkinFont}']`}>{value}</div>
          <i className={`lower-suit text-${suitColor} text-sm font-['${cardSkinFont}']`}>{symbols[suit]}</i>
        </div>
      </div>
    </>
  );
}

export default Card;