const API_BASE_URL = 'https://localhost:7132/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}. Error: ${response.body}`);
            }

            // Check if response has content before parsing JSON
            const contentType = response.headers.get('content-type');
            const contentLength = response.headers.get('content-length');

            // If no content or content-length is 0, return null
            if (contentLength === '0' || !contentType?.includes('application/json')) {
                return null;
            }

            // Check if response body is empty
            const text = await response.text();
            if (!text || text.trim() === '') {
                return null;
            }

            return JSON.parse(text);
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Game API methods with proper HTTP methods
    async createGame(playerName) {
        return this.request('/Lobby/create', {
            method: 'POST',
            body: JSON.stringify({ Name: playerName }),
        });
    }

    async joinGame(playerName) {
        return this.request('/Lobby/join', {
            method: 'POST',  // POST for actions/operations
            body: JSON.stringify({ Name: playerName }),
        });
    }

    async getGameState() {
        return this.request('/Lobby/state', {
            method: 'GET'    // GET for retrieving data
        });
    }

    async playCard(playerName, cardId) {
        return this.request('/Lobby/play', {
            method: 'POST',  // POST for game actions
            body: JSON.stringify({ playerName, cardId }),
        });
    }

    async makeBid(playerName, bid) {
        return this.request('/Lobby/bid', {
            method: 'POST',  // POST for game actions
            body: JSON.stringify({ playerName, bid }),
        });
    }

    async leaveLobby(playerName) {
        return this.request('/Lobby/leave', {
            method: 'POST',  // POST for actions
            body: JSON.stringify({ playerName }),
        });
    }

    // Additional REST endpoints you might need
    async updatePlayerStatus(playerName, status) {
        return this.request(`/Lobby/players/${playerName}`, {
            method: 'PUT',   // PUT for updates
            body: JSON.stringify({ status }),
        });
    }

    async deletePlayer(playerName) {
        return this.request(`/Lobby/players/${playerName}`, {
            method: 'DELETE' // DELETE for removing resources
        });
    }
}

export default new ApiService();