const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const PUBLIC_DIR = path.join(__dirname, 'public');
const IMAGES_DIR = path.join(__dirname, 'images');
const CONFIG_PATH = path.join(__dirname, 'config.json');
const IMAGE_NAME = 'images/wall_magazine_2026.png';

app.disable('x-powered-by');
app.use(express.json());

// Config is read on every request so edits to config.json apply without a restart.
app.get('/config.json', async (req, res) => {
  try {
    const raw = await fs.promises.readFile(CONFIG_PATH, 'utf8');
    res.set('Cache-Control', 'no-store').json(JSON.parse(raw));
  } catch (err) {
    console.error('config.json error:', err.message);
    res.status(500).json({ error: 'config.json is missing or contains invalid JSON.' });
  }
});

app.use(express.static(PUBLIC_DIR));
app.use('/images', express.static(IMAGES_DIR));

app.get('/image', (req, res) => {
  const imagePath = path.join(__dirname, IMAGE_NAME);
  if (!fs.existsSync(imagePath)) {
    return res.status(404).send(`Error: place "${IMAGE_NAME}" in the project root directory.`);
  }
  res.sendFile(imagePath);
});

// Not linked from the public site; reachable only by typing the URL.
app.get('/finder', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'finder.html'));
});

app.use((req, res) => {
  res.status(404).send('Not found');
});

app.listen(PORT, () => {
  console.log('\n==================================================');
  console.log(`Wall Magazine App:     http://localhost:${PORT}`);
  console.log(`Coordinate Finder UI:  http://localhost:${PORT}/finder`);
  console.log('==================================================\n');
});
