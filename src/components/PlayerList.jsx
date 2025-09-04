import { useGame } from '../context/gameContext';

function PlayerList() {
  const {
    connectedPlayers,
    gameState,
    playerName,
    currentPlayer,
    lobbyId
  } = useGame();

  // Add this to handle empty or undefined connectedPlayers
  const players = Array.isArray(connectedPlayers) ? connectedPlayers : [];

  const getPlayerStatus = (player) => {
    if (player.id === currentPlayer) return 'current-turn';
    if (player.name === playerName) return 'you';
    if (player.isReady) return 'ready';
    return 'waiting';
  };

  const getPlayerTeam = (playerId) => {
    const playerIndex = connectedPlayers?.findIndex(p => p.id === playerId);
    return playerIndex % 2 === 0 ? 'Team A' : 'Team B';
  };

  const getConnectionStatus = (player) => {
    const lastSeen = new Date(player.lastSeen);
    const now = new Date();
    const timeDiff = now - lastSeen;

    if (timeDiff > 30000) return 'disconnected';
    if (timeDiff > 10000) return 'unstable';
    return 'connected';
  };

  return (
    <div className="bg-black/80 rounded-xl p-6 text-white w-full max-w-md mx-auto">
      <div className="text-center mb-6 border-b border-white/20 pb-4">
        <h3 className="text-xl font-bold">Players ({players.length || 0}/4)</h3>
      </div>

      <div className="flex flex-col gap-4">
        {players.map((player, index) => {
          const status = getPlayerStatus(player);
          const connectionStatus = getConnectionStatus(player);
          const team = getPlayerTeam(player.id);

          return (
            <div
              key={player.id}
              className={
                `player-box rounded-lg p-4 border-2 w-50
                ${status === 'current-turn' ? 'border-secondary-light bg-secondary-dark' : ''}
                ${status === 'you' ? 'border-contrast bg-contrast/10' : ''}
                ${connectionStatus === 'disconnected' ? 'opacity-60 bg-red-500/10' : 'bg-white/10'}
                ${status === 'waiting' ? 'border-transparent' : ''}
                `
              }
            >
              <div className="mb-4">
                <div className="flex items-center gap-2 font-bold text-lg">
                  {player.name}
                  {player.name === playerName && (
                    <span className="bg-contrast text-black px-2 py-0.5 rounded-full text-xs font-semibold">You</span>
                  )}
                </div>
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <div>{team}</div>
                  <div>Position {index + 1}</div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className={
                    `inline-block w-2 h-2 rounded-full
                    ${connectionStatus === 'connected' ? 'bg-green-500' : ''}
                    ${connectionStatus === 'unstable' ? 'bg-orange-400' : ''}
                    ${connectionStatus === 'disconnected' ? 'bg-red-600' : ''}`
                  }></span>
                  {connectionStatus === 'connected' ? 'Online' :
                    connectionStatus === 'unstable' ? 'Unstable' : 'Offline'}
                </div>
                {status === 'current-turn' && (
                  <div className="flex items-center gap-1 text-green-500 font-bold animate-bounce">
                    <span>→</span>Turn
                  </div>
                )}
                {player.isReady && gameState?.phase === 'waiting' && (
                  <div className="text-green-500 font-semibold">✓ Ready</div>
                )}
              </div>
            </div>
          );
        })}

        {Array.from({ length: 4 - players.length }).map((_, index) => (
          <div key={`empty-${index}`} className="rounded-lg border-2 border-dashed border-white/30 bg-white/5 p-4 flex flex-col items-center opacity-60">
            <div className="text-3xl mb-2">👤</div>
            <div className="text-sm">Waiting for player...</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerList;