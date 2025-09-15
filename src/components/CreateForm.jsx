import { useGame } from '../context/GameContext';

export default function CreateForm({
    playerName,
    setPlayerName,
    lobbyName,
    setLobbyName,
    setView
}) {
    const {
        createLobby,
        loading
    } = useGame();

    const handleCreateLobby = async (e) => {
        e.preventDefault();

        if (playerName.trim()) {
            const result = await createLobby(playerName.trim(), lobbyName.trim() || null);
            if (result) {
                setView("waiting");
            }
        }
    };

    return (
        <section className="create-container 
        flex flex-col items-center justify-center h-screen">
            <form onSubmit={handleCreateLobby} name="createLobbyForm">
                <div className="flex flex-col gap-1">
                    <label htmlFor="playerName">Player name</label>
                    <input
                        type="text"
                        id="playerName"
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        required />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="lobbyName">Lobby name</label>
                    <input
                        type="text"
                        id="lobbyName"
                        placeholder="Enter lobby name"
                        value={lobbyName}
                        onChange={(e) => setLobbyName(e.target.value)} />
                </div>
                <section className="button-wrapper">
                    <button type="submit" disabled={loading}>
                        <p>Create</p>
                    </button>
                    <button onClick={() => setView('main')}>
                        <p>Back</p>
                    </button>
                </section>
            </form>
        </section>
    );
}
