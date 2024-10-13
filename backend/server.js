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
const csvFilePath = path.join(__dirname, '../frontend/public/user.csv');

// Endpoint to register a new user
app.post('/register', (req, res) => {
    let { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Trim username and password
    username = username.trim();
    password = password.trim(); // This should remove leading and trailing whitespace/newlines

    // Debugging: Log the received username and password
    console.log(`Received Username: "${username}", Received Password: "${password}"`);

    // Check for existing users
    fs.readFile(csvFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading CSV file' });
        }

        // Split CSV into rows and filter out empty lines
        const users = data.split('\n').filter(line => line.trim() !== '').map(line => {
            const [user, pass] = line.split(',').map(field => field.trim());
            return { name: user, password: pass };
        });

        // Check for duplicate usernames
        if (users.some(user => user.name === username)) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Prepare the new entry ensuring proper formatting
        const newEntry = `${username},${password}\n`;
        const blankLine = `\n`;

        // Debugging: Log the new entry
        console.log(`New Entry to be added: "${newEntry}"`);

        // Add new user to CSV
        fs.appendFile(csvFilePath,newEntry, (err) => {
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
