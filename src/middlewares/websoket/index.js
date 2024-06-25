const WebSocket = require('ws');

const clients = new Map();

const setupWebSocket = (server) => {
    console.log('Setting up WebSocket server...');

    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('New client connected');
        
        ws.on('message', (message) => {
            const data = JSON.parse(message);
            console.log('Received message:', data);
            if (data.type === 'join') {
                const userId = data.userId;
                clients.set(userId, ws);
                ws.userId = userId;
            }
        });

        ws.on('close', () => {
            console.log('Client disconnected');
            if (ws.userId) {
                clients.delete(ws.userId);
            }
        });
    });
};

const notifyClient = (userId, data) => {
    const client = clients.get(userId);
    if (client) {
        client.send(JSON.stringify(data));
    }
};

module.exports = { setupWebSocket, notifyClient };
