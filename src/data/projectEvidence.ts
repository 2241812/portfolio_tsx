export interface ProjectEvidence {
  sourceUrl: string;
  sourceKind: 'GitHub repository' | 'Google Colab notebook';
  technologyTags: string[];
  verifiedClaims: string[];
  limitations?: string[];
  lastReviewed: string;
}

/** Human-reviewed claims grounded in the public project sources. */
export const projectEvidence: Record<string, ProjectEvidence> = {
  tether: {
    sourceUrl: 'https://github.com/narcisoJavier/Tether',
    sourceKind: 'GitHub repository',
    technologyTags: ['Flutter', 'Dart', 'SSH', 'SFTP', 'Tailscale', 'Android'],
    verifiedClaims: [
      'Android-first Flutter app for SSH and mesh-terminal workflows',
      'Includes a Dart SSH client, VT100 terminal, SFTP, port forwarding, and embedded Tailscale networking',
      'Uses Android Keystore-backed secure storage for private keys and passwords',
      'Repository includes tests and documented Dart analysis/build commands',
    ],
    limitations: ['The repository states that iOS is not supported yet.', 'There is no CI/CD pipeline; release builds are manual.'],
    lastReviewed: '2026-08-28',
  },
  geocradle: {
    sourceUrl: 'https://github.com/narcisoJavier/geoCradle',
    sourceKind: 'GitHub repository',
    technologyTags: ['React', 'Vite', 'Leaflet', 'GeoJSON', 'PMTiles', 'Supabase'],
    verifiedClaims: [
      'React and Vite single-page web mapping application for the Cordillera Administrative Region',
      'Explores 13 major watersheds and administrative boundaries',
      'Uses Leaflet, GeoJSON/vector tiles, PMTiles, Chart.js, and Supabase-backed data',
      'Includes watershed/boundary drill-down, data panels, and an OCR extraction pipeline',
    ],
    lastReviewed: '2026-08-28',
  },
  'campus-nav': {
    sourceUrl: 'https://github.com/narcisoJavier/WebDev_Campus-Navigator_CS312',
    sourceKind: 'GitHub repository',
    technologyTags: ['Go', 'Node.js', 'PHP', 'Docker Compose', 'MySQL'],
    verifiedClaims: [
      'Containerized campus navigation system organized as Go, Node.js, and PHP services',
      'Uses Docker Compose and a database initialization layer',
      'The Go service implements Dijkstra shortest-path routing with role-based access and accessibility rules',
      'The Go service protects shared graph state with a read/write mutex for concurrent path requests',
    ],
    limitations: ['The repository README labels the coursework as a CS313 project while the repository name includes CS312.'],
    lastReviewed: '2026-08-28',
  },
  'multitask-contextswitch': {
    sourceUrl: 'https://github.com/narcisoJavier/MultiTask_ContextSwitch',
    sourceKind: 'GitHub repository',
    technologyTags: ['Python', 'PyQt6', 'Windows APIs', 'Global Hotkeys'],
    verifiedClaims: [
      'Python desktop application using PyQt6 and Windows APIs for workflow automation',
      'Monitors generation state in Gemini, ChatGPT, and DeepSeek browser apps',
      'Can switch target windows, use global hotkeys, and run from the system tray',
      'Includes a privacy-focused option to clear cached browser data and cookies',
    ],
    limitations: ['The repository currently labels the project as in development.'],
    lastReviewed: '2026-08-28',
  },
  'hand-sign-recognition': {
    sourceUrl: 'https://colab.research.google.com/drive/1JtmdmGKfQzO4xnSUnl4rRVXulx5v6TJG?usp=sharing',
    sourceKind: 'Google Colab notebook',
    technologyTags: ['Python', 'CNN', 'OpenCV', 'Google Colab'],
    verifiedClaims: [
      'Python computer-vision prototype using a convolutional neural network for basic hand-gesture classification',
      'Uses webcam-frame preprocessing and an interactive Colab experimentation workflow',
    ],
    limitations: ['The project source is a Colab notebook rather than a public GitHub repository.', 'The source does not establish TensorFlow or PyTorch usage.'],
    lastReviewed: '2026-08-28',
  },
  'opencode-setup': {
    sourceUrl: 'https://github.com/narcisoJavier/OpenCode-VSCode-Setup',
    sourceKind: 'GitHub repository',
    technologyTags: ['Docker', 'VS Code Dev Containers', 'Linux'],
    verifiedClaims: [
      'Docker and VS Code Dev Containers setup for running OpenCode in an isolated terminal environment',
      'Includes a Dockerfile, docker-compose configuration, Dev Container configuration, and setup documentation',
      'The guide documents a non-root devuser and configurable OpenCode environment setup',
    ],
    limitations: ['This is a development-environment setup guide, not evidence of a standalone OpenCode framework or skill.'],
    lastReviewed: '2026-08-28',
  },
};

export function getProjectEvidence(projectId: string): ProjectEvidence | undefined {
  return projectEvidence[projectId];
}
