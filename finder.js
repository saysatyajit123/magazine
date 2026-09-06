const express = require('express');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const IMAGE_NAME = 'images/wall_magazine_2026.png';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// ---------------------------------------------------------------------------
// 1. CONFIG FILE HELPER
// ---------------------------------------------------------------------------
const getConfigData = () => {
  const configPath = path.join(__dirname, 'config.json');
  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (err) {
      console.error('Error parsing config.json:', err);
    }
  }
  // Default fallback data if config.json does not exist
  return {
    defaultEdition: "2026",
    editions: {
      "2026": {
        header: "GLOBAL BIODIVERSITY: THE WEB OF LIFE (2026)",
        imgSrc: "./images/wall_magazine_2026.png",
        contributors: [
          {
            id: "c1",
            name: "Rupam Das",
            role: "Lead Illustrator",
            department: "B.Sc. Zoology, 5th Sem",
            bio: "Passionate about ecological illustration, wildlife mapping, and scientific visual storytelling.",
            photo: "./images/students/1.png",
            work: "Global Species Distribution Map"
          },
          {
            id: "c2",
            name: "Ananya Baruah",
            role: "Chief Researcher",
            department: "B.Sc. Zoology, 5th Sem",
            bio: "Specializes in phylogenetic analysis, comparative anatomy, and invertebrate research.",
            photo: "./images/students/2.png",
            work: "Animal Kingdom Evolutionary Tree"
          }
        ],
        articles: [
          {
            id: "map",
            title: "Global Species Distribution Map",
            type: "art",
            category: "Artwork Section",
            author: "Rupam Das & Group",
            summary: "Hand-drawn map depicting global biodiversity hotspots, fauna corridors, and coral reefs.",
            body: "A handcrafted global biodiversity map displaying species distribution hotspots across terrestrial biomes and ocean sanctuaries.",
            coords: { top: "26.60%", left: "33.20%", width: "33.80%", height: "34.30%" }
          },
          {
            id: "tree",
            title: "Animal Kingdom Evolutionary Tree",
            type: "research",
            category: "Scientific Diagram",
            author: "Ananya Baruah",
            summary: "Phylogenetic tree tracing structural relationships across non-chordates and chordates.",
            body: "Phylogenetic diagram tracing body symmetry, coelomic organization, and embryonic developments.",
            coords: { top: "75.00%", left: "20.00%", width: "20.00%", height: "24.00%" }
          }
        ]
      }
    }
  };
};

// API Endpoint to serve configuration JSON
app.get('/config.json', (req, res) => {
  res.json(getConfigData());
});

// Serve dynamic magazine image optimized via Sharp
app.get('/image', async (req, res) => {
  const imagePath = path.join(__dirname, IMAGE_NAME);
  if (!fs.existsSync(imagePath)) {
    return res.status(404).send(`Error: Place "${IMAGE_NAME}" in the project root directory.`);
  }
  res.sendFile(imagePath);
});

// ---------------------------------------------------------------------------
// 2. MAIN FRONTEND APP (GET /)
// ---------------------------------------------------------------------------
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Digital Wall Magazine & Student Portal</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #070b14;
      --panel-bg: #0f172a;
      --panel-border: #1e293b;
      --card-bg: #1e293b;
      --card-hover: #2d3d54;
      --accent-cyan: #00f2fe;
      --accent-magenta: #f43f5e;
      --accent-yellow: #fbbf24;
      --accent-glow: rgba(0, 242, 254, 0.25);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-sub: #cbd5e1;
    }
    * { box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--bg-dark);
      color: var(--text-main);
      margin: 0; padding: 0;
      height: 100vh;
      display: flex; flex-direction: column;
      overflow: hidden;
    }
    header {
      background: #090e1a;
      border-bottom: 2px solid var(--accent-cyan);
      padding: 12px 24px;
      display: flex; justify-content: space-between; align-items: center;
      z-index: 100;
      box-shadow: 0 4px 20px rgba(0,0,0,0.6);
    }
    .header-title h1 {
      font-family: 'Outfit', sans-serif;
      margin: 0; font-size: 1.25rem; font-weight: 700;
      color: var(--accent-cyan);
    }
    .header-title p { margin: 2px 0 0; font-size: 0.78rem; color: var(--text-muted); }
    .header-controls { display: flex; gap: 10px; align-items: center; }
    .select-dropdown, .btn {
      background: #182238;
      border: 1px solid var(--panel-border);
      color: var(--text-main);
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 0.82rem; font-weight: 600;
      cursor: pointer; outline: none;
      transition: all 0.2s ease;
    }
    .select-dropdown:focus, .btn:hover {
      border-color: var(--accent-cyan);
      box-shadow: 0 0 12px var(--accent-glow);
    }
    .btn.active {
      background: var(--accent-cyan); color: #070b14;
      border-color: var(--accent-cyan); font-weight: 700;
    }
    .app-workspace { flex: 1; display: flex; position: relative; overflow: hidden; }
    .dashboard {
      width: 320px;
      background: var(--panel-bg);
      border-right: 1px solid var(--panel-border);
      display: flex; flex-direction: column;
      z-index: 20; flex-shrink: 0;
    }
    .sidebar-tabs { display: flex; background: #090e1a; border-bottom: 1px solid var(--panel-border); }
    .tab-btn {
      flex: 1; padding: 14px 10px;
      background: transparent; border: none; border-bottom: 2px solid transparent;
      color: var(--text-muted); font-family: 'Outfit', sans-serif;
      font-weight: 700; font-size: 0.8rem; text-transform: uppercase;
      letter-spacing: 0.5px; cursor: pointer; transition: all 0.2s ease;
      text-align: center;
    }
    .tab-btn:hover { color: var(--text-main); background: rgba(255, 255, 255, 0.02); }
    .tab-btn.active { color: var(--accent-cyan); border-bottom-color: var(--accent-cyan); background: #0f172a; }
    .sidebar-scroll-area { flex: 1; overflow-y: auto; padding: 16px; }
    .sidebar-scroll-area::-webkit-scrollbar { width: 5px; }
    .sidebar-scroll-area::-webkit-scrollbar-thumb { background: var(--panel-border); border-radius: 3px; }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    .article-card, .contributor-card {
      background: var(--card-bg);
      border: 1px solid var(--panel-border);
      border-radius: 8px; padding: 12px 14px; margin-bottom: 12px;
      cursor: pointer; transition: all 0.2s ease;
    }
    .article-card:hover, .contributor-card:hover {
      background: var(--card-hover); border-color: var(--accent-cyan);
      transform: translateX(4px);
    }
    .contributor-card { display: flex; align-items: center; gap: 14px; }
    .contributor-avatar {
      width: 48px; height: 48px; border-radius: 50%;
      object-fit: cover; border: 2px solid var(--accent-cyan);
      background: #090e1a; flex-shrink: 0;
      box-shadow: 0 0 8px rgba(0, 242, 254, 0.2);
    }
    .contributor-info h5 { margin: 0; font-size: 0.9rem; color: var(--text-main); line-height: 1.2; }
    .contributor-info p { margin: 3px 0 0; font-size: 0.76rem; color: var(--accent-yellow); }
    .badge {
      display: inline-block; padding: 2px 7px; border-radius: 4px;
      font-size: 0.65rem; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;
    }
    .badge-research { background: rgba(0, 242, 254, 0.2); color: #00f2fe; border: 1px solid #00f2fe; }
    .stage-container { flex: 1; display: flex; flex-direction: column; position: relative; background: #03060d; overflow: hidden; }
    .stage {
      flex: 1; position: relative; overflow: auto;
      display: flex; align-items: center; justify-content: center; padding: 16px;
    }
    .canvas-container { position: relative; display: inline-block; max-width: 100%; max-height: 100%; }
    .board-img {
      max-height: calc(100vh - 80px); max-width: 100%; object-fit: contain;
      display: block; border-radius: 8px; border: 1px solid var(--panel-border);
      box-shadow: 0 10px 30px rgba(0,0,0,0.7);
    }
    .overlay-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
    .hotspot {
      position: absolute; border: 2px dashed var(--accent-cyan);
      background: rgba(0, 242, 254, 0.12); border-radius: 6px;
      cursor: pointer; pointer-events: auto; transition: all 0.2s ease; z-index: 10;
    }
    .hotspot:hover { background: rgba(0, 242, 254, 0.35); border-style: solid; box-shadow: 0 0 15px var(--accent-glow); }
    .hotspot-label {
      position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
      background: #070b14; color: var(--accent-cyan); font-size: 0.7rem; font-weight: 700;
      padding: 2px 8px; border-radius: 4px; border: 1px solid var(--accent-cyan);
      white-space: nowrap; pointer-events: none; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
    }
    .magnifier-lens {
      position: absolute; border: 2px solid var(--accent-cyan); border-radius: 50%;
      width: 200px; height: 200px; display: none; pointer-events: none;
      background-repeat: no-repeat; z-index: 50; box-shadow: 0 0 25px var(--accent-glow);
    }
    .modal-backdrop {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(3, 6, 13, 0.85); backdrop-filter: blur(8px);
      z-index: 200; display: none; align-items: center; justify-content: center; padding: 20px;
    }
    .profile-card-modal {
      background: #0f172a; border: 2px solid var(--accent-cyan); border-radius: 16px;
      width: 100%; max-width: 520px; padding: 24px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 30px var(--accent-glow); position: relative;
    }
    .profile-card-header { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 16px; border-bottom: 1px solid var(--panel-border); padding-bottom: 16px; }
    .passport-photo-frame {
      position: relative; width: 140px; height: 165px; border-radius: 8px;
      border: 2px solid var(--accent-cyan); padding: 4px; background: #090e1a;
      box-shadow: 0 4px 14px rgba(0,0,0,0.6); flex-shrink: 0;
    }
    .profile-passport-photo { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; display: block; }
    .profile-card-details { flex: 1; padding-top: 2px; }
    .profile-card-details h2 { margin: 0 0 6px; font-size: 1.25rem; font-family: 'Outfit', sans-serif; color: var(--text-main); }
    .profile-card-details .role-badge {
      display: inline-block; background: rgba(251, 191, 36, 0.15); color: var(--accent-yellow);
      border: 1px solid var(--accent-yellow); padding: 3px 10px; border-radius: 12px;
      font-size: 0.72rem; font-weight: 700; margin-bottom: 8px;
    }
    .profile-card-details .dept { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px; }
    .profile-card-details .work-title { font-size: 0.82rem; color: var(--accent-cyan); font-weight: 600; }
    .modal-close-btn {
      position: absolute; top: 16px; right: 16px; background: #182238;
      border: 1px solid var(--panel-border); color: var(--text-muted);
      width: 30px; height: 30px; border-radius: 50%; display: flex;
      align-items: center; justify-content: center; cursor: pointer; font-weight: bold; transition: all 0.2s;
    }
    .modal-close-btn:hover { color: var(--accent-magenta); border-color: var(--accent-magenta); }
    .reader-drawer {
      position: fixed; bottom: 24px; right: 24px; width: 380px;
      background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(12px);
      border: 1px solid var(--accent-cyan); border-radius: 12px; padding: 20px;
      display: none; z-index: 100;
    }
  </style>
</head>
<body>
  <header>
    <div class="header-title">
      <h1 id="magazineHeader">LOADING DIGITAL MAGAZINE...</h1>
      <p>Department of Zoology — Interactive Wall Magazine System</p>
    </div>
    <div class="header-controls">
      <select id="yearSelect" class="select-dropdown" onchange="loadMagazineEdition(this.value)"></select>
      <button class="btn" id="modeBtn" onclick="toggleMode()">🔍 Mode: Lens & Overlays</button>
      <button class="btn" onclick="closeAllModals()">🔄 Reset View</button>
      <a href="/finder" style="text-decoration:none;"><button class="btn">🎯 Coordinate Finder</button></a>
    </div>
  </header>

  <div class="app-workspace">
    <aside class="dashboard">
      <div class="sidebar-tabs">
        <button class="tab-btn active" id="tabArticlesBtn" onclick="switchSidebarTab('articles')">📰 Articles</button>
        <button class="tab-btn" id="tabContributorsBtn" onclick="switchSidebarTab('contributors')">👥 Team & Staff</button>
      </div>
      <div class="sidebar-scroll-area">
        <div id="articlesTab" class="tab-content active"><div id="articleList"></div></div>
        <div id="contributorsTab" class="tab-content"><div id="contributorList"></div></div>
      </div>
    </aside>

    <div class="stage-container">
      <main class="stage" id="stage">
        <div class="canvas-container" id="canvasContainer">
          <img id="boardImg" class="board-img" src="" alt="Wall Magazine Canvas">
          <div id="overlayLayer" class="overlay-layer"></div>
        </div>
        <div id="lens" class="magnifier-lens"></div>
      </main>
    </div>
  </div>

  <div class="modal-backdrop" id="studentModalBackdrop">
    <div class="profile-card-modal">
      <div class="modal-close-btn" onclick="closeStudentModal()">&times;</div>
      <div class="profile-card-header">
        <div class="passport-photo-frame">
          <img id="modalStudentAvatar" class="profile-passport-photo" src="" alt="Student Photo">
        </div>
        <div class="profile-card-details">
          <h2 id="modalStudentName">Student Name</h2>
          <span id="modalStudentRole" class="role-badge">Lead Contributor</span>
          <div id="modalStudentDept" class="dept">Department of Zoology</div>
          <div id="modalStudentWork" class="work-title"></div>
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 6px; font-size: 0.78rem; color: var(--accent-cyan); text-transform: uppercase;">About Contributor</h4>
        <p id="modalStudentBio" style="font-size: 0.85rem; color: var(--text-sub); line-height: 1.4; margin: 0;"></p>
      </div>
    </div>
  </div>

  <div class="reader-drawer" id="readerDrawer">
    <div class="modal-close-btn" onclick="closeDrawer()">&times;</div>
    <h3 id="modalTitle" style="color:var(--accent-cyan); margin-top:0;">Article Title</h3>
    <p id="modalBody" style="font-size:0.88rem; line-height:1.5; color:var(--text-sub);">Body text...</p>
    <div style="font-size:0.8rem; color:var(--text-muted);">
      <strong>Contributor:</strong> <span id="modalAuthor">Student Name</span>
    </div>
  </div>

  <script>
    let magazineData = null;
    let activeMode = "pointer";

    const stage = document.getElementById('stage');
    const container = document.getElementById('canvasContainer');
    const img = document.getElementById('boardImg');
    const overlayLayer = document.getElementById('overlayLayer');
    const lens = document.getElementById('lens');

    function getPhotoUrl(person) {
      if (!person) return 'https://via.placeholder.com/140x165?text=No+Photo';
      let path = person.photo || person.img || person.image || person.avatar || person.src;
      if (!path) return 'https://via.placeholder.com/140x165?text=No+Photo';
      if (!path.startsWith('http://') && !path.startsWith('https://') && !path.startsWith('data:')) {
        path = path.replace(/^(\\.\\/|\\/)/, '');
        return \`./\${path}\`;
      }
      return path;
    }

    async function initApp() {
      try {
        const response = await fetch('/config.json');
        magazineData = await response.json();

        const yearSelect = document.getElementById('yearSelect');
        Object.keys(magazineData.editions).forEach(year => {
          const opt = document.createElement('option');
          opt.value = year;
          opt.innerText = \`\${year} Edition\`;
          yearSelect.appendChild(opt);
        });

        loadMagazineEdition(magazineData.defaultEdition);
      } catch (err) {
        console.error("Initialization Error:", err);
      }
    }

    function switchSidebarTab(tabName) {
      const articlesTab = document.getElementById('articlesTab');
      const contributorsTab = document.getElementById('contributorsTab');
      const tabArticlesBtn = document.getElementById('tabArticlesBtn');
      const tabContributorsBtn = document.getElementById('tabContributorsBtn');

      if (tabName === 'articles') {
        articlesTab.classList.add('active');
        contributorsTab.classList.remove('active');
        tabArticlesBtn.classList.add('active');
        tabContributorsBtn.classList.remove('active');
      } else {
        contributorsTab.classList.add('active');
        articlesTab.classList.remove('active');
        tabContributorsBtn.classList.add('active');
        tabArticlesBtn.classList.remove('active');
      }
    }

    function loadMagazineEdition(year) {
      const edition = magazineData.editions[year];
      document.getElementById('magazineHeader').innerText = edition.header;
      const mainImgSrc = edition.imgSrc ? edition.imgSrc.replace(/^(\\.\\/|\\/)/, './') : '/image';
      img.src = mainImgSrc;

      renderArticles(edition.articles || []);
      renderContributors(edition.contributors || edition.team || []);
      renderOverlays(edition.articles || []);
    }

    function renderArticles(articles) {
      const list = document.getElementById('articleList');
      list.innerHTML = "";
      articles.forEach(art => {
        const card = document.createElement('div');
        card.className = "article-card";
        card.onclick = () => openArticle(art);
        card.innerHTML = \`
          <span class="badge badge-research">\${art.category || art.type || 'Article'}</span>
          <h4 style="margin:4px 0; font-size:0.9rem;">\${art.title}</h4>
          <p style="font-size:0.78rem; color:var(--text-sub); margin:0;">By \${art.author || 'Contributor'}</p>
        \`;
        list.appendChild(card);
      });
    }

    function renderContributors(contributors) {
      const list = document.getElementById('contributorList');
      list.innerHTML = "";
      contributors.forEach(c => {
        const photoUrl = getPhotoUrl(c);
        const card = document.createElement('div');
        card.className = "contributor-card";
        card.onclick = () => openStudentModal(c);
        card.innerHTML = \`
          <img class="contributor-avatar" src="\${photoUrl}" alt="\${c.name}" onerror="this.onerror=null; this.src='https://via.placeholder.com/48?text=User';">
          <div class="contributor-info">
            <h5>\${c.name}</h5>
            <p>\${c.role}</p>
          </div>
        \`;
        list.appendChild(card);
      });
    }

    function renderOverlays(articles) {
      overlayLayer.innerHTML = "";
      articles.forEach(item => {
        if (item.coords) {
          const elem = document.createElement('div');
          elem.className = "hotspot";
          elem.style.top = item.coords.top;
          elem.style.left = item.coords.left;
          elem.style.width = item.coords.width;
          elem.style.height = item.coords.height;

          const label = document.createElement('span');
          label.className = "hotspot-label";
          label.innerText = item.title;
          elem.appendChild(label);

          elem.onclick = (e) => {
            e.stopPropagation();
            openArticle(item);
          };

          overlayLayer.appendChild(elem);
        }
      });
    }

    function openStudentModal(student) {
      const photoUrl = getPhotoUrl(student);
      document.getElementById('modalStudentName').innerText = student.name || 'Student Name';
      document.getElementById('modalStudentRole').innerText = student.role || 'Contributor';
      document.getElementById('modalStudentDept').innerText = student.department || "Department of Zoology";
      document.getElementById('modalStudentWork').innerText = student.work ? \`Contribution: \${student.work}\` : '';
      document.getElementById('modalStudentBio').innerText = student.bio || "Editorial team member contributing to the department wall magazine edition.";
      
      const avatar = document.getElementById('modalStudentAvatar');
      avatar.src = photoUrl;
      avatar.onerror = () => { avatar.src = 'https://via.placeholder.com/140x165?text=Photo'; };

      document.getElementById('studentModalBackdrop').style.display = 'flex';
    }

    function closeStudentModal() {
      document.getElementById('studentModalBackdrop').style.display = 'none';
    }

    stage.addEventListener('mousemove', (e) => {
      if (activeMode !== "lens") return;
      const stageRect = stage.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const x = e.clientX - stageRect.left;
      const y = e.clientY - stageRect.top;

      lens.style.display = 'block';
      lens.style.left = (x - 100) + 'px';
      lens.style.top = (y - 100) + 'px';

      const zoom = 2.2;
      const bgX = -((e.clientX - containerRect.left) * zoom - 100);
      const bgY = -((e.clientY - containerRect.top) * zoom - 100);

      lens.style.backgroundImage = \`url('\${img.src}')\`;
      lens.style.backgroundSize = \`\${containerRect.width * zoom}px \${containerRect.height * zoom}px\`;
      lens.style.backgroundPosition = \`\${bgX}px \${bgY}px\`;
    });

    stage.addEventListener('mouseleave', () => lens.style.display = 'none');

    function toggleMode() {
      activeMode = activeMode === "pointer" ? "lens" : "pointer";
      const btn = document.getElementById('modeBtn');
      btn.innerText = activeMode === "lens" ? "🔍 Mode: Lens ON" : "🏹 Mode: Pointer Mode";
      btn.classList.toggle('active', activeMode === "lens");
      overlayLayer.style.display = activeMode === "lens" ? "none" : "block";
      if (activeMode !== "lens") lens.style.display = 'none';
    }

    function openArticle(art) {
      document.getElementById('modalTitle').innerText = art.title;
      document.getElementById('modalBody').innerText = art.body || art.summary;
      document.getElementById('modalAuthor').innerText = art.author || 'Contributor';
      document.getElementById('readerDrawer').style.display = 'block';
    }

    function closeDrawer() { document.getElementById('readerDrawer').style.display = 'none'; }
    function closeAllModals() { closeDrawer(); closeStudentModal(); }

    initApp();
  </script>
</body>
</html>
  `);
});

// ---------------------------------------------------------------------------
// 3. VISUAL COORDINATE FINDER UTILITY (GET /finder)
// ---------------------------------------------------------------------------
app.get('/finder', async (req, res) => {
  const imagePath = path.join(__dirname, IMAGE_NAME);
  if (!fs.existsSync(imagePath)) {
    return res.status(404).send(`Error: Place "${IMAGE_NAME}" in the project folder.`);
  }

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
      display: inline-block; /* Aligns bounding box strictly with the image dimensions */
      user-select: none;
      -webkit-user-drag: none;
      cursor: crosshair;
    }
    #magazineImg {
      max-width: 80vw;
      display: block;
      border: 1px solid #334155;
      user-select: none;
      -webkit-user-drag: none;
      pointer-events: none;
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
      <img id="magazineImg" src="/image" alt="Magazine" draggable="false">
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
    <a href="/" style="text-decoration:none;"><button style="width:100%; background:#182238; color:#00f2fe;">Back to Magazine</button></a>
  </div>

  <script>
    const wrapper = document.getElementById('wrapper');
    const box = document.getElementById('box');
    const jsonOutput = document.getElementById('jsonOutput');

    let startX = 0, startY = 0, isDragging = false;
    let currentCoords = { top: "0.00%", left: "0.00%", width: "0.00%", height: "0.00%" };
    let articlesList = [];

    wrapper.addEventListener('mousedown', (e) => {
      e.preventDefault();
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

    window.addEventListener('mousemove', (e) => {
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

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;

      const rect = wrapper.getBoundingClientRect();
      const boxRect = box.getBoundingClientRect();

      const leftPx = boxRect.left - rect.left;
      const topPx = boxRect.top - rect.top;

      currentCoords = {
        top: ((topPx / rect.height) * 100).toFixed(2) + "%",
        left: ((leftPx / rect.width) * 100).toFixed(2) + "%",
        width: ((boxRect.width / rect.width) * 100).toFixed(2) + "%",
        height: ((boxRect.height / rect.height) * 100).toFixed(2) + "%"
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

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Wall Magazine App:     http://localhost:${PORT}`);
  console.log(`🎯 Coordinate Finder UI:  http://localhost:${PORT}/finder`);
  console.log(`==================================================\n`);
});