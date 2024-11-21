// server.js

const express = require('express');
const https = require('https');
const fs = require('fs');

const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // For loading environment variables

// Import Express Routes
const studentRoute = require('../backend/routes/student.route');

// Load environment variables from .env file
const { MONGODB_URI, PORT } = process.env;

// Connecting to MongoDB Database
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Database successfully connected!');
    })
    .catch((error) => {
        console.log('Could not connect to database: ' + error);
    });

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/students', studentRoute);

// Define the PORT
const port = 3333;

// Start the server
app.listen(port, () => {
    console.log('Connected to port ' + port);
});

// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).send('Error 404: Not Found!');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.message);
    const status = err.statusCode || 500;
    res.status(status).send(err.message);
});



const options = {
    key: fs.readFileSync('tls/nodejs.key'),
    cert: fs.readFileSync('tls/nodejs.crt'),
    // Opcional: adicionar se precisar validar a cadeia de certificação com a CA
    //ca: fs.readFileSync('/etc/ssl/certs/pti-ca.pem')
};

// Porta padrão utilizada pela aplicação do Node.JS com HTTPS
https.createServer(options, app).listen(PORT, function() {
    console.log('Aplicativo de exemplo ouvindo na porta '+ PORT + ' com HTTPS');
});
