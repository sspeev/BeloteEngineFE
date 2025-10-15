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
                <article className="westHand h-screen flex items-center">
                    {/* WEST PLAYER (Opponent 'N') */}
                    <div className="flex flex-col space-y-[-60px] md:space-y-[-75px] lg:space-y-[-90px]">
                        <Card faceUp={false} extraStyles="transform rotate-90" />
                        <Card faceUp={false} extraStyles="transform rotate-90" />
                        <Card faceUp={false} extraStyles="transform rotate-90" />
                        <Card faceUp={false} extraStyles="transform rotate-90" />
                        <Card faceUp={false} extraStyles="transform rotate-90" />
                    </div>
                </article>
                <article className="westInitial flex items-center">
                    <InitialSign playerName={opponentTeam[1].name} />
                </article>
                <article className="w-3xs lg:w-3xl flex flex-col items-center justify-between py-4 space-y-4">
                    {/* NORTH PLAYER */}
                    <div className="flex flex-col lg:flex-row items-center justify-center">
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
                    <div className=" bg-secondary-dark rounded-xl md:rounded-3xl flex items-center justify-center shadow-inner w-64 lg:w-full h-full">
                        <p className="text-green-400/50 text-lg md:text-xl lg:text-2xl">0 - 0</p>
                    </div>


                    {/* SOUTH PLAYER (You) */}
                    {lobby.connectedPlayers.map(player => (
                        player.name === playerName && (
                            <div className="flex flex-col lg:flex-row items-center justify-center" >
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
                <article className="northInitial flex items-center text-start">
                    <InitialSign playerName={teammate.name} />
                </article>
                <article className="flex h-screen items-center">
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