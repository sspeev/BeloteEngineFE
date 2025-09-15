import { useGame } from "../context/GameContext";
import PlayerList from "./PlayerList";

const Waiting = ({ setView }) => {
    const {
        leaveLobby,
        startGame,
        gamephase,
        lobbyId,
        lobbyName,
        playerName,
        isHost
    } = useGame();

    const handleLeaveLobby = async () => {
        if (playerName.trim()) {
            const result = await leaveLobby(playerName.trim(), lobbyId);
            if (result) {
                setView("main");
            }
        }
    };

    const handleStartGame = () => {
        startGame(lobbyName);
    }

    return (
        <main className="container mx-auto py-8 px-4 flex flex-col items-center">
            <header className="w-full max-w-xs lg:max-w-3xl flex flex-col lg:flex-row justify-between items-center bg-gradient-to-b from-secondary-light to-secondary-dark rounded-xl p-8 mb-10">
                <div className="flex flex-col lg:flex-row gap-3 items-center mb-6 lg:mb-0">
                    <div className="flex flex-col items-center justify-center">
                        <h2 className="text-4xl font-semibold font-default text-dirty-white">{lobbyName}</h2>
                        <p className="text-white text-xl font-semibold font-default">{gamephase}</p>
                    </div>
                    <div className="button-wrapper">
                        <button onClick={() => { handleLeaveLobby(); setView("main"); }} className="w-25">
                            <p>Leave</p>
                        </button>
                        {isHost && (
                            <button className="w-25" onClick={handleStartGame}>
                                <p className="text-contrast">Start</p>
                            </button>
                        )}
                    </div>
                </div>
                <div className="divider hidden lg:block h-30 w-px bg-white/30 mx-3"></div>
                <div className="text-center text-dirty-white text-xs lg:text-4xl font-semibold font-['Poppins'] max-w-lg">
                    BELOTE ENGINE STAGE DEVELOPMENT
                </div>
            </header>
            <PlayerList />
            <section>
                If the host player leaves, the other players will be returned to the main menu.
            </section>
        </main>
    );
}

export default Waiting;