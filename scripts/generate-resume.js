import fs from 'fs';
import path from 'path';
import os from 'os';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Narciso III Javier - Resume</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap');

    @page {
      size: letter;
      margin: 0.45in 0.55in 0.45in 0.55in;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'EB Garamond', 'Garamond', 'Georgia', 'Times New Roman', serif;
      font-size: 10.5pt;
      line-height: 1.34;
      color: #111111;
      background-color: #ffffff;
      -webkit-font-smoothing: antialiased;
    }

    .resume-container {
      width: 100%;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0;
    }

    /* HEADER */
    .header {
      text-align: center;
      margin-bottom: 12px;
      padding-bottom: 2px;
    }

    .header h1 {
      font-size: 21.5pt;
      font-weight: 700;
      letter-spacing: 0.75px;
      text-transform: uppercase;
      margin-bottom: 2px;
      color: #000000;
    }

    .header .subtitle {
      font-size: 10.5pt;
      font-weight: 500;
      font-style: italic;
      color: #222222;
      margin-bottom: 4px;
    }

    .contact-line {
      font-size: 9.5pt;
      color: #333333;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 7px;
      align-items: center;
    }

    .contact-line a {
      color: #111111;
      text-decoration: none;
      border-bottom: 1px dotted #777777;
    }

    .contact-line a:hover {
      border-bottom: 1px solid #000000;
    }

    .separator {
      color: #777777;
      font-weight: 400;
    }

    /* SECTIONS */
    .section {
      margin-bottom: 11px;
    }

    .section:last-child {
      margin-bottom: 0;
    }

    .section-title {
      font-size: 11pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.75px;
      color: #000000;
      border-bottom: 1px solid #111111;
      padding-bottom: 1.5px;
      margin-bottom: 6px;
    }

    /* ENTRIES */
    .entry {
      margin-bottom: 8px;
    }

    .entry:last-child {
      margin-bottom: 0;
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .entry-title {
      font-weight: 700;
      font-size: 10.5pt;
      color: #000000;
    }

    .entry-subtitle {
      font-style: italic;
      font-size: 10pt;
      color: #222222;
    }

    .entry-date {
      font-size: 10pt;
      font-style: italic;
      text-align: right;
      white-space: nowrap;
      color: #222222;
    }

    .entry-location {
      font-size: 10pt;
      font-style: italic;
      text-align: right;
      white-space: nowrap;
      color: #222222;
    }

    .tech-stack {
      font-size: 9.5pt;
      font-style: italic;
      color: #333333;
      margin-top: 1px;
      margin-bottom: 2px;
    }

    .tech-stack strong {
      font-style: normal;
      font-weight: 600;
      color: #111111;
    }

    /* BULLETS */
    ul.bullet-list {
      list-style-type: disc;
      margin-left: 17px;
      margin-top: 2px;
      margin-bottom: 2px;
    }

    ul.bullet-list li {
      font-size: 10pt;
      line-height: 1.32;
      color: #1a1a1a;
      margin-bottom: 2.5px;
      text-align: justify;
    }

    ul.bullet-list li:last-child {
      margin-bottom: 0;
    }

    /* SKILLS TABLE / LIST */
    .skills-grid {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .skill-row {
      font-size: 10pt;
      line-height: 1.3;
      display: flex;
    }

    .skill-category {
      font-weight: 700;
      width: 145px;
      flex-shrink: 0;
      color: #000000;
    }

    .skill-items {
      color: #222222;
      flex-grow: 1;
    }

    /* PROJECT LINKS */
    .project-link {
      font-size: 9.5pt;
      font-style: italic;
      text-decoration: none;
      color: #222222;
      border-bottom: 1px dotted #888888;
    }

    .project-link:hover {
      border-bottom: 1px solid #000000;
    }

    /* PRINT RULES */
    @media print {
      body {
        background-color: transparent;
      }
      .resume-container {
        width: 100%;
        max-width: 100%;
      }
      a {
        text-decoration: none !important;
        color: #000000 !important;
        border-bottom: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="resume-container">
    <!-- HEADER -->
    <header class="header">
      <h1>Narciso III Javier</h1>
      <div class="subtitle">Computer Science Student &bull; Systems, Backend &amp; Software Engineering</div>
      <div class="contact-line">
        <span>Baguio City, Philippines</span>
        <span class="separator">|</span>
        <span>+63 976 451 1638</span>
        <span class="separator">|</span>
        <a href="mailto:renzoj156@gmail.com">renzoj156@gmail.com</a>
        <span class="separator">|</span>
        <a href="https://linkedin.com/in/narcisoiii-javier" target="_blank">linkedin.com/in/narcisoiii-javier</a>
        <span class="separator">|</span>
        <a href="https://github.com/narcisoJavier" target="_blank">github.com/narcisoJavier</a>
        <span class="separator">|</span>
        <a href="https://narcisojavier.vercel.app" target="_blank">narcisojavier.vercel.app</a>
      </div>
    </header>

    <!-- EDUCATION -->
    <section class="section">
      <h2 class="section-title">Education</h2>
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">Saint Louis University</div>
          <div class="entry-location">Baguio City, Philippines</div>
        </div>
        <div class="entry-header">
          <div class="entry-subtitle">Bachelor of Science in Computer Science</div>
          <div class="entry-date">Expected Graduation: June 2027</div>
        </div>
        <ul class="bullet-list" style="margin-top: 3px;">
          <li><strong>Credentials &amp; Certifications:</strong> Smart City Challenge &ndash; Certified Participant (2024) &bull; AI Development Track &ndash; Specialization Certificate</li>
          <li><strong>Relevant Coursework:</strong> Data Structures &amp; Algorithms, Operating Systems, Database Management Systems, Computer Networks, Software Engineering</li>
        </ul>
      </div>
    </section>

    <!-- TECHNICAL SKILLS -->
    <section class="section">
      <h2 class="section-title">Technical Skills</h2>
      <div class="skills-grid">
        <div class="skill-row">
          <span class="skill-category">Languages:</span>
          <span class="skill-items">Python, Go, C++, C#, Dart, JavaScript (ES6+), TypeScript, Node.js, PHP, SQL</span>
        </div>
        <div class="skill-row">
          <span class="skill-category">Frameworks &amp; Libs:</span>
          <span class="skill-items">Unity 3D, Flutter, React, Next.js, PyQt6, Leaflet.js, Vite, Tailwind CSS</span>
        </div>
        <div class="skill-row">
          <span class="skill-category">Tools &amp; Infrastructure:</span>
          <span class="skill-items">Docker, Docker Compose, Git, GitHub, Linux/Bash, VS Code Remote Dev Containers, Supabase, MySQL</span>
        </div>
        <div class="skill-row">
          <span class="skill-category">Core Areas:</span>
          <span class="skill-items">Systems Programming, Network Protocols (SSH, SFTP), GIS Mapping, Microservices, Desktop Automation, RESTful APIs</span>
        </div>
      </div>
    </section>

    <!-- SELECTED TECHNICAL PROJECTS -->
    <section class="section">
      <h2 class="section-title">Selected Technical Projects</h2>

      <!-- Tether -->
      <div class="entry">
        <div class="entry-header">
          <div>
            <span class="entry-title">Tether</span>
            <span class="entry-subtitle"> &ndash; Mobile SSH &amp; Mesh Terminal Client</span>
          </div>
          <div class="entry-date">
            <a href="https://github.com/narcisoJavier/Tether" target="_blank" class="project-link">github.com/narcisoJavier/Tether</a>
          </div>
        </div>
        <div class="tech-stack"><strong>Technologies:</strong> Flutter, Dart, SSH/SFTP Protocols, VT100 Terminal Emulation, Tailscale Mesh Engine, Android Keystore</div>
        <ul class="bullet-list">
          <li>Architected an Android-first systems client combining a native Dart SSH/SFTP engine, VT100/xterm terminal emulation, and direct port forwarding.</li>
          <li>Integrated embedded Tailscale mesh networking to establish authenticated zero-config P2P connections to remote servers without public port forwarding.</li>
          <li>Implemented hardware-backed cryptographic storage via Android Keystore to securely safeguard private keys, passwords, and session credentials.</li>
        </ul>
      </div>

      <!-- geoCradle -->
      <div class="entry">
        <div class="entry-header">
          <div>
            <span class="entry-title">geoCradle</span>
            <span class="entry-subtitle"> &ndash; Watershed &amp; Administrative Boundary GIS Platform</span>
          </div>
          <div class="entry-date">
            <a href="https://github.com/narcisoJavier/geoCradle" target="_blank" class="project-link">github.com/narcisoJavier/geoCradle</a>
          </div>
        </div>
        <div class="tech-stack"><strong>Technologies:</strong> React, Vite, Leaflet.js, GeoJSON, PMTiles, Supabase, Tesseract OCR Pipeline</div>
        <ul class="bullet-list">
          <li>Developed an interactive geospatial web application visualizing 13 major river basins and administrative boundaries across the Cordillera region.</li>
          <li>Engineered client-side vector-tile rendering using PMTiles and GeoJSON for 60 FPS drill-down navigation and high-density topographical layer toggling.</li>
          <li>Integrated a Supabase backend with an automated OCR extraction pipeline to ingest and catalog administrative boundary survey metadata.</li>
        </ul>
      </div>

      <!-- Campus Navigator CS312 -->
      <div class="entry">
        <div class="entry-header">
          <div>
            <span class="entry-title">Campus Navigator CS312</span>
            <span class="entry-subtitle"> &ndash; Containerized Microservices Routing Engine</span>
          </div>
          <div class="entry-date">
            <a href="https://github.com/narcisoJavier/WebDev_Campus-Navigator_CS312" target="_blank" class="project-link">github.com/narcisoJavier/Campus-Navigator</a>
          </div>
        </div>
        <div class="tech-stack"><strong>Technologies:</strong> Go, Node.js, PHP, Docker Compose, MySQL, Graph Algorithms, RESTful APIs</div>
        <ul class="bullet-list">
          <li>Architected a containerized microservices platform consisting of a Go routing engine, Node.js API gateway, PHP management service, and MySQL database.</li>
          <li>Implemented Dijkstra's shortest-path algorithm in Go with custom heuristics for campus accessibility rules, wheelchair bypasses, and role permissions.</li>
          <li>Designed a thread-safe in-memory graph cache with read/write mutex synchronization to handle concurrent pathfinding queries with sub-millisecond latency.</li>
        </ul>
      </div>

      <!-- MultiTask ContextSwitch -->
      <div class="entry">
        <div class="entry-header">
          <div>
            <span class="entry-title">MultiTask ContextSwitch</span>
            <span class="entry-subtitle"> &ndash; Desktop Workflow &amp; Window Focus Automator</span>
          </div>
          <div class="entry-date">
            <a href="https://github.com/narcisoJavier/MultiTask_ContextSwitch" target="_blank" class="project-link">github.com/narcisoJavier/MultiTask_ContextSwitch</a>
          </div>
        </div>
        <div class="tech-stack"><strong>Technologies:</strong> Python, PyQt6, Windows Win32 APIs, QSystemTray, Desktop Automation Hooks</div>
        <ul class="bullet-list">
          <li>Developed a Windows desktop workflow automation tool that monitors real-time generation states in web-based AI tools via OS-level window handles.</li>
          <li>Implemented global keyboard hooks via Win32 APIs, instant target-window focus switching, system-tray minimization, and session cache cleanup.</li>
        </ul>
      </div>
    </section>

    <!-- ADDITIONAL TECHNICAL PROJECTS -->
    <section class="section">
      <h2 class="section-title">Additional Technical Projects</h2>
      
      <div class="entry">
        <div class="entry-header">
          <div>
            <span class="entry-title">Hand Sign Recognition CNN</span>
            <span class="entry-subtitle"> &ndash; Computer Vision Prototype</span>
          </div>
          <div class="entry-date">
            <a href="https://colab.research.google.com/drive/1JtmdmGKfQzO4xnSUnl4rRVXulx5v6TJG" target="_blank" class="project-link">Google Colab Notebook</a>
          </div>
        </div>
        <div class="tech-stack"><strong>Technologies:</strong> Python, OpenCV, CNN, NumPy, Google Colab</div>
        <ul class="bullet-list">
          <li>Built a convolutional neural network prototype performing real-time webcam frame preprocessing, feature extraction, and multi-class gesture classification.</li>
        </ul>
      </div>

      <div class="entry" style="margin-top: 5px;">
        <div class="entry-header">
          <div>
            <span class="entry-title">OpenCode DevContainer Setup</span>
            <span class="entry-subtitle"> &ndash; Reproducible Tooling &amp; Environment</span>
          </div>
          <div class="entry-date">
            <a href="https://github.com/narcisoJavier/OpenCode-VSCode-Setup" target="_blank" class="project-link">github.com/narcisoJavier/OpenCode-VSCode-Setup</a>
          </div>
        </div>
        <div class="tech-stack"><strong>Technologies:</strong> Docker, VS Code Remote Dev Containers, Linux/Bash, Security Hardening</div>
        <ul class="bullet-list">
          <li>Designed a reproducible development environment featuring containerized toolchains, non-root security isolation, and automated configuration.</li>
        </ul>
      </div>
    </section>
  </div>
</body>
</html>
`;

// Also generate LaTeX version
const latexContent = `%-------------------------
% Harvard Style Resume in LaTeX
% Author: Narciso III Javier
% License: MIT
%-------------------------

\\documentclass[letterpaper,10.5pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{charter}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.55in}
\\addtolength{\\evensidemargin}{-0.55in}
\\addtolength{\\textwidth}{1.1in}
\\addtolength{\\topmargin}{-0.55in}
\\addtolength{\\textheight}{1.1in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-3pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-4pt}]

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-1.5pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-6pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-6pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-3pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.15in]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-4pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape Narciso III Javier} \\\\ \\vspace{2pt}
    \\textit{\\small Computer Science Student \\,$\\cdot$\\, Systems, Backend \\& Software Engineering} \\\\ \\vspace{3pt}
    \\small Baguio City, Philippines $|$ +63 976 451 1638 $|$ \\href{mailto:renzoj156@gmail.com}{\\underline{renzoj156@gmail.com}} $|$ \\href{https://linkedin.com/in/narcisoiii-javier}{\\underline{linkedin.com/in/narcisoiii-javier}} $|$ \\href{https://github.com/narcisoJavier}{\\underline{github.com/narcisoJavier}} $|$ \\href{https://narcisojavier.vercel.app}{\\underline{narcisojavier.vercel.app}}
\\end{center}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {Saint Louis University}{Baguio City, Philippines}
      {Bachelor of Science in Computer Science}{Expected Graduation: June 2027}
      \\resumeItemListStart
        \\resumeItem{\\textbf{Credentials \\& Certifications:} Smart City Challenge -- Certified Participant (2024) \\,$\\cdot$\\, AI Development Track -- Specialization Certificate}
        \\resumeItem{\\textbf{Relevant Coursework:} Data Structures \\& Algorithms, Operating Systems, Database Management Systems, Computer Networks, Software Engineering}
      \\resumeItemListEnd
  \\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: Python, Go, C++, C\\#, Dart, JavaScript (ES6+), TypeScript, Node.js, PHP, SQL} \\\\
     \\textbf{Frameworks \\& Libs}{: Unity 3D, Flutter, React, Next.js, PyQt6, Leaflet.js, Vite, Tailwind CSS} \\\\
     \\textbf{Tools \\& Infrastructure}{: Docker, Docker Compose, Git, GitHub, Linux/Bash, VS Code Remote Dev Containers, Supabase, MySQL} \\\\
     \\textbf{Core Areas}{: Systems Programming, Network Protocols (SSH, SFTP), GIS Mapping, Microservices, Desktop Automation, RESTful APIs}
    }}
 \\end{itemize}

%-----------SELECTED PROJECTS-----------
\\section{Selected Technical Projects}
    \\resumeSubHeadingListStart
      \\resumeProjectHeading
          {\\textbf{Tether} $|$ \\emph{Flutter, Dart, SSH/SFTP, VT100, Tailscale, Android Keystore}}{\\href{https://github.com/narcisoJavier/Tether}{\\underline{github.com/narcisoJavier/Tether}}}
          \\resumeItemListStart
            \\resumeItem{Architected an Android-first systems client combining a native Dart SSH/SFTP engine, VT100/xterm terminal emulation, and direct port forwarding.}
            \\resumeItem{Integrated embedded Tailscale mesh networking to establish authenticated zero-config P2P connections to remote servers without public port forwarding.}
            \\resumeItem{Implemented hardware-backed cryptographic storage via Android Keystore to securely safeguard private keys, passwords, and session credentials.}
          \\resumeItemListEnd

      \\resumeProjectHeading
          {\\textbf{geoCradle} $|$ \\emph{React, Vite, Leaflet.js, GeoJSON, PMTiles, Supabase, OCR}}{\\href{https://github.com/narcisoJavier/geoCradle}{\\underline{github.com/narcisoJavier/geoCradle}}}
          \\resumeItemListStart
            \\resumeItem{Developed an interactive geospatial web application visualizing 13 major river basins and administrative boundaries across the Cordillera region.}
            \\resumeItem{Engineered client-side vector-tile rendering using PMTiles and GeoJSON for 60 FPS drill-down navigation and high-density topographical layer toggling.}
            \\resumeItem{Integrated a Supabase backend with an automated OCR extraction pipeline to ingest and catalog administrative boundary survey metadata.}
          \\resumeItemListEnd

      \\resumeProjectHeading
          {\\textbf{Campus Navigator CS312} $|$ \\emph{Go, Node.js, PHP, Docker Compose, MySQL, REST APIs}}{\\href{https://github.com/narcisoJavier/WebDev_Campus-Navigator_CS312}{\\underline{github.com/narcisoJavier/Campus-Navigator}}}
          \\resumeItemListStart
            \\resumeItem{Architected a containerized microservices platform consisting of a Go routing engine, Node.js API gateway, PHP management service, and MySQL database.}
            \\resumeItem{Implemented Dijkstra's shortest-path algorithm in Go with custom heuristics for campus accessibility rules, wheelchair bypasses, and role permissions.}
            \\resumeItem{Designed a thread-safe in-memory graph cache with read/write mutex synchronization to handle concurrent pathfinding queries with sub-millisecond latency.}
          \\resumeItemListEnd

      \\resumeProjectHeading
          {\\textbf{MultiTask ContextSwitch} $|$ \\emph{Python, PyQt6, Win32 APIs, QSystemTray, Automation}}{\\href{https://github.com/narcisoJavier/MultiTask_ContextSwitch}{\\underline{github.com/narcisoJavier/MultiTask\\_ContextSwitch}}}
          \\resumeItemListStart
            \\resumeItem{Developed a Windows desktop workflow automation tool that monitors real-time generation states in web-based AI tools via OS-level window handles.}
            \\resumeItem{Implemented global keyboard hooks via Win32 APIs, instant target-window focus switching, system-tray minimization, and session cache cleanup.}
          \\resumeItemListEnd
    \\resumeSubHeadingListEnd

%-----------ADDITIONAL PROJECTS-----------
\\section{Additional Technical Projects}
    \\resumeSubHeadingListStart
      \\resumeProjectHeading
          {\\textbf{Hand Sign Recognition CNN} $|$ \\emph{Python, OpenCV, CNN, NumPy, Google Colab}}{\\href{https://colab.research.google.com/drive/1JtmdmGKfQzO4xnSUnl4rRVXulx5v6TJG}{\\underline{Colab Notebook}}}
          \\resumeItemListStart
            \\resumeItem{Built a convolutional neural network prototype performing real-time webcam frame preprocessing, feature extraction, and multi-class gesture classification.}
          \\resumeItemListEnd

      \\resumeProjectHeading
          {\\textbf{OpenCode DevContainer Setup} $|$ \\emph{Docker, VS Code Dev Containers, Linux/Bash}}{\\href{https://github.com/narcisoJavier/OpenCode-VSCode-Setup}{\\underline{github.com/narcisoJavier/OpenCode-VSCode-Setup}}}
          \\resumeItemListStart
            \\resumeItem{Designed a reproducible development environment featuring containerized toolchains, non-root security isolation, and automated configuration.}
          \\resumeItemListEnd
    \\resumeSubHeadingListEnd

\\end{document}
`;

function main() {
  const publicDir = path.join(projectRoot, 'public');
  const htmlPath = path.join(publicDir, 'resume.html');
  const pdfPath = path.join(publicDir, 'resume.pdf');
  const texPath = path.join(publicDir, 'resume.tex');
  const previewImgPath = path.join(publicDir, 'resume-preview.png');

  console.log('Writing resume.html...');
  fs.writeFileSync(htmlPath, htmlContent, 'utf-8');

  console.log('Writing resume.tex...');
  fs.writeFileSync(texPath, latexContent, 'utf-8');

  const edgePaths = [
    'C:\\Program Files (x86)\\Microsoft\\EdgeCore\\151.0.4129.107\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  ];

  const browserPath = edgePaths.find(p => fs.existsSync(p));
  if (!browserPath) {
    console.warn('No headless browser found to compile PDF directly.');
    return;
  }

  console.log('Compiling resume.pdf via headless browser:', browserPath);
  const fileUrl = 'file:///' + htmlPath.replace(/\\\\/g, '/');
  const userDataDir = path.join(os.tmpdir(), 'edge-resume-build-' + Date.now());

  try {
    execFileSync(browserPath, [
      '--headless',
      '--disable-gpu',
      '--no-pdf-header-footer',
      '--user-data-dir=' + userDataDir,
      '--print-to-pdf=' + pdfPath,
      fileUrl
    ]);
    console.log('Successfully compiled PDF! File size:', fs.statSync(pdfPath).size, 'bytes');

    console.log('Generating high-res PNG preview...');
    execFileSync(browserPath, [
      '--headless',
      '--disable-gpu',
      '--window-size=850,1150',
      '--user-data-dir=' + userDataDir,
      '--screenshot=' + previewImgPath,
      fileUrl
    ]);
    console.log('Successfully generated preview PNG! File size:', fs.statSync(previewImgPath).size, 'bytes');
  } catch (err) {
    console.error('Error generating PDF / preview:', err.message);
  } finally {
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch {}
  }
}

main();
