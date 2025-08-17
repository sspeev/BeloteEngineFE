// import * as signalR from '@microsoft/signalr';

class SignalRService {
  constructor() {
    this.connection = null;
    this.handlers = new Map();
    this.currentLobbyId = null;
    this.currentPlayerName = null;
  }
//   }

//   async connect(lobbyId, playerName) {
//     if (!lobbyId) throw new Error('lobbyId is required');
//     if (!playerName) throw new Error('playerName is required');

//     this.currentLobbyId = lobbyId;
//     this.currentPlayerName = playerName;

//     if (this.connection) {
//       await this.disconnect();
//     }

//     this.connection = new signalR.HubConnectionBuilder()
//           .withUrl(`https://localhost:7132/beloteHub?lobbyId=${encodeURIComponent(lobbyId)}`)
//           .withAutomaticReconnect()
//           .configureLogging(signalR.LogLevel.Information)
//           .build();
    
//     this.connection.on("PlayerJoined", (player) => {
//       console.log(`[${playerName}] EVENT: Player joined:`, player);
//       dispatch({ type: 'PLAYER_JOINED', payload: player });
//     });

//     this.connection.on("PlayerLeft", (player) => {
//       console.log(`[${playerName}] EVENT: Player left:`, player);
//       dispatch({ type: 'PLAYER_LEFT', payload: player });
//     });

//     this.connection.on("LobbyUpdated", (lobbyData) => {
//       console.log(`[${playerName}] EVENT: Lobby updated:`, lobbyData);
//       dispatch({ type: 'LOBBY_UPDATED', payload: lobbyData });
//       window.dispatchEvent(new CustomEvent('lobbyUpdated', { detail: lobbyData }));
//     });

//     this.connection.on("GameStarted", (gameData) => {
//       console.log(`[${playerName}] EVENT: Game started:`, gameData);
//       window.dispatchEvent(new CustomEvent('gameStarted', { detail: gameData }));
//     });

//     this.connection.onreconnecting(err => {
//       console.log(`[${playerName}] EVENT: SignalR reconnecting...`, err);
//     });

//     this.connection.start()
//       .then(() => {
//         console.log(`[${playerName}] SignalR Connected!`);
//         setConnection(hubConnection);

//         // Register with the hub after connection
//         return hubConnection.invoke("JoinLobby", currentLobbyId, playerName);
//       })
//       .then(() => {
//         console.log(`[${playerName}] Registered with hub`);
//       })
//       .catch(err => {
//         console.error(`[${playerName}] SignalR Connection Error:`, err);
//       });

//     this.connection.onreconnected(async (connectionId) => {
//       console.log(`[${playerName}] EVENT: SignalR reconnected:`, connectionId);
//       if (this.currentLobbyId && this.currentPlayerName) {
//         await this.connection.invoke("JoinLobby", parseInt(this.currentLobbyId), this.currentPlayerName);
//       }
//     });

//     this.connection.onclose(err => console.log('SignalR closed', err));

    
    
//     return this.connection;
//   }

//   on(event, callback) {
//     if (!this.handlers.has(event)) this.handlers.set(event, new Set());
//     this.handlers.get(event).add(callback);

//     if (this.connection) {
//       this.connection.on(event, callback);
//     }
//   }

//   off(event, callback) {
//     const set = this.handlers.get(event);
//     if (set) {
//       set.delete(callback);
//       if (set.size === 0) this.handlers.delete(event);
//     }
//     if (this.connection && callback) {
//       this.connection.off(event, callback);
//     } else if (this.connection) {
//       this.connection.off(event);
//     }
//   }

//   invoke(method, ...args) {
//     if (!this.connection) {
//       return Promise.reject(new Error('SignalR not connected'));
//     }
//     return this.connection.invoke(method, ...args);
//   }

//   async disconnect() {
//     if (this.connection) {
//       try {
//         if (this.currentLobbyId && this.currentPlayerName) {
//           await this.connection.invoke("LeaveLobby", parseInt(this.currentLobbyId), this.currentPlayerName);
//         }
//         await this.connection.stop();
//       } catch (error) {
//         console.error('Error during disconnect:', error);
//       } finally {
//         this.connection = null;
//         this.currentLobbyId = null;
//         this.currentPlayerName = null;
//       }
//     }
//   }
}

 export default new SignalRService();