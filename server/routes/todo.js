const express = require('express');
const { query } = require('../helpers/db.js'); // Assuming db.js exports pool
const todoRouter = express.Router();

todoRouter.get("/", async (req, res) => {
    try {
        const result = await query('select * from task');
        const rows = result.rows || []; // Ensure rows is an array
        res.status(200).json(rows);
    } catch (error) {
        console.error(error); // Log errors properly
        res.status(500).json({ error: error.message });
    }
});

todoRouter.post('/new', async (req, res) => {
    const { description } = req.body;
    if (!description) {
        return res.status(400).json({ error: 'Description is required' });
    }

    try {
        const newTask = await query('INSERT INTO task (description) VALUES ($1) RETURNING *', [description]);
        res.status(200).json(newTask.rows[0]);
    } catch (error) {
        console.error(error); // Log errors properly
        res.status(500).json({ error: error.message });
    }
});

todoRouter.delete('/delete/:id', async (req, res) => {
    const id = Number(req.params.id);
    try {
        await query('DELETE FROM task WHERE id = $1', [id]);
        res.status(200).json({ id: id });
    } catch (error) {
        console.error(error); // Log errors properly
        res.status(500).json({ error: error.message });
    }
});

module.exports = { todoRouter };
