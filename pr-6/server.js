const express = require('express');
const ConnectDb = require('./config/db');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000; // Use environment variable for port
const app = express();

// Connect to the database
ConnectDb().catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1); // Exit process with failure code
});

// Set view engine
app.set('view engine', 'ejs');

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
// Serve static files
app.use(express.static('public'));

// Route handling
app.use('/', require('./routes/indexRoute'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, (err) => {
    if (err) {
        console.error('Error starting server:', err);
    } else {
        console.log(`Server started on port ${port}`);
    }
});
