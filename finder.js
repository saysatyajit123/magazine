const express = require('express');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const IMAGE_NAME = 'wall_magazine.png'; // Change this to your image filename

app.use(express.json());

// Serve the canvas UI directly
app.get('/', async (req, res) => {
  const imagePath = path.join(__dirname, IMAGE_NAME);

  if (!fs.existsSync(imagePath)) {
    return res.status(404).send(`Error: Place "${IMAGE_NAME}" in the project folder.`);
  }

  const metadata = await sharp(imagePath).metadata();

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Wall Magazine Visual Coordinates Finder</title>
  <style>
    body {
      font-family: monospace;
      background: #0f172a;
      color: #f8fafc;
      margin: 0;
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    #stage {
      flex: 1;
      position: relative;
      overflow: auto;
      background: #020617;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .img-wrapper {
      position: relative;
      user-select: none;
    }
    #magazineImg {
      max-width: 80vw;
      display: block;
      border: 1px solid #334155;
    }
    .selection-box {
      position: absolute;
      border: 2px dashed #00f2fe;
      background: rgba(0, 242, 254, 0.2);
      pointer-events: none;
    }
    #sidebar {
      width: 420px;
      background: #1e293b;
      border-left: 1px solid #334155;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    input, textarea, button {
      background: #0f172a;
      border: 1px solid #334155;
      color: #00f2fe;
      padding: 8px;
      border-radius: 4px;
      font-family: inherit;
    }
    button {
      background: #00f2fe;
      color: #0f172a;
      font-weight: bold;
      cursor: pointer;
    }
    textarea {
      flex: 1;
      resize: none;
      font-size: 0.8rem;
    }
  </style>
</head>
<body>

  <div id="stage">
    <div class="img-wrapper" id="wrapper">
      <img id="magazineImg" src="/image" alt="Magazine">
      <div id="box" class="selection-box" style="display:none;"></div>
    </div>
  </div>

  <div id="sidebar">
    <h3>COORDINATE GENERATOR</h3>
    <p>Click & drag a box over an article or artwork.</p>

    <label>Article ID:</label>
    <input type="text" id="artId" value="article_1">

    <label>Title:</label>
    <input type="text" id="artTitle" value="Sample Article Title">

    <label>Category:</label>
    <input type="text" id="artCat" value="Research Essay">

    <button onclick="addArticleJSON()">+ Add to JSON Output</button>

    <h4>Generated config.json Snippet:</h4>
    <textarea id="jsonOutput" readonly></textarea>
  </div>

  <script>
    const wrapper = document.getElementById('wrapper');
    const img = document.getElementById('magazineImg');
    const box = document.getElementById('box');
    const jsonOutput = document.getElementById('jsonOutput');

    let startX = 0, startY = 0, isDragging = false;
    let currentCoords = { top: "0%", left: "0%", width: "0%", height: "0%" };
    let articlesList = [];

    wrapper.addEventListener('mousedown', (e) => {
      const rect = wrapper.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;
      isDragging = true;

      box.style.left = startX + 'px';
      box.style.top = startY + 'px';
      box.style.width = '0px';
      box.style.height = '0px';
      box.style.display = 'block';
    });

    wrapper.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const rect = wrapper.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const width = currentX - startX;
      const height = currentY - startY;

      box.style.width = Math.abs(width) + 'px';
      box.style.height = Math.abs(height) + 'px';
      box.style.left = (width < 0 ? currentX : startX) + 'px';
      box.style.top = (height < 0 ? currentY : startY) + 'px';
    });

    wrapper.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;

      const rect = wrapper.getBoundingClientRect();
      const boxRect = box.getBoundingClientRect();

      // Convert pixel offsets to relative percentage values centered for overlay rendering
      const leftPx = (boxRect.left - rect.left) + (boxRect.width / 2);
      const topPx = (boxRect.top - rect.top) + (boxRect.height / 2);

      currentCoords = {
        top: ((topPx / rect.height) * 100).toFixed(1) + "%",
        left: ((leftPx / rect.width) * 100).toFixed(1) + "%",
        width: ((boxRect.width / rect.width) * 100).toFixed(1) + "%",
        height: ((boxRect.height / rect.height) * 100).toFixed(1) + "%"
      };
    });

    function addArticleJSON() {
      const article = {
        id: document.getElementById('artId').value,
        title: document.getElementById('artTitle').value,
        category: document.getElementById('artCat').value,
        coords: currentCoords
      };

      articlesList.push(article);
      jsonOutput.value = JSON.stringify(articlesList, null, 2);
    }
  </script>
</body>
</html>
  `);
});

// Serve the dynamic image via Sharp
app.get('/image', (req, res) => {
  const imagePath = path.join(__dirname, IMAGE_NAME);
  res.sendFile(imagePath);
});

app.listen(PORT, () => {
  console.log(`\n Visual Coordinate Finder running at: http://localhost:${PORT}`);
  console.log(`Open the URL in your browser, drag boxes over your magazine photo, and copy the generated JSON.\n`);
});