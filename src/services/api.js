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
                throw new Error(`HTTP error! status: ${response.status}`);
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

    // Multiple lobby methods
    async createLobby(playerName, lobbyName) {
        return this.request('/Lobby/create', {
            method: 'POST',
            body: JSON.stringify({
                playerName,
                lobbyName
            }),
        });
    }

    async joinLobby(playerName, lobbyId) {
        return this.request('/Lobby/join', {
            method: 'POST',
            body: JSON.stringify({
                playerName,
                lobbyId
            }),
        });
    }

    async getAvailableLobbies() {
        return this.request('/Lobby/listLobbies', {
            method: 'GET'
        });
    }

    async getLobbyState(lobbyId) {
        return this.request(`/Lobby/${lobbyId}`, {
            method: 'GET'
        });
    }

    async playCard(playerName, cardId, lobbyId) {
        return this.request(`/Lobby/${lobbyId}/play`, {
            method: 'POST',
            body: JSON.stringify({ playerName, cardId }),
        });
    }

    async makeBid(playerName, bid, lobbyId) {
        return this.request(`/Lobby/${lobbyId}/bid`, {
            method: 'POST',
            body: JSON.stringify({ playerName, bid }),
        });
    }

    async leaveLobby(playerName, lobbyId) {
        return this.request(`/Lobby/${lobbyId}/leave`, {
            method: 'POST',
            body: JSON.stringify({ playerName }),
        });
    }

    async startGame(lobbyId) {
        return this.request(`/Lobby/${lobbyId}/start`, {
            method: 'POST'
        });
    }

    async getLobbyInfo(lobbyId) {
        return this.request(`/Lobby/${lobbyId}/info`, {
            method: 'GET'
        });
    }
}

export default new ApiService();