import { useGame } from "../../contexts/GameContext.jsx";
import BiddingPanel from "../in-game/BiddingPanel.jsx";
import Card from "../in-game/Card.jsx";
import InitialSign from "./InitialSign.jsx";

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
            <section className="board flex flex-row justify-center">
                <article className="westHand h-min flex">
                    {/* WEST PLAYER (Opponent 'N') */}
                    <div className="flex flex-col space-y-[-60px] md:space-y-[-75px] lg:space-y-[-90px]">
                        <Card faceUp={false} extraStyles="transform rotate-90" />
                        <Card faceUp={false} extraStyles="transform rotate-90" />
                        <Card faceUp={false} extraStyles="transform rotate-90" />
                        <Card faceUp={false} extraStyles="transform rotate-90" />
                        <Card faceUp={false} extraStyles="transform rotate-90" />
                    </div>
                </article>
                <article className="westInitial">
                    <InitialSign playerName={opponentTeam[1].name} />
                </article>
                <article className="w-full">
                    {/* NORTH PLAYER (Partner 'D') */}
                    <div className="flex flex-col items-center justify-end">
                        <div className="northHand flex justify-center space-x-[-30px] md:space-x-[-40px] lg:space-x-[-50px] mb-2">
                            <Card faceUp={false} />
                            <Card faceUp={false} />
                            <Card faceUp={false} />
                            <Card faceUp={false} />
                            <Card faceUp={false} />
                        </div>
                        <InitialSign playerName={teammate.name} />
                    </div>


                    {/* CENTER TABLE */}
                    <div className=" bg-secondary-dark rounded-xl md:rounded-3xl flex items-center justify-center shadow-inner min-w-[200px] md:min-w-[300px] lg:min-w-[400px] h-60">
                        <p className="text-green-400/50 text-lg md:text-xl lg:text-2xl">Table Center</p>
                    </div>


                    {/* SOUTH PLAYER (You) */}
                    {lobby.connectedPlayers.map(player => (
                        player.name === playerName && (
                            <div className="flex flex-col items-center justify-start" >
                                <InitialSign playerName={me.name} />
                                <div className="flex justify-center space-x-[-20px] md:space-x-[-30px]">
                                    {playerHand.map((card) => (
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
                <article className="northInitial">
                    <InitialSign playerName={teammate.name} />
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