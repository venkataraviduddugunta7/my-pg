require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const uri = 'mongodb+srv://venkataraviduddugunta:JVAZwjgvrhIEjq6R@mypg.k3plo.mongodb.net/?retryWrites=true&w=majority&appName=MyPG';
const client = new MongoClient(uri);

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Allow only your React app
}));

app.use(bodyParser.json());
const users = [];

// MongoDB connection and routes
async function run() {
    try {
        await client.connect();
        const database = client.db('MyPG');
        const collection = database.collection('MyPG.Authentication');

        // Register a new user
        app.post('/register', async (req, res) => {
            const { username, password } = req.body;

            // Basic validation
            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required' });
            }

            // Check if the user already exists
            const existingUser = await collection.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = { username, password: hashedPassword };
            const result = await collection.insertOne(newUser);
            res.json({ id: result.insertedId });
        });

        // Login user
        app.post('/login', async (req, res) => {
            const { username, password } = req.body;
            const user = await collection.findOne({ username });

            if (user && await bcrypt.compare(password, user.password)) {
                res.json({ message: 'Login successful', user });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        });

        // Check if username is available
        app.post('/check-username', async (req, res) => {
            const { username } = req.body;

            if (!username) {
                return res.status(400).json({ message: 'Username is required' });
            }

            const existingUser = await collection.findOne({ username });
            if (existingUser) {
                return res.json({ available: false });
            }

            res.json({ available: true });
        });

        // Cleanup on server shutdown
        process.on('SIGINT', async () => {
            await client.close();
            process.exit(0);
        });

        app.listen(5000, () => {
            console.log('Server is running on http://localhost:5000');
        });
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

run().catch(console.error);
