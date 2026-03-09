# Cihan Işık — Personal Portfolio

A personal portfolio website built with **React** and **Three.js**, featuring an immersive 3D background, cinematic section transitions, and a custom cursor. Inspired by the aesthetic of [Active Theory](https://activetheory.net/).

---

## ✨ Features

- **Live 3D Scene** — WebGL environment with particle fields, wireframe geometry, orbital rings, a perspective grid floor, and neon architectural elements powered by Three.js
- **Cinematic Navigation** — Scroll, arrow keys, or touch to move between sections; the 3D camera flies to a new position for each one
- **Mouse Parallax** — The entire 3D scene reacts to cursor movement in real time
- **Custom Cursor** — Neon dot with a lagging ring that reacts on hover
- **Animated Skill Bars** — Triggered the first time the About section becomes active
- **Draggable Project Carousel** — Click-and-drag or arrow buttons to browse projects
- **Loading Screen** — Animated percentage counter, fully independent of the 3D scene
- **CRT Scanline Overlay** — Subtle retro texture across the entire page
- **Responsive** — Adapts layout for mobile and tablet screens

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI & component architecture |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [Three.js](https://threejs.org/) | 3D WebGL scene |
| CSS (vanilla) | All styling via `index.css` |

---

## 📁 Project Structure

```
src/
├── assets/
│   └── photo.jpeg            # Profile photo
├── components/
│   ├── ThreeScene.jsx        # Three.js canvas & animation loop
│   ├── Loader.jsx            # Loading screen
│   ├── Cursor.jsx            # Custom cursor
│   ├── Navbar.jsx            # Pill navigation bar
│   ├── SideDots.jsx          # Side section indicators
│   ├── HeroSection.jsx       # Section 0 — Hero
│   ├── AboutSection.jsx      # Section 1 — About & skills
│   ├── WorkSection.jsx       # Section 2 — Project carousel
│   ├── ContactSection.jsx    # Section 3 — Contact
│   └── ScrollHint.jsx        # Animated scroll indicator
├── App.jsx                   # Root component — owns state & navigation
├── main.jsx                  # Entry point
└── index.css                 # All global styles
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/cihan1200/personal-website.git

# 2. Navigate into the project
cd personal-website

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The site will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready to deploy.

---

## 🌐 Deployment

This project can be deployed to any static hosting platform.

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo directly at [vercel.com](https://vercel.com) for automatic deployments on every push.

### Netlify

```bash
npm run build
# Then drag and drop the dist/ folder at netlify.com/drop
```

---

## ✏️ Customization

All personal content is easy to find and update:

| What | Where |
|---|---|
| Name, title, bio | `AboutSection.jsx` |
| Skill names & percentages | `SKILLS` array in `AboutSection.jsx` |
| Stats (age, experience) | `STATS` array in `AboutSection.jsx` |
| Projects | `PROJECTS` array in `WorkSection.jsx` |
| Email & social links | `ContactSection.jsx` |
| Profile photo | Replace `src/assets/photo.jpeg` |
| Hero text | `HeroSection.jsx` |
| Site colors | CSS variables in `index.css` (`:root`) |

---

## 📬 Contact

**Cihan Işık**
- Email: [cihan1200@outlook.com](mailto:cihan1200@outlook.com)
- GitHub: [@cihan1200](https://github.com/cihan1200)
- LinkedIn: [cihan-isik-1490b33a7](https://linkedin.com/in/cihan-isik-1490b33a7)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).