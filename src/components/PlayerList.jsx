import { useGame } from '../context/gameContext';
import { useEffect } from 'react';

function PlayerList() {
  const {
    connectedPlayers,
    playerName,
    currentPlayer
  } = useGame();

  // Debug connected players changes
  useEffect(() => {
    console.log('Connected players updated:', connectedPlayers);
  }, [connectedPlayers]);

  const getPlayerStatus = (player) => {
    if (player.id === currentPlayer) return 'current-turn';
    if (player.name === playerName) return 'you';
    return 'waiting';
  };

  return (
    <div className="bg-black/80 rounded-xl p-6 text-white mx-auto">
      <section className="text-center mb-6 border-b border-white/20 pb-4">
        <h3 className="text-xl font-bold">Players ({connectedPlayers?.length || 0}/4)</h3>
      </section>

      <div className="flex flex-row flex-wrap gap-3 justify-center">
        {Array.from({ length: 4 }).map((_, index) => {
          const player = connectedPlayers[index];

          // If we have a player for this slot, show player info
          if (player) {
            return (
              <section
                key={player.name || player.id || `player-${index}`}
                className={`w-50 h-sm rounded-lg p-4 ${player.name === playerName ? 'bg-yellow-500/10 border-2 border-yellow-500' : 'bg-white/10'}`}
              >
                <h5 className="text-xl font-bold">{player.name}</h5>
                <p className="text-sm mt-1">
                  {getPlayerStatus(player) === 'you' ? 'You' :
                    getPlayerStatus(player) === 'current-turn' ? 'Current turn' : 'Waiting'}
                </p>
                {player.name === playerName && (
                  <span className="inline-block bg-yellow-500 text-black px-2 py-0.5 text-xs font-bold rounded-full mt-2">
                    You
                  </span>
                )}
              </section>
            );
          }
          // Otherwise show waiting box for empty slot
          return (
            <div
              key={`empty-${index}`}
              className="w-50 h-sm rounded-lg border-2 border-dashed border-white/30 bg-white/5 p-4 flex flex-col items-center opacity-60"
            >
              <div className="text-3xl mb-2">👤</div>
              <div className="text-sm">Waiting for player...</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PlayerList;