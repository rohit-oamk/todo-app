const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}))

const port = 3001;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'todo_database',
    password: 'Zombies75$',
    port: 7551
});

app.get('/', (req, res) => {
    pool.query('SELECT * FROM task;', (error, results) => {
        if (error) {
            // Handle database query error
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            // Send fetched data as JSON response
            res.status(200).json(results.rows);
        }
    });
});

app.post('/new', (req, res) => {
    const { description } = req.body;
    if (!description) {
        return res.status(400).json({ error: 'Description is required' });
    }

    pool.query('INSERT INTO task (description) VALUES ($1) RETURNING id', [description], (error, result) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json({ id: result.rows[0].id });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.delete("/delete/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(
        'DELETE FROM task WHERE id = $1',
        [id],
        (error, result) => {
            if (error) {
                res.status(500).json({ error: error.message });
            } else {
                if (result.rowCount === 0) {
                    res.status(404).json({ message: 'Task not found' });
                } else {
                    res.status(200).json({ id: id });
                }
            }
        }
    );
});
