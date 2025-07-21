import React from 'react';
import { useGame } from '../context/gameContext';
import Card from './Card';
import './GameBoard.css';

function GameBoard() {
  const { gameState, currentTrick, gamePhase, players, currentPlayer } = useGame();

  const getPlayerPosition = (playerId) => {
    // Position players around the table (North, East, South, West)
    const positions = ['south', 'west', 'north', 'east'];
    const playerIndex = players?.findIndex(p => p.id === playerId) || 0;
    return positions[playerIndex];
  };

  const getTrickCard = (playerId) => {
    return currentTrick?.find(trick => trick.playerId === playerId);
  };

  const getPlayerName = (playerId) => {
    return players?.find(p => p.id === playerId)?.name || 'Unknown';
  };

  return (
    <div className="game-board">
      <div className="board-center">
        <div className="trick-area">
          {players?.map((player) => {
            const position = getPlayerPosition(player.id);
            const trickCard = getTrickCard(player.id);
            const isCurrentPlayer = currentPlayer === player.id;
            
            return (
              <div 
                key={player.id} 
                className={`player-position ${position} ${isCurrentPlayer ? 'current-turn' : ''}`}
              >
                <div className="player-label">
                  {getPlayerName(player.id)}
                  {isCurrentPlayer && <span className="turn-indicator">●</span>}
                </div>
                <div className="card-slot">
                  {trickCard && (
                    <Card 
                      card={trickCard.card} 
                      clickable={false}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="game-info-center">
          <div className="current-phase">
            Phase: {gamePhase}
          </div>
          {gameState?.currentTrump && (
            <div className="trump-suit">
              Trump: {gameState.currentTrump}
            </div>
          )}
          {gameState?.currentContract && (
            <div className="current-contract">
              Contract: {gameState.currentContract.value} {gameState.currentContract.suit}
              <br />
              by {getPlayerName(gameState.currentContract.playerId)}
            </div>
          )}
        </div>
      </div>

      <div className="trick-history">
        <h4>Last Trick Winner</h4>
        {gameState?.lastTrickWinner && (
          <div className="trick-winner">
            {getPlayerName(gameState.lastTrickWinner)}
          </div>
        )}
      </div>
    </div>
  );
}

export default GameBoard;