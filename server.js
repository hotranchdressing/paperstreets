// server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Parse JSON requests
app.use(express.json());

// In-memory storage of responses
let responses = [];

// Endpoint to handle submissions
app.post("/submit-response", (req, res) => {
    const { category, text } = req.body;
    console.log("Received response:", category, text);

    // Save in memory
    responses.push({ category, text, timestamp: new Date() });

    // Return all responses for demo
    res.json({ success: true, responses });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
