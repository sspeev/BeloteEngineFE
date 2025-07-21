const API_BASE_URL = 'https://localhost:7000/api'; // Update with your C# API URL

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
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Game API methods
    async createGame(playerName) {
        return this.request('/game/create', {
            method: 'POST',
            body: JSON.stringify({ playerName }),
        });
    }

    async joinGame(gameId, playerName) {
        return this.request(`/game/${gameId}/join`, {
            method: 'POST',
            body: JSON.stringify({ playerName }),
        });
    }

    async getGameState(gameId) {
        return this.request(`/game/${gameId}`);
    }

    async playCard(gameId, playerId, cardId) {
        return this.request(`/game/${gameId}/play`, {
            method: 'POST',
            body: JSON.stringify({ playerId, cardId }),
        });
    }

    async makeBid(gameId, playerId, bid) {
        return this.request(`/game/${gameId}/bid`, {
            method: 'POST',
            body: JSON.stringify({ playerId, bid }),
        });
    }
}

export default new ApiService();