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
            
            // Get response text first
            const text = await response.text();
            
            if (!response.ok) {
                // Try to parse error message from response
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = JSON.parse(text);
                    errorMessage = errorData.message || errorData.title || errorMessage;
                } catch {
                    // If not JSON, use text as error message
                    errorMessage = text || errorMessage;
                }
                throw new Error(errorMessage);
            }

            // Check if response has content
            if (!text || text.trim() === '') {
                return null;
            }

            // Try to parse as JSON
            try {
                return JSON.parse(text);
            } catch {
                // If not JSON, return the text
                return text;
            }
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