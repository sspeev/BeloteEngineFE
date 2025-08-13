import * as signalR from '@microsoft/signalr';

class SignalRService {
  constructor() {
    this.connection = null;
    this.callbacks = {};
  }

  async connect(gameId, token) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7132/beloteHub?gameId=${gameId}`, {
        accessTokenFactory: () => token,
        transport: signalR.HttpTransportType.WebSockets, // Force WebSockets if possible
        skipNegotiation: true // Skip negotiation for WebSockets
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000, null])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Set up event handlers for methods the server can call
    this.connection.on('PlayerCountUpdated', (count) => {
      if (this.callbacks['playerCountUpdated']) {
        this.callbacks['playerCountUpdated'](count);
      }
    });

    this.connection.on('PlayersUpdated', (players) => {
      if (this.callbacks['playersUpdated']) {
        this.callbacks['playersUpdated'](players);
      }
    });

    this.connection.on('GameStarted', () => {
      if (this.callbacks['gameStarted']) {
        this.callbacks['gameStarted']();
      }
    });

    // Connection lifecycle events
    this.connection.onreconnecting(error => {
      console.log('Connection lost, reconnecting...', error);
    });

    this.connection.onreconnected(connectionId => {
      console.log('Connection reestablished. Connected with ID:', connectionId);
    });

    this.connection.onclose(error => {
      console.log('Connection closed', error);
    });

    // Start the connection
    return this.connection.start()
      .then(() => console.log('SignalR connected'))
      .catch(err => {
        console.error('SignalR connection error:', err);
        throw err;
      });
  }

  on(event, callback) {
    this.callbacks[event] = callback;
  }

  invoke(method, ...args) {
    if (!this.connection) {
      console.error('SignalR not connected');
      return Promise.reject('SignalR not connected');
    }
    return this.connection.invoke(method, ...args);
  }

  disconnect() {
    if (this.connection) {
      return this.connection.stop();
    }
    return Promise.resolve();
  }
}

export default new SignalRService();