import { useState } from 'react';
import { useGame } from '../../contexts/GameContext.jsx';
import Welcome from '../main/Welcome.jsx';
import CreateForm from '../main/CreateForm.jsx';
import JoinForm from '../main/JoinForm.jsx';
import Waiting from '../main/Waiting.jsx';
import Board from '../in-game/Board.jsx';

const GameLobby = () => {
  const { lobby, gamePhase } = useGame();

  const [playerName, setPlayerName] = useState('');
  const [lobbyName, setLobbyName] = useState('');
  const [selectedLobbyId, setSelectedLobbyId] = useState('');
  const [view, setView] = useState('main');

  if (lobby) {
    if (gamePhase === 'waiting') return <Waiting />;
    return <Board />;
  }

  return (
    <div className="lobby-container no-scrollbar relative overflow-x-hidden">
      {view === 'main' && (
        <Welcome setView={setView} />
      )}

      {view === 'create' && (
        <CreateForm
          playerName={playerName}
          setPlayerName={setPlayerName}
          lobbyName={lobbyName}
          setLobbyName={setLobbyName}
          setView={setView}
        />
      )}

      {view === 'join' && (
        <JoinForm
          playerName={playerName}
          setPlayerName={setPlayerName}
          selectedLobbyId={selectedLobbyId}
          setSelectedLobbyId={setSelectedLobbyId}
          setView={setView}
        />
      )}

      <div className="hearts text-[200px] lg:text-[500px] rotate-[25deg] bottom-1/5 -left-1 absolute bg-gradient-to-b from-primary-dark to-primary-light bg-clip-text text-transparent origin-top-left ">♥</div>
      <div className="spades text-[200px] lg:text-[500px] -rotate-[25deg] top-1/12 right-1 absolute origin-top-left bg-gradient-to-l from-secondary-dark to-secondary-light bg-clip-text text-transparent">♣</div>
    </div>
  );
};

export default GameLobby;