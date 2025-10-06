import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import './ScoreBoard.css';

function ScoreBoard() {
  const { gameState, players } = useGame();
  const [showDetailed, setShowDetailed] = useState(false);

  const getTeamPlayers = (teamIndex) => {
    return players?.filter((_, index) => index % 2 === teamIndex) || [];
  };

  const getTeamScore = (teamIndex) => {
    const teamPlayers = getTeamPlayers(teamIndex);
    return teamPlayers.reduce((total, player) => {
      return total + (gameState?.scores?.[player.id] || 0);
    }, 0);
  };

  const getTeamTricks = (teamIndex) => {
    const teamPlayers = getTeamPlayers(teamIndex);
    return teamPlayers.reduce((total, player) => {
      return total + (gameState?.tricksWon?.[player.id] || 0);
    }, 0);
  };

  const getRoundHistory = () => {
    return gameState?.roundHistory || [];
  };

  const getCurrentRoundStats = () => {
    return gameState?.currentRound || {};
  };

  return (
    <div className="scoreboard">
      <div className="scoreboard-header">
        <h3>Score Board</h3>
        <button 
          className="toggle-detailed"
          onClick={() => setShowDetailed(!showDetailed)}
        >
          {showDetailed ? 'Simple View' : 'Detailed View'}
        </button>
      </div>

      <div className="team-scores">
        <div className="team team-a">
          <h4>Team A</h4>
          <div className="team-players">
            {getTeamPlayers(0).map(player => (
              <div key={player.id} className="player-score">
                <span className="player-name">{player.name}</span>
                <span className="individual-score">
                  {gameState?.scores?.[player.id] || 0}
                </span>
              </div>
            ))}
          </div>
          <div className="team-total">
            <strong>Total: {getTeamScore(0)}</strong>
          </div>
          <div className="team-tricks">
            Tricks: {getTeamTricks(0)}
          </div>
        </div>

        <div className="score-divider">VS</div>

        <div className="team team-b">
          <h4>Team B</h4>
          <div className="team-players">
            {getTeamPlayers(1).map(player => (
              <div key={player.id} className="player-score">
                <span className="player-name">{player.name}</span>
                <span className="individual-score">
                  {gameState?.scores?.[player.id] || 0}
                </span>
              </div>
            ))}
          </div>
          <div className="team-total">
            <strong>Total: {getTeamScore(1)}</strong>
          </div>
          <div className="team-tricks">
            Tricks: {getTeamTricks(1)}
          </div>
        </div>
      </div>

      {showDetailed && (
        <div className="detailed-stats">
          <div className="current-round">
            <h4>Current Round</h4>
            <div className="round-info">
              {gameState?.currentContract && (
                <div className="contract-info">
                  <strong>Contract:</strong> {gameState.currentContract.value} {gameState.currentContract.suit}
                  <br />
                  <strong>By:</strong> {players?.find(p => p.id === gameState.currentContract.playerId)?.name}
                  {gameState.currentContract.doubled && <span className="doubled"> (Doubled)</span>}
                  {gameState.currentContract.redoubled && <span className="redoubled"> (Redoubled)</span>}
                </div>
              )}
              
              <div className="round-progress">
                <strong>Tricks Played:</strong> {gameState?.tricksPlayed || 0} / 8
              </div>

              {gameState?.declarations && Object.keys(gameState.declarations).length > 0 && (
                <div className="declarations">
                  <h5>Declarations:</h5>
                  {Object.entries(gameState.declarations).map(([playerId, declarations]) => (
                    <div key={playerId} className="player-declarations">
                      <strong>{players?.find(p => p.id === playerId)?.name}:</strong>
                      {declarations.map((decl, index) => (
                        <span key={index} className="declaration">
                          {decl.type} ({decl.points}pts)
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="round-history">
            <h4>Round History</h4>
            <div className="history-list">
              {getRoundHistory().map((round, index) => (
                <div key={index} className="history-round">
                  <div className="round-header">
                    <strong>Round {index + 1}</strong>
                    <span className="round-date">
                      {new Date(round.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="round-details">
                    <div className="contract">
                      Contract: {round.contract.value} {round.contract.suit} 
                      by {players?.find(p => p.id === round.contract.playerId)?.name}
                    </div>
                    <div className="round-scores">
                      Team A: +{round.teamAScore} | Team B: +{round.teamBScore}
                    </div>
                    {round.contractMade ? (
                      <div className="contract-result success">Contract Made</div>
                    ) : (
                      <div className="contract-result failed">Contract Failed</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {gameState?.gameWinner && (
        <div className="game-winner">
          <h3>🎉 Game Over! 🎉</h3>
          <div className="winner-announcement">
            {gameState.gameWinner} Wins!
          </div>
          <div className="final-scores">
            Final Score: Team A ({getTeamScore(0)}) - Team B ({getTeamScore(1)})
          </div>
        </div>
      )}
    </div>
  );
}

export default ScoreBoard;