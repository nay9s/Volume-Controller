const express = require('express');
const loudness = require('loudness');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/volume', async (req, res) => {
    try {
        const volume = await loudness.getVolume();
        const muted = await loudness.getMuted();
        res.json({ volume, muted });
    } catch (error) {
        console.error('Error getting volume:', error);
        res.status(500).json({ error: 'Failed to get volume' });
    }
});

app.post('/api/volume', async (req, res) => {
    const { volume } = req.body;
    if (volume === undefined || typeof volume !== 'number' || volume < 0 || volume > 100) {
        return res.status(400).json({ error: 'Invalid volume level' });
    }

    try {
        await loudness.setVolume(volume);
        res.json({ success: true, volume });
    } catch (error) {
        console.error('Error setting volume:', error);
        res.status(500).json({ error: 'Failed to set volume' });
    }
});

app.post('/api/mute', async (req, res) => {
    const { muted } = req.body;
    if (muted === undefined || typeof muted !== 'boolean') {
        return res.status(400).json({ error: 'Invalid mute status' });
    }

    try {
        await loudness.setMuted(muted);
        res.json({ success: true, muted });
    } catch (error) {
        console.error('Error setting mute:', error);
        res.status(500).json({ error: 'Failed to set mute' });
    }
});

app.post('/api/toggle-mute', async (req, res) => {
    try {
        const muted = await loudness.getMuted();
        await loudness.setMuted(!muted);
        res.json({ success: true, muted: !muted });
    } catch (error) {
        console.error('Error toggling mute:', error);
        res.status(500).json({ error: 'Failed to toggle mute' });
    }
});

app.listen(port, () => {
    console.log(`Volume Controller running at http://localhost:${port}`);
});
