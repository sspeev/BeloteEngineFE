class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
    this.listeners = new Map();
    this.currentLobbyId = null;
    this.currentPlayerId = null;
    this.isConnecting = false;
    this.connectionTimeout = null;
  }

  connect(playerId, lobbyId) {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      console.log('WebSocket is already connected or connecting.');
      return;
    }

    this.isConnecting = true;
    this.currentPlayerId = playerId;
    this.currentLobbyId = lobbyId;

    // FIX: Hardcode 'wss:' because the backend API is served over HTTPS.
    // A ws:// connection to a wss:// server will fail the handshake.
    const protocol = 'wss:';
    const wsUrl = `${protocol}//localhost:7132/ws/lobby/${lobbyId}?playerId=${encodeURIComponent(playerId)}`;

    try {
      console.log(`Attempting to connect to: ${wsUrl}`);
      this.ws = new WebSocket(wsUrl);

      // Add a timeout for the connection attempt
      this.connectionTimeout = setTimeout(() => {
        if (this.isConnecting) {
          console.error('WebSocket connection attempt timed out.');
          this.ws.close(); // This will trigger the onclose event
        }
      }, 10000); // 10-second timeout

      this.ws.onopen = () => {
        clearTimeout(this.connectionTimeout);
        this.isConnecting = false;
        console.log(`WebSocket connected to lobby ${lobbyId}`);
        this.reconnectAttempts = 0;
        this.emit('connected');

        this.send('connection_established', { playerId, lobbyId });
      };

      this.ws.onmessage = (event) => {
        try {
          console.log('Received WebSocket message:', event.data);
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
          this.handleMessage({ type: 'text', payload: event.data });
        }
      };

      this.ws.onclose = (event) => {
        clearTimeout(this.connectionTimeout);
        this.isConnecting = false;
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.emit('disconnected', { code: event.code, reason: event.reason });

        // Only attempt reconnect if it wasn't a normal closure (code 1000)
        if (event.code !== 1000) {
          this.attemptReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error event:', error);
        // The onerror event is generic. The onclose event provides more details.
        this.emit('error', new Error('WebSocket connection failed. See browser console for details.'));
      };

    } catch (error) {
      this.isConnecting = false;
      console.error('Failed to create WebSocket connection:', error);
      this.emit('error', error);
    }
  }

  handleMessage(msg) {
    // Log raw message
    console.log('WS message parsed:', msg);

    // Normalize: backend may send {type, data} or {event, payload}
    const type = msg.type || msg.event;
    const payload = msg.payload || msg.data || msg;

    switch (type) {
      case 'gameState':
      case 'gameStateUpdate':
        this.emit('gameStateUpdate', payload);
        break;
      case 'playerJoined':
      case 'PlayerJoined':
        this.emit('playerJoined', payload);
        break;
      case 'playerLeft':
      case 'PlayerLeft':
        this.emit('playerLeft', payload);
        break;
      default:
        this.emit('unknown', msg);
        console.debug('Unknown WS message type:', type, msg);
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.currentPlayerId && this.currentLobbyId) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

      setTimeout(() => {
        this.connect(this.currentPlayerId, this.currentLobbyId);
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('maxReconnectAttemptsReached');
    }
  }

  send(type, payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type, payload });
      console.log('Sending WebSocket message:', message);
      this.ws.send(message);
    } else {
      console.error('WebSocket is not connected. State:', this.getConnectionState());
    }
  }

  // Event listener methods
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in WebSocket event callback:', error);
        }
      });
    }
  }

  disconnect() {
    if (this.ws) {
      // Prevent reconnection attempts on manual disconnect
      this.reconnectAttempts = this.maxReconnectAttempts;
      this.ws.close(1000, 'Client disconnecting');
    }
    this.ws = null;
    this.isConnecting = false;
    clearTimeout(this.connectionTimeout);
    this.currentPlayerId = null;
    this.currentLobbyId = null;
    this.listeners.clear();
  }

  getConnectionState() {
    if (!this.ws) return 'disconnected';

    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'unknown';
    }
  }
}

export default new WebSocketService();