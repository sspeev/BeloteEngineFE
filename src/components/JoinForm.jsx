import { useEffect } from "react";
import { useGame } from "../context/gameContext";

const JoinForm = ({
    playerName,
    setPlayerName,
    selectedLobbyId,
    setSelectedLobbyId,
    setView
}) => {

    const {
        getAvailableLobbies,
        availableLobbies,
        joinLobby
    } = useGame();

    useEffect(() => {
        refreshLobbies();
    }, []);

    const handleJoinLobby = async (e) => {
        e.preventDefault();

        if (playerName.trim() && selectedLobbyId) {
            const result = await joinLobby(playerName.trim(), selectedLobbyId);
            if (result) {
                setView("waiting");
            }
        }
    };

    const refreshLobbies = () => {
        getAvailableLobbies();
    };

    return (
        <section className="join-container flex flex-col items-center justify-center h-screen">
            <form onSubmit={handleJoinLobby}>
                <div className="flex flex-col gap-1">
                    <label>Player name</label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        required />
                </div>

                <section className="button-wrapper">
                    <button type="button" onClick={refreshLobbies}>
                        <p>Refresh</p>
                    </button>
                    <button type="button" onClick={() => setView('main')}>
                        <p>Back</p>
                    </button>
                </section>
                {availableLobbies?.length === 0 ? (
                    <p className="mt-5 text-sm lg:text-xl text-center">No available lobbies. Create one instead or refresh!</p>
                ) : (
                    <div className="lobbies-list flex flex-row flex-wrap justify-center gap-4 max-h-[300px] overflow-y-auto">
                        <p className=" text-center text-primary-dark text-xl mt-5 font-semibold font-default">Available Lobbies:</p>
                        {availableLobbies?.map(lobby => (
                            <article key={lobby.id} className={`lobby-item ${selectedLobbyId === lobby.id ? 'selected' : ''} w-40 flex gap-2 items-center pl-3 bg-dirty-white rounded-xl`}>
                                <div className="lobby-info">
                                    <h5 className="text-black text-xl font-semibold font-default">{lobby.name || `Lobby ${lobby.id}`}</h5>
                                    <p className="text-black text-sm font-default">Players: {lobby.playerCount}/4</p>
                                    <p className="text-black text-sm font-default">Status: {lobby.status}</p>
                                </div>
                                <button onClick={() => setSelectedLobbyId(lobby.id)}
                                    className="bg-gradient-to-l from-primary-dark to-primary-light rounded-xl shadow-[inset_0px_4px_12px_0px_rgba(0,0,0,0.20)]">
                                    <p className="text-white text-sm font-semibold font-default">Join</p>
                                </button>
                            </article>
                        ))}
                    </div>
                )}
            </form>
        </section>
    );
}

export default JoinForm;