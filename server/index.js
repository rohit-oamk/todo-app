require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Import Pool from pg
const { todoRouter } = require('./routes/todo.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', todoRouter);

const port = process.env.PORT || 3001; // Ensure a default port if PORT is not defined in .env



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
