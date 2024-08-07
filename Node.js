const express = require('express');
const cors = require('cors');

const app = express();

// Use cors with specific origin
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Your frontend origin
    credentials: true // Allow credentials
}));

app.get('/api/isAuthenticated', (req, res) => {
    // Your route logic
    res.json({status: true});
});

app.listen(8080, () => console.log('Server running on http://localhost:8080'));
