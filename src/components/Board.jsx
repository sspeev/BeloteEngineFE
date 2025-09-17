import BiddingPanel from "./BiddingPanel";
import Card from "./Card"; // Import your Card component

const Board = () => {
    // Example data for the player's hand
    const playerHand = [
        { suit: "Hearts", rank: "J", rotation: "-rotate-12" },
        { suit: "Spades", rank: "J", rotation: "-rotate-6" },
        { suit: "Clubs", rank: "J", rotation: "", zIndex: "z-10" },
        { suit: "Hearts", rank: "Q", rotation: "rotate-6" },
        { suit: "Diamonds", rank: "K", rotation: "rotate-12" },
    ];

    return (
        <div>
            <BiddingPanel />
            {/* Main board container using CSS Grid */}
            <section className="board w-full min-h-screen p-2 md:p-4 grid grid-cols-[1fr,auto,1fr] grid-rows-[1fr,auto,1fr] gap-2 md:gap-4">

                {/* NORTH PLAYER (Partner 'D') */}
                <div className="col-start-2 row-start-1 flex flex-col items-center justify-end">
                    <div className="flex justify-center space-x-[-30px] md:space-x-[-40px] lg:space-x-[-50px] mb-2">
                        {Array(5).fill(0).map((_, i) => <Card key={`north-${i}`} faceUp={false} />)}
                    </div>
                    <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-[#29de00] rounded-full flex items-center justify-center text-black text-3xl md:text-4xl lg:text-6xl font-semibold font-['Poppins'] transform translate-y-4 md:translate-y-6 lg:translate-y-8 z-10">D</div>
                </div>

                {/* WEST PLAYER (Opponent 'N') */}
                <div className="col-start-1 row-start-2 flex items-center justify-end">
                    <div className="flex flex-col items-center mr-2">
                        <div className="flex flex-col space-y-[-60px] md:space-y-[-75px] lg:space-y-[-90px]">
                            {Array(5).fill(0).map((_, i) => <Card key={`west-${i}`} faceUp={false} extraStyles="transform rotate-90" />)}
                        </div>
                        <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mt-4 bg-[#29de00] rounded-full flex items-center justify-center text-black text-3xl md:text-4xl lg:text-6xl font-semibold font-['Poppins'] transform translate-x-4 md:translate-x-6 lg:translate-x-8 z-10">N</div>
                    </div>
                </div>

                {/* CENTER TABLE */}
                <div className="col-start-2 row-start-2 bg-[#003d1a]/80 rounded-xl md:rounded-3xl flex items-center justify-center shadow-inner min-w-[200px] md:min-w-[300px] lg:min-w-[400px] min-h-[150px] md:min-h-[225px] lg:min-h-[300px]">
                    <p className="text-green-400/50 text-lg md:text-xl lg:text-2xl">Table Center</p>
                </div>

                {/* EAST PLAYER (Opponent 'K') */}
                <div className="col-start-3 row-start-2 flex items-center justify-start">
                    <div className="flex flex-col items-center ml-2">
                        <div className="flex flex-col space-y-[-60px] md:space-y-[-75px] lg:space-y-[-90px]">
                            {Array(5).fill(0).map((_, i) => <Card key={`east-${i}`} faceUp={false} extraStyles="transform -rotate-90" />)}
                        </div>
                        <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mt-4 bg-[#29de00] rounded-full flex items-center justify-center text-black text-3xl md:text-4xl lg:text-6xl font-semibold font-['Poppins'] transform -translate-x-4 md:-translate-x-6 lg:-translate-x-8 z-10">K</div>
                    </div>
                </div>

                {/* SOUTH PLAYER (You 'S') */}
                <div className="col-start-2 row-start-3 flex flex-col items-center justify-start">
                    <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mb-4 bg-[#29de00] rounded-full flex items-center justify-center text-black text-3xl md:text-4xl lg:text-6xl font-semibold font-['Poppins'] transform -translate-y-4 md:-translate-y-6 lg:-translate-y-8 z-10">S</div>
                    <div className="flex justify-center space-x-[-20px] md:space-x-[-30px]">
                        {playerHand.map((card, index) => (
                            <Card
                                key={`player-card-${index}`}
                                suit={card.suit}
                                rank={card.rank}
                                extraStyles={`transform ${card.rotation} ${card.zIndex || ''} hover:-translate-y-4 transition-transform cursor-pointer`}
                            />
                        ))}
                    </div>
                </div>

            </section>
        </div>
    );
}

export default Board;