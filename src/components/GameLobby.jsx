import { useState } from 'react';
import { useGame } from '../context/gameContext';
import Welcome from './Welcome';
import CreateForm from './CreateForm';
import JoinForm from './JoinForm';

const GameLobby = ({ setHasJoinedLobby }) => {
  const {
    createLobby,
    joinLobby,
    availableLobbies,
    getAvailableLobbies
  } = useGame();

  const [playerName, setPlayerName] = useState('');
  const [lobbyName, setLobbyName] = useState('');
  const [selectedLobbyId, setSelectedLobbyId] = useState('');
  const [view, setView] = useState('main');

  const handleCreateLobby = async (e) => {
    e.preventDefault();

    if (playerName.trim()) {
      const result = await createLobby(playerName.trim(), lobbyName.trim() || null);
      if (result) {
        setSelectedLobbyId(result.id || result.lobbyId);
        setHasJoinedLobby(true);
      }
    }
  };

  const handleJoinLobby = async (e) => {
    e.preventDefault();

    if (playerName.trim() && selectedLobbyId) {
      const result = await joinLobby(playerName.trim(), selectedLobbyId);
      if (result) {
        setHasJoinedLobby(true);
      }
    }
  };

  const refreshLobbies = () => {
    getAvailableLobbies();
  };

  return (

    <div className="lobby-container relative overflow-hidden">
      {view === 'main' && (
        <Welcome setView={setView} />
      )}

      {view === 'create' && (
        <CreateForm
          handleCreateLobby={handleCreateLobby}
          playerName={playerName}
          setPlayerName={setPlayerName}
          lobbyName={lobbyName}
          setLobbyName={setLobbyName}
          setView={setView}
        />
      )}

      {view === 'join' && (
        <JoinForm 
        handleJoinLobby={handleJoinLobby} 
        playerName={playerName} 
        setPlayerName={setPlayerName} 
        selectedLobbyId={selectedLobbyId} 
        setSelectedLobbyId={setSelectedLobbyId} 
        availableLobbies={availableLobbies} 
        refreshLobbies={refreshLobbies} 
        setView={setView} />
      )}
      <div className="hearts text-[200px] lg:text-[500px] rotate-[25deg] bottom-1/5 -left-1 absolute bg-gradient-to-b from-primary-dark to-primary-light bg-clip-text text-transparent origin-top-left ">♥</div>
      <div className="spades text-[200px] lg:text-[500px] -rotate-[25deg] top-1/12 right-1 absolute origin-top-left bg-gradient-to-l from-secondary-dark to-secondary-light bg-clip-text text-transparent">♣</div>
    </div>
  );
}

export default GameLobby;