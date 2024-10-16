const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const { createObjectCsvWriter } = require("csv-writer");

const app = express();
const PORT = 5000; // Change port if needed

// Use CORS and body-parser
app.use(cors());
app.use(bodyParser.json());

// CSV file path
const csvFilePath = path.join(__dirname, "../frontend/public/user.csv");

// Endpoint to register a new user
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Read the current content of the CSV file
  fs.readFile(csvFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading CSV file" });
    }

    // Ensure the file ends with a newline character

    // if (lines[lines.length - 1] !== '') {
    //     // If the last line is not empty, add a newline
    //     data += '\n';
    // }

    // Prepare the new entry
    const newEntry = `${username.trim()},${password.trim()}\n`; // Ensure each entry ends with a newline

    // Append the new entry to the CSV content
    const updatedData = data + newEntry;

    // Write the updated data back to the CSV file
    fs.writeFile(csvFilePath, updatedData, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error writing to CSV file" });
      }
      res.status(200).json({ message: "Registration successful!" });
    });
  });
});

// New CSV file path (replace this with your desired file path)
const newCsvFilePath = path.join(
  __dirname,
  "../frontend/public/quiz_results.csv"
);

app.post("/submit-quiz", (req, res) => {
  const { userName, score, difficulty, subject } = req.body;

  // Validate input
  if (!userName || score === undefined || !difficulty || !subject) {
    return res.status(400).json({
      message: "User name, score, difficulty, and subject are required",
    });
  }

  // Prepare the new entry for the CSV
  const newEntry = `${userName.trim()},${score},${difficulty.trim()},${subject.trim()}\n`;

  // Append the new entry to the new CSV file
  fs.appendFile(newCsvFilePath, newEntry, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error writing to CSV file" });
    }
    res.status(200).json({ message: "Quiz results submitted successfully!" });
  });
});

const csvFilePath2 = "../frontend/public/quiz_results.csv";
const csvWriter = createObjectCsvWriter({
  path: csvFilePath2,
  header: [
    { id: "userName", title: "userName" },
    { id: "score", title: "score" },
    { id: "difficulty", title: "difficulty" },
  ],
  append: true, // This option allows appending data to an existing CSV
});

// Ensure CSV file exists and has headers if not present
if (!fs.existsSync(csvFilePath)) {
  csvWriter
    .writeRecords([])
    .then(() => console.log("CSV file created with headers."));
}

// Endpoint to submit quiz results
app.post("/submit-quiz", (req, res) => {
  const { userName, score, difficulty, subject } = req.body;
  console.log(req.body);
  // Validate input
  if (!userName || score === undefined || !difficulty || !subject) {
    return res.status(400).json({
      message: "User name, score, difficulty, and subject are required",
    });
  }

  // Prepare the new entry
  const newEntry = `${userName.trim()},${score},${difficulty.trim()},${subject.trim()}\n`;

  // Append the new entry directly to the CSV file without referencing any undefined data
  fs.appendFile(csvFilePath1, newEntry, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error writing to CSV file" });
    }
    res.status(200).json({ message: "Quiz results submitted successfully!" });
  });
});

app.get("/get-quiz-data", (req, res) => {
  const results = [];

  fs.createReadStream(csvFilePath1)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      res.status(200).json(results); // Return the parsed CSV data as JSON
    })
    .on("error", (err) => {
      res.status(500).json({ message: "Error reading CSV file" });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
