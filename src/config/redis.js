// src/config/redisClient.js
const redis = require('redis');
const { promisify } = require('util');
require('dotenv').config();

const client = redis.createClient({
    host: "localhost",
    port: 6379,
    password: 12423234234
});

// Promisify Redis methods for easier use with async/await
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);

client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => {
    console.error('Redis error:', err);
});

// Function to connect to Redis
const connectRedis = async () => {
    if (!client.connected) {
        client.connect().catch((err) => console.error('Redis connection error:', err));
    }
};

module.exports = { client, getAsync, setAsync, delAsync, connectRedis };