const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config(); 
const app = express();

connectDB();
console.log("test1")

app.use(cors());
console.log("test2")
app.use(bodyParser.json());
console.log("test3")
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

