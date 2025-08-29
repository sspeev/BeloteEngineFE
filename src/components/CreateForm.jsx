import { useGame } from '../context/gameContext';

export default function CreateForm({
    handleCreateLobby,
    playerName,
    setPlayerName,
    lobbyName,
    setLobbyName,
    setView
}) {
    const {
        loading
    } = useGame();
    return (
        <section className="create-container 
        flex flex-col items-center justify-center h-screen">
            <form onSubmit={handleCreateLobby}>
                <div className="flex flex-col gap-1">
                    <label>Player name</label>
                    <input type="text"
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        required />
                </div>
                <div className="flex flex-col gap-1">
                    <label>Lobby name</label>
                    <input type="text"
                        placeholder="Enter lobby name" value={lobbyName}
                        onChange={(e) => setLobbyName(e.target.value)} />
                </div>
                <section className="button-wrapper">
                    <button type="submit" disabled={loading}>
                        <p>Create game</p>
                    </button>
                    <button onClick={() => setView('main')}>
                        <p>Back</p>
                    </button>
                </section>
            </form>
        </section>
    );
}
