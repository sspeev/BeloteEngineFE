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
            <form onSubmit={handleCreateLobby} className="w-[200px] lg:w-[400px] p-3 flex flex-col bg-gradient-to-b from-secondary-light to-secondary-dark rounded-3xl">

                <label className="text-primary-light text-xl font-semibold font-default">Player name</label>
                <input className="pl-3 pr-3 pt-1 pb-1 lg:pl-5 lg:pr-5 lg:pt-3 lg:pb-3 bg-dirty-white rounded-2xl"
                    type="text"
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    required />

                <label className="text-primary-light text-xl font-semibold font-default">Lobby name</label>
                <input className="pl-3 pr-3 pt-1 pb-1 lg:pl-5 lg:pr-5 lg:pt-3 lg:pb-3 bg-dirty-white rounded-2xl"
                    type="text"
                    placeholder="Enter lobby name" value={lobbyName}
                    onChange={(e) => setLobbyName(e.target.value)} />

                <section className="button-wrapper flex flex-row justify-center gap-10 mt-2">
                    <button type="submit" disabled={loading} className="pt-1 pb-1 pr-3 pl-3 lg:pt-2 lg:pb-2 lg:pl-5 lg:pr-5 cursor-pointer bg-gradient-to-l from-primary-dark to-primary-light rounded-xl shadow-[inset_0px_4px_12px_0px_rgba(0,0,0,0.20)]">
                        <p className="text-white text-md font-semibold font-default">Create game</p>
                    </button>
                    <button onClick={() => setView('main')} 
                    className="pt-1 pb-1 pr-3 pl-3 lg:pt-2 lg:pb-2 lg:pl-5 lg:pr-5 cursor-pointer bg-gradient-to-b from-primary-light to-primary-dark rounded-xl shadow-[inset_0px_4px_12px_0px_rgba(0,0,0,0.20)]">
                        <p className="text-white text-md font-semibold font-default">Back</p>
                    </button>
                </section>
            </form>
        </section>
    );
}
