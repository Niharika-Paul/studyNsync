# studyNsync

Allows users to find the perfect teammates for hackathons, class assignments, and personal initiatives; also offers a seamless file upload and sharing feature, making it simple to exchange important documents and resources.

## Table of contents
- [Demo](#demo)
- [Features](#features)
- [Built with](#built-with)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local setup](#local-setup)
- [Usage](#usage)
- [Project structure](#project-structure)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [Roadmap / Next steps](#roadmap--next-steps)
- [License](#license)
- [Contact](#contact)

## Demo
(Insert link to a living demo or screenshots here — you can add images to the repo and reference them.)

## Features
- Find teammates by skill, interests, availability, and project type
- Create and join teams for hackathons, classes, or personal projects
- File upload and sharing for project resources and deliverables
- Simple, responsive UI for quick team discovery and communication
- Lightweight, frontend-first implementation (no backend required for basic demo)

## Built with
- HTML (71.7%)
- CSS (21.2%)
- JavaScript (7.1%)

These percentages reflect the repository language composition.

## Getting started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- Optional: VS Code with the Live Server extension for faster development preview

### Local setup
1. Clone the repository
   ```bash
   git clone https://github.com/Niharika-Paul/studyNsync.git
   cd studyNsync
   ```
2. Open the project
   - Option A: Open `index.html` in your browser directly
   - Option B: Use Live Server (recommended)
     - Install Live Server extension in VS Code
     - Right-click `index.html` → "Open with Live Server"

No build step is required for the current frontend-first implementation.

## Usage
- Browse the landing page to understand available functionality.
- Use the "Find Teammates" section to filter and discover potential collaborators by skills and interests.
- Create a team using the "Create Team" flow and invite others by sharing a link or project identifier.
- Upload and share files through the "Files" or "Resources" section. Uploaded files are stored per-session in the demo; add a backend for persistent storage.

## Project structure
Example of top-level files and folders:
- index.html — main entry page
- assets/ — images, icons, and other static assets
- css/ — stylesheets
- js/ — JavaScript for interactivity
- README.md — project documentation

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to your branch: `git push origin feat/my-feature`
5. Open a pull request describing your changes

## Contributors
- Neha-Nair — [@Neha-Nair](https://github.com/nehanpnair)
- Niharika-Paul — [@Niharika-Paul](https://github.com/Niharika-Paul)
- Niharika-Saha — [@niharika-saha]([https://github.com/niharika-saha)

## Roadmap / Next steps
Planned or suggested improvements:
- Add a backend API for persistent teams and file storage (Node.js / Express, Django, or similar)
- Implement user authentication (OAuth / email)
- Real-time collaboration (WebSockets)
- Advanced search and recommendations for teammates (matchmaking algorithm)
- Tests and CI/CD (GitHub Actions)
