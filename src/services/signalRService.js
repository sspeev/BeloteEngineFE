import * as signalR from '@microsoft/signalr';

class SignalRService {
    constructor() {
        this.connection = null;
        this.handlers = new Map();
        this.connecting = false;
    }

    async connect(lobbyId, playerName) {
        if (this.connecting) {
            return new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    if (!this.connecting && this.connection) {
                        clearInterval(checkInterval);
                        resolve(this.connection);
                    }
                }, 100);
            });
        }

        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            console.log('SignalR already connected');
            return this.connection;
        }

        await this.disconnect();

        this.connecting = true;
        console.log(`Setting up SignalR for ${playerName} in lobby ${lobbyId}`);

        try {
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(`https://localhost:7132/beloteHub?lobbyId=${encodeURIComponent(lobbyId)}`, {
                    withCredentials: true,
                    timeout: 30000
                })
                .withAutomaticReconnect([0, 1000, 2000, 5000, 10000, 15000, 30000])
                .configureLogging(signalR.LogLevel.Information)
                .build();

            // Register handlers before connecting
            for (const [event, callbacks] of this.handlers.entries()) {
                for (const callback of callbacks) {
                    this.connection.on(event, callback);
                }
            }

            // Connection lifecycle hooks
            this.connection.onreconnecting(error => {
                console.log('SignalR reconnecting:', error);
            });

            this.connection.onreconnected(connectionId => {
                console.log('SignalR reconnected. ID:', connectionId);
            });

            this.connection.onclose(error => {
                console.log('SignalR connection closed:', error);
            });

            // Start the connection with longer timeout
            await this.connection.start();
            console.log('SignalR connected successfully');

            // Wait a bit to ensure connection is stable before returning
            await new Promise(resolve => setTimeout(resolve, 300));

            return this.connection;
        } catch (error) {
            console.error('SignalR connection failed:', error);
            this.connection = null;
            throw error;
        } finally {
            this.connecting = false;
        }
    }

    on(event, callback) {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event).add(callback);

        if (this.connection) {
            this.connection.on(event, callback);
        }
    }

    off(event, callback) {
        const handlers = this.handlers.get(event);
        if (!handlers) return;

        if (callback) {
            handlers.delete(callback);
            if (this.connection) {
                this.connection.off(event, callback);
            }
        } else {
            this.handlers.delete(event);
            if (this.connection) {
                this.connection.off(event);
            }
        }
    }

    async invoke(method, ...args) {
        if (!this.connection) {
            throw new Error('Cannot invoke method: no connection established');
        }

        if (this.connection.state !== signalR.HubConnectionState.Connected) {
            throw new Error(`Cannot invoke method: connection state is ${this.connection.state}`);
        }

        try {
            // Add delay to ensure connection is stable
            await new Promise(resolve => setTimeout(resolve, 100));
            console.log(`Invoking ${method} with args:`, args);
            return await this.connection.invoke(method, ...args);
        } catch (error) {
            console.error(`Error invoking ${method}:`, error);
            throw error;
        }
    }

    async disconnect() {
        if (this.connection) {
            try {
                await this.connection.stop();
                console.log('SignalR disconnected');
            } catch (error) {
                console.error('Error disconnecting SignalR:', error);
            } finally {
                this.connection = null;
            }
        }
    }
}

export default new SignalRService();