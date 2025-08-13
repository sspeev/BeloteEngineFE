import * as signalR from '@microsoft/signalr';

class SignalRService {
  constructor() {
    this.connection = null;
    this.handlers = new Map(); // event -> Set<fn>
  }

  async connect(lobbyId, token) {
    if (!lobbyId) throw new Error('lobbyId is required');

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7132/beloteHub?lobbyId=${encodeURIComponent(lobbyId)}`, {
        accessTokenFactory: () => token || '',
        transport: signalR.HttpTransportType.WebSockets,
        skipNegotiation: true
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000, null])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Attach all pre-registered handlers to the connection
    for (const [event, fns] of this.handlers.entries()) {
      for (const fn of fns) {
        this.connection.on(event, fn);
      }
    }

    // Connection lifecycle
    this.connection.onreconnecting(err => console.log('SignalR reconnecting...', err));
    this.connection.onreconnected(id => console.log('SignalR reconnected:', id));
    this.connection.onclose(err => console.log('SignalR closed', err));

    return this.connection.start()
      .then(() => console.log('SignalR connected'))
      .catch(err => {
        console.error('SignalR connection error:', err);
        throw err;
      });
  }

  on(event, callback) {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event).add(callback);

    // If already connected, hook immediately
    if (this.connection) {
      this.connection.on(event, callback);
    }
  }

  off(event, callback) {
    const set = this.handlers.get(event);
    if (set) {
      set.delete(callback);
      if (set.size === 0) this.handlers.delete(event);
    }
    if (this.connection && callback) {
      this.connection.off(event, callback);
    } else if (this.connection) {
      this.connection.off(event);
    }
  }

  invoke(method, ...args) {
    if (!this.connection) {
      return Promise.reject(new Error('SignalR not connected'));
    }
    return this.connection.invoke(method, ...args);
  }

  async disconnect() {
    if (this.connection) {
      try {
        await this.connection.stop();
      } finally {
        this.connection = null;
      }
    }
  }
}

export default new SignalRService();