const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const PORT = 3001;
const app = express();

app.use(express.static('public'));
// Parse JSON requests
app.use(express.json());

// The server responds by sending the index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// The server responds by sending the notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// The server attempts to read the db.json file by using fs.readFile
app.get('/api/notes', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8');
        const notes = JSON.parse(data);
        res.json(notes);
    }
    // If there is an error during the process it returns a 500 Internal Server Error response
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// This code handles the creation of a new note by assigning a unique ID and adding it to the existing array in db.json
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

// This code handles the deletion of a note by accessing the unique ID and removing it from the existing array in db.json
app.delete('/api/notes/:id', async (req, res) => {
    try {
        const noteId = parseInt(req.params.id);
        const data = await fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8');
        let notes = JSON.parse(data);

        notes = notes.filter((note) => note.id !== noteId);

        await fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes));

        res.json({ success:true });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Listen for the Local Host
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});