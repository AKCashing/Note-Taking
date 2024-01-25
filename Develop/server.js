const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const PORT = 3001;
const app = express();

app.use(express.static('public'));
// Parse JSON requests
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8');
        const notes = JSON.parse(data);
        res.json(notes);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/notes', async (req, res) => {
    try {
        const newNote = req.body;
        const data = await fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8');
        const notes = JSON.parse(data);

        newNote.id = Date.now();

        notes.push(newNote);

        await fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes));

        res.json(newNote);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});