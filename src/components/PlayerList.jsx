import { useEffect } from 'react';
import { useGame } from '../context/gameContext';

function PlayerList() {
  const { lobby, playerName } = useGame();
  const players = lobby?.connectedPlayers || [];

  // Debug connected players changes
  useEffect(() => {
    console.log('Connected players updated:', players);
  }, [players]);

  return (
    <div className="bg-black/80 rounded-xl p-6 text-white mx-auto">
      <section className="text-center mb-6 border-b border-white/20 pb-4">
        <h3 className="text-xl font-bold">Players ({players.length}/4)</h3>
      </section>

      <div className="flex flex-row flex-wrap gap-3 justify-center">
        {players.map((player) => (
          <section
            key={player.id || player.name}
            className={`w-50 h-sm rounded-lg p-4 ${player.name === playerName ? 'bg-yellow-500/10 border-2 border-yellow-500' : 'bg-white/10'}`}
          >
            <h5 className="text-xl font-bold">{player.name}</h5>
            {player.name === playerName && (
              <span className="inline-block bg-yellow-500 text-black px-2 py-0.5 text-xs font-bold rounded-full mt-2">
                You
              </span>
            )}
            {player.isHost && (
              <span className="inline-block bg-green-500 text-black px-2 py-0.5 text-xs font-bold rounded-full mt-2 ml-2">
                Host
              </span>
            )}
          </section>
        ))}

        {Array.from({ length: Math.max(0, 4 - players.length) }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="w-50 h-sm rounded-lg border-2 border-dashed border-white/30 bg-white/5 p-4 flex flex-col items-center opacity-60"
          >
            <div className="text-3xl mb-2">👤</div>
            <div className="text-sm">Waiting for player...</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerList;