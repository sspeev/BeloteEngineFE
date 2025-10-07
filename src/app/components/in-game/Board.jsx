import { useGame } from "../../contexts/GameContext.jsx";
import BiddingPanel from "../in-game/BiddingPanel.jsx";
import Card from "../in-game/Card.jsx";

const Board = () => {

    const {
        lobby,
        playerName
    } = useGame();
    const playerHand = lobby.game.currentPlayer.hand;
    const team1 = lobby.game.players[0].players;
    const team2 = lobby.game.players[1].players;
    let opponentTeam, myTeam;
    let me, teammate;
    if (team1[0].name !== playerName && team1[1].name !== playerName) {
        opponentTeam = team1;
        myTeam = team2;
    }
    else {
        opponentTeam = team2;
        myTeam = team1;
    }
    myTeam[0].name === playerName ? me = myTeam[0] : me = myTeam[1];
    myTeam[0].name === playerName ? teammate = myTeam[1] : teammate = myTeam[0];

    return (
        <div>
            {/* <BiddingPanel /> */}
            {/* Main board container using CSS Grid */}
            <section className="board flex flex-row">
                <article>
                    {/* WEST PLAYER (Opponent 'N') */}
                    <div className="col-start-1 row-start-2 flex items-center justify-end">
                        <div className="flex flex-col items-center mr-2">
                            <div className="flex flex-col space-y-[-60px] md:space-y-[-75px] lg:space-y-[-90px]">
                                <Card faceUp={false} extraStyles="transform rotate-90" />
                                <Card faceUp={false} extraStyles="transform rotate-90" />
                                <Card faceUp={false} extraStyles="transform rotate-90" />
                                <Card faceUp={false} extraStyles="transform rotate-90" />
                                <Card faceUp={false} extraStyles="transform rotate-90" />
                            </div>
                        </div>
                    </div>
                </article>
                <article>
                    <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mt-4 bg-[#29de00] rounded-full flex items-center justify-center text-black text-3xl md:text-4xl lg:text-6xl font-semibold font-['Poppins'] transform translate-x-4 md:translate-x-6 lg:translate-x-8 z-10">
                        {opponentTeam[0].name.charAt(0).toUpperCase()}
                    </div>
                </article>
                <article>
                    {/* NORTH PLAYER (Partner 'D') */}
                    <div className="col-start-2 row-start-1 flex flex-col items-center justify-end">
                        <div className="flex justify-center space-x-[-30px] md:space-x-[-40px] lg:space-x-[-50px] mb-2">
                            <Card faceUp={false} />
                            <Card faceUp={false} />
                            <Card faceUp={false} />
                            <Card faceUp={false} />
                            <Card faceUp={false} />
                        </div>
                        <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-[#29de00] rounded-full flex items-center justify-center text-black text-3xl md:text-4xl lg:text-6xl font-semibold font-['Poppins'] transform translate-y-4 md:translate-y-6 lg:translate-y-8 z-10">
                            {teammate.name.charAt(0).toUpperCase()}
                        </div>
                    </div>


                    {/* CENTER TABLE */}
                    <div className="col-start-2 row-start-2 bg-[#003d1a]/80 rounded-xl md:rounded-3xl flex items-center justify-center shadow-inner min-w-[200px] md:min-w-[300px] lg:min-w-[400px] min-h-[150px] md:min-h-[225px] lg:min-h-[300px]">
                        <p className="text-green-400/50 text-lg md:text-xl lg:text-2xl">Table Center</p>
                    </div>


                    {/* SOUTH PLAYER (You) */}
                    {lobby.connectedPlayers.map(player => (
                        player.name === playerName && (
                            <div className="col-start-2 row-start-3 flex flex-col items-center justify-start" >
                                <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mb-4 bg-[#29de00] rounded-full flex items-center justify-center text-black text-3xl md:text-4xl lg:text-6xl font-semibold font-['Poppins'] transform -translate-y-4 md:-translate-y-6 lg:-translate-y-8 z-10">
                                    {me.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex justify-center space-x-[-20px] md:space-x-[-30px]">
                                    {playerHand.map(card => (
                                        <Card
                                            faceUp={true}
                                            suit={card.suit}
                                            rank={card.rank}
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </article>
                <article>
                    <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mt-4 bg-[#29de00] rounded-full flex items-center justify-center text-black text-3xl md:text-4xl lg:text-6xl font-semibold font-['Poppins'] transform -translate-x-4 md:-translate-x-6 lg:-translate-x-8 z-10">
                        {opponentTeam[1].name.charAt(0).toUpperCase()}
                    </div>
                </article>
                <article className="flex align-center">
                    {/* EAST PLAYER */}
                    <div className="flex flex-col space-y-[-60px] md:space-y-[-75px] lg:space-y-[-90px]">
                        <Card faceUp={false} extraStyles="transform -rotate-90" />
                        <Card faceUp={false} extraStyles="transform -rotate-90" />
                        <Card faceUp={false} extraStyles="transform -rotate-90" />
                        <Card faceUp={false} extraStyles="transform -rotate-90" />
                        <Card faceUp={false} extraStyles="transform -rotate-90" />
                    </div>
                </article>
            </section>
        </div>
    );
}

export default Board;