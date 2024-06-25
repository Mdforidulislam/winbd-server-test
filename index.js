const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./src/db/connectDB');
const router = require('./src/routes');
const globalErrorHandler = require('./src/utils/globalErrorHandler');
const { setupWebSocket } = require('./src/middlewares/websoket');



const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(router);

// Health check route
app.get("/health", (req, res) => {
    res.send('admin system running');
});

// Create HTTPS server
const server = http.createServer(app);
// Setup WebSocket server
setupWebSocket(server);

// Error handling middleware
app.all('*', (req, res, next) => {
    const error = new Error(`Can't find ${req.originalUrl} on this server`);
    error.status = 404;
    next(error);
});
app.use(globalErrorHandler);



// Connect to the database and start the server
const main = async () => {
    await connectDB();
    server.listen(port, () => {
        console.log(`Admin management system running on port ${port}`);
    });
};

main();

module.exports = app;
