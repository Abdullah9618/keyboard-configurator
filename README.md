# AuraGear - Premium 3D Product Showcase

A high-end 3D product showcase website built with React, React Three Fiber, Drei, and Framer Motion.

![AuraGear Preview](https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800)

## 🚀 Features

- **Interactive 3D Keyboard Model** - Loaded via useGLTF from Supabase
- **Exploding View Animation** - Scroll-triggered keycap explosion using GSAP
- **Dynamic Switch Colors** - Red/Blue/Brown switches with emissive material updates
- **Auto-Rotate & OrbitControls** - Full 3D exploration with zoom limits
- **Specs Overlay** - Smooth blur effect modal with product details
- **Real-time Pricing** - Mock API integration for stock & price
- **Responsive Design** - Works on desktop and mobile

## 📦 Tech Stack

- **React 18** - UI Framework
- **React Three Fiber** - React renderer for Three.js
- **Drei** - Useful helpers for R3F
- **Framer Motion** - Animations
- **GSAP** - Advanced animations
- **Zustand** - State management
- **Express** - Mock backend API
- **Vite** - Build tool

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install server dependencies:**
   ```bash
   cd server && npm install && cd ..
   ```

3. **Start the development server:**
   ```bash
   # Terminal 1: Start the mock API server
   npm run server

   # Terminal 2: Start the Vite dev server
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
auragear-showcase/
├── index.html
├── package.json
├── vite.config.js
├── server/
│   ├── package.json
│   └── index.js              # Express API server
└── src/
    ├── main.jsx              # App entry point
    ├── App.jsx               # Main app component
    ├── components/
    │   ├── Experience.jsx    # 3D scene setup
    │   ├── Keyboard.jsx      # 3D keyboard model
    │   ├── Sidebar.jsx       # Control panel
    │   ├── Header.jsx        # Navigation header
    │   ├── Loader.jsx        # Loading screen
    │   └── SpecsOverlay.jsx  # Product specs modal
    ├── hooks/
    │   ├── usePriceCalculator.js  # Price/stock hook
    │   └── useScrollExplode.js    # Scroll animation hook
    ├── store/
    │   └── useStore.js       # Zustand state store
    └── styles/
        └── index.css         # Global styles
```

## 🎮 Controls

- **Orbit** - Click and drag to rotate the view
- **Zoom** - Scroll wheel (limited range)
- **Switch Colors** - Click Red/Blue/Brown in sidebar
- **Explode View** - Use the slider in sidebar
- **Auto Rotate** - Toggle in sidebar
- **View Specs** - Click "Specs" button in header

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/product?switch=red` | GET | Get price & stock for switch type |
| `/api/product/specs` | GET | Get full product specifications |
| `/api/cart/add` | POST | Add item to cart |
| `/api/health` | GET | Health check |

## 🎨 Customization

### Adding New Switch Types

Edit the `SWITCH_COLORS` object in `Keyboard.jsx`:

```javascript
const SWITCH_COLORS = {
  red: { emissive: new THREE.Color('#ff4757'), ... },
  blue: { emissive: new THREE.Color('#3742fa'), ... },
  // Add new switch type:
  green: { emissive: new THREE.Color('#2ed573'), emissiveIntensity: 0.7, ... }
}
```

### Changing the 3D Model

Update the `MODEL_URL` in `Keyboard.jsx`:

```javascript
const MODEL_URL = 'your-model-url.gltf'
```

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

## 🔧 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run API server
npm run server
```

## 📄 License

MIT License - Feel free to use for personal and commercial projects.

---

Built with ❤️ by AuraGear Team
