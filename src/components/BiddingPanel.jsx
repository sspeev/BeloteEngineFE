import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import './BiddingPanel.css';

function BiddingPanel() {
  const { 
    makeBid, 
    gameState, 
    playerId, 
    currentPlayer 
  } = useGame();
  const [selectedSuit, setSelectedSuit] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  const isMyTurn = currentPlayer === playerId;
  const suits = ['♠ Spades', '♥ Hearts', '♦ Diamonds', '♣ Clubs', 'No Trump', 'All Trump'];
  const values = ['80', '90', '100', '110', '120', '130', '140', '150', '160'];

  const currentBids = gameState?.bids || [];
  const highestBid = currentBids.length > 0 ? 
    Math.max(...currentBids.map(bid => bid.value || 0)) : 0;

  const handleBid = async () => {
    if (selectedSuit && selectedValue && isMyTurn) {
      const bidValue = parseInt(selectedValue);
      const bid = {
        suit: selectedSuit,
        value: bidValue,
        playerId: playerId
      };
      
      await makeBid(bid);
      setSelectedSuit('');
      setSelectedValue('');
    }
  };

  const handlePass = async () => {
    if (isMyTurn) {
      await makeBid({ type: 'pass', playerId: playerId });
    }
  };

  const handleDouble = async () => {
    if (isMyTurn && currentBids.length > 0) {
      await makeBid({ type: 'double', playerId: playerId });
    }
  };

  const handleRedouble = async () => {
    if (isMyTurn && currentBids.some(bid => bid.type === 'double')) {
      await makeBid({ type: 'redouble', playerId: playerId });
    }
  };

  const getPlayerName = (playerId) => {
    return gameState?.players?.find(p => p.id === playerId)?.name || 'Unknown';
  };

  return (
    <div className="bidding-panel">
      <div className="bidding-header">
        <h3>Bidding Phase</h3>
        {!isMyTurn && (
          <div className="waiting-message">
            Waiting for {getPlayerName(currentPlayer)} to bid...
          </div>
        )}
      </div>

      <div className="bidding-history">
        <h4>Bidding History</h4>
        <div className="bids-list">
          {currentBids.map((bid, index) => (
            <div key={index} className="bid-item">
              <span className="bidder">{getPlayerName(bid.playerId)}:</span>
              <span className="bid-details">
                {bid.type === 'pass' ? 'Pass' :
                 bid.type === 'double' ? 'Double' :
                 bid.type === 'redouble' ? 'Redouble' :
                 `${bid.value} ${bid.suit}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {isMyTurn && (
        <div className="bidding-controls">
          <div className="bid-selection">
            <div className="suit-selection">
              <h4>Select Suit</h4>
              <div className="suit-buttons">
                {suits.map(suit => (
                  <button
                    key={suit}
                    className={`suit-btn ${selectedSuit === suit ? 'selected' : ''}`}
                    onClick={() => setSelectedSuit(suit)}
                  >
                    {suit}
                  </button>
                ))}
              </div>
            </div>

            <div className="value-selection">
              <h4>Select Value</h4>
              <div className="value-buttons">
                {values.map(value => {
                  const numValue = parseInt(value);
                  const isDisabled = numValue <= highestBid;
                  return (
                    <button
                      key={value}
                      className={`value-btn ${selectedValue === value ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                      onClick={() => !isDisabled && setSelectedValue(value)}
                      disabled={isDisabled}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bid-actions">
            <button 
              className="bid-btn primary"
              onClick={handleBid}
              disabled={!selectedSuit || !selectedValue}
            >
              Make Bid
            </button>
            
            <button 
              className="bid-btn secondary"
              onClick={handlePass}
            >
              Pass
            </button>

            {currentBids.length > 0 && !currentBids.some(bid => bid.playerId === playerId) && (
              <button 
                className="bid-btn danger"
                onClick={handleDouble}
              >
                Double
              </button>
            )}

            {currentBids.some(bid => bid.type === 'double') && (
              <button 
                className="bid-btn danger"
                onClick={handleRedouble}
              >
                Redouble
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BiddingPanel;