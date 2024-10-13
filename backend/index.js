const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000; // Change port if needed

// Use CORS and body-parser
app.use(cors());
app.use(bodyParser.json());

// CSV file path
const csvFilePath = path.join(__dirname, 'public', 'user.csv');

// Endpoint to register a new user
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check for existing users
    fs.readFile(csvFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading CSV file' });
        }

        // Split CSV into rows
        const users = data.split('\n').slice(1).map(line => {
            const [user, pass] = line.split(',');
            return { username: user, password: pass };
        });

        // Check for duplicate usernames
        if (users.some(user => user.username === username)) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Add new user to CSV
        const newEntry = `${username},${password}\n`;
        fs.appendFile(csvFilePath, newEntry, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error writing to CSV file' });
            }
            res.status(200).json({ message: 'Registration successful!' });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
