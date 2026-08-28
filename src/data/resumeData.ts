export const credentials = [
  { icon: 'academic', title: 'B.S. Computer Science', description: 'Saint Louis University | Class of 2027' },
  { icon: 'award', title: 'Smart City Challenge', description: 'Certified Participant - 2024' },
  { icon: 'certificate', title: 'AI Development Track', description: 'Specialization Certificate' },
];

export const resumeData = {
  personalInfo: {
    name: "Narciso III Javier",
    title: "Computer Science Student",
    titleAnimated: ["Aspiring Systems & Go Developer", "Aspiring Game Developer (Unity)", "Software Engineering Student"],
    location: "Baguio City, Philippines",
    phone: "+63-976-451-1638",
    email: "renzoj156@gmail.com",
    linkedin: "https://www.linkedin.com/in/narcisoiii-javier/",
    github: "https://github.com/narcisoJavier"
  },
  education: {
    university: "Saint Louis University",
    degree: "Bachelor of Science in Computer Science",
    gpa: "3.53",
    classOf: "2027"
  },
  skills: {
    programming: [
      "Python",
      "Go",
      "C++",
      "C#",
      "Dart",
      "JavaScript (ES6+)",
      "Node.js",
      "PHP"
    ],
    frameworks: [
      "Unity 3D",
      "Flutter",
      "PyQt6",
      "Leaflet.js",
      "Next.js"
    ],
    infrastructure: [
      "Docker",
      "Docker Compose",
      "VSCode Remote Containers",
      "Git & GitHub",
      "Linux / Bash"
    ],
    coreCompetencies: [
      "Systems Programming",
      "Game Mechanics & Physics",
      "Containerization & Microservices",
      "Desktop Automation",
      "Geospatial Mapping (GIS)",
      "REST APIs & Algorithms"
    ]
  },
  skillDescriptions: {
    "Python": "Used for workflow automation scripts, computer vision prototyping, and backend tooling.",
    "Go": "Statically typed systems language used for building concurrent microservices and shortest-path routing algorithms.",
    "C++": "Used in computer science coursework and exploring low-level algorithms and data structures.",
    "C#": "Primary language for Unity 3D gameplay scripting, physics loops, and player movement systems.",
    "Dart": "Used alongside Flutter to build mobile applications with SSH socket connectivity.",
    "JavaScript (ES6+)": "Modern client-side web development and interactive geospatial mapping with Leaflet.",
    "Node.js": "JavaScript runtime for lightweight API gateways and backend services.",
    "PHP": "Server-side scripting used in full-stack web applications and microservices integrations.",
    "Unity 3D": "Game engine used for prototyping 3D character physics, combat mechanics, and level ergonomics.",
    "Flutter": "Cross-platform mobile UI toolkit used to build the Tether server management client.",
    "PyQt6": "Python GUI toolkit used for desktop tools that manage window focus and process monitoring.",
    "Leaflet.js": "Lightweight open-source JavaScript library for interactive web maps and GeoJSON rendering.",
    "Docker": "Container platform used to isolate development environments and package microservices.",
    "Docker Compose": "Orchestration tool for multi-container microservices on local development networks.",
    "VSCode Remote Containers": "Extension used to develop inside isolated, reproducible Docker containers.",
    "Git & GitHub": "Version control and open-source project collaboration.",
    "Systems Programming": "Designing efficient, clean software that communicates reliably with OS and network layers.",
    "Game Mechanics & Physics": "Building responsive player movement, collision detection, and weapon states in Unity.",
    "Containerization & Microservices": "Packaging independent service layers for consistent local and production deployment.",
    "Desktop Automation": "Writing background scripts that monitor system states and streamline developer workflows.",
    "Geospatial Mapping (GIS)": "Processing and displaying GeoJSON boundary maps and watershed topography.",
    "REST APIs & Algorithms": "Implementing algorithm-backed endpoints such as Dijkstra shortest-path calculations."
  },
  projects: [
    {
      id: "tether",
      title: "Tether",
      role: "Mobile Developer & Creator",
      description:
        "An Android-first Flutter app for SSH and mesh-terminal workflows, combining a Dart SSH client, VT100 terminal, SFTP, port forwarding, and embedded Tailscale networking.",
      link: "https://github.com/narcisoJavier/Tether"
    },
    {
      id: "geocradle",
      title: "geoCradle",
      role: "Full-Stack GIS Developer",
      description:
        "A React/Vite web mapping application for exploring 13 major watersheds and administrative boundaries across the Cordillera Administrative Region, built for DENR-oriented environmental analysis.",
      link: "https://github.com/narcisoJavier/geoCradle"
    },
    {
      id: "campus-nav",
      title: "Campus Navigator CS312",
      role: "Backend & Systems Developer",
      description:
        "A Docker Compose campus-navigation system organized as Go, Node.js, and PHP services. Its Go service implements Dijkstra shortest-path routing with role-based access and accessibility rules.",
      link: "https://github.com/narcisoJavier/WebDev_Campus-Navigator_CS312"
    },
    {
      id: "multitask-contextswitch",
      title: "MultiTask ContextSwitch",
      role: "Python Desktop Developer",
      description:
        "A Python/PyQt6 Windows workflow automator that monitors generation state in AI browser apps and manages target-window focus. The repository currently labels it in development.",
      link: "https://github.com/narcisoJavier/MultiTask_ContextSwitch"
    },
    {
      id: "hand-sign-recognition",
      title: "Hand Sign Recognition CNN",
      role: "Computer Vision Prototype",
      description:
        "A convolutional neural network (CNN) prototype built in Python on Google Colab that classifies basic hand gesture signs from webcam frames.",
      link: "https://colab.research.google.com/drive/1JtmdmGKfQzO4xnSUnl4rRVXulx5v6TJG?usp=sharing"
    },
    {
      id: "opencode-setup",
      title: "OpenCode DevContainer Setup",
      role: "Tooling & Environment Setup",
      description:
        "A Docker and VS Code Dev Containers setup guide for running OpenCode in an isolated terminal environment with documented reproducibility and security boundaries.",
      link: "https://github.com/narcisoJavier/OpenCode-VSCode-Setup"
    }
  ]
};
