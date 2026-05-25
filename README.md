# 🚀 Financial Power Symbol // Trader Terminal

Welcome to the official repository of **Financial Power Symbol (FPS)**, an elite, high-performance, and visually stunning trading terminal designed for the modern Indian stock market. 

This platform blends cutting-edge visual experiences—like scroll-driven canvas rendering and glassmorphic dashboards—with a dynamic, real-time ticking commodities and indices engine localized to Indian Rupee (₹) standards.

---

## 🎨 Design & Aesthetic System
The portal has been meticulously styled to look and feel like an elite institutional trading terminal. Here is how the design system is engineered:

1. **Visual Theme**: A deep, futuristic dark mode theme built upon a pure black background (`#0e0e0e`) and premium surface card layouts.
2. **Neon Accents**: High-contrast indicator colors to direct visual attention:
   - **Primary Fixed Dim (Neon Green)**: `#2ae500` – representing bullish surges, green ticks, and active states.
   - **Accent Cyan**: `#00e5ff` – representing system telemetry, gauges, and loader progress.
   - **Accent Purple**: `#8a2be2` – representing algorithmic calculations and AI picks.
   - **Error Red**: `#ffb4ab` – representing bearish drops and triggered stop-losses.
3. **Glassmorphism**: Cards use a premium translucent backing (`rgba(255, 255, 255, 0.03)`) with a powerful back-blur filter (`backdrop-filter: blur(20px)`) and a subtle milled edge overlay to give a high-tech holographic appearance.
4. **Micro-Animations & Glows**: Active UI elements pulse dynamically. Price ticks trigger instant micro-glows (green for upticks, red for downticks), andsentiment meters animate smoothly on load.

---

## ⚙️ Core Technical Systems

### 1. Scroll-Driven 2D Canvas Engine
Instead of utilizing standard video files or heavy scroll animations, this website implements a raw HTML5 2D Canvas preloader and frame-interpolation render loop:
- **Preloader**: Preloads **240 high-definition frames** (`assets/frames/ezgif-frame-001.jpg` to `0240.jpg`) directly into memory on launch, locking scrolling until loading is complete to ensure lag-free scrolling.
- **LERP Engine (Linear Interpolation)**: Listens to scroll coordinates and calculates smooth frame transitions:
  $$\text{Current Frame} = \text{Current Frame} + (\text{Target Frame} - \text{Current Frame}) \times 0.08$$
  This produces a cinematic zoom and pan effect that flows seamlessly backwards and forwards with the scrollbar.
- **Cover Scale Engine**: Automatically maps and crops images to perfectly cover the user's viewport on resize without distortion.

### 2. Stochastic Real-Time Tick Engine
Prices are driven by an active client-side stochastics system in JavaScript, generating tick updates every **1.5 seconds** based on a Geometric Brownian Random Walk:
- Simulates realistic market noise, spread fluctuations, and volume pressure.
- Recalculates absolute change and percent change dynamically.
- Triggers DOM events to toggle trend colors and up/down trend symbols (`trending_up`/`trending_down`).
- Features a **Twelve Data REST API slot** that allows developers to toggle from simulated ticks to live global feeds.

---

## 📁 A to Z File Architecture

Every file in the repository plays a specific role in the terminal's architecture:

### 1. 🌐 [index.html](file:///d:/MY%20STOCK%20MARKET%20WEBSITE%20MODEL/index.html)
The central structure of the website. It utilizes Tailwind CSS and semantic HTML5 tags:
- **Preloader Overlay**: Displays a sleek loading screen while the 240 canvas frames load.
- **Background Canvas**: The absolute-positioned canvas tag displaying the scroll transitions.
- **Scroll Track Tracker**: Creates a simulated `150vh` scrolling track that controls the intro cinematic.
- **Fixed Navigation Header**: Handles global branding, tab targeting, and authentication options. Shows the customized Indian stock market date `26-05-2026`.
- **Slide-in Navigation Sidebar**: Appears dynamically once the user scrolls past the intro, housing quick tabs (Dashboard, AI Predict, Derivatives/F&O).
- **Core Dashboard Stage**:
  - **Live Market Index Row**: Houses real-time cards for **Nifty 50**, **Sensex**, and **Bank Nifty**.
  - **Commodities & Bullion Grid**: Houses premium gold and silver spot cards, localized in Rupees (`₹`) to match MCX trading structures (Gold per 10g, Silver per 1kg).
  - **Trending Stocks Table**: Displays NSE listing information with AI signal tags.
  - **Watchlist, AI Precision, and Derivatives Panels**: Showcases F&O strikes (expiry set to **28 MAY 2026**), OI concentration heatmaps, and portfolio metrics.

### 2. ⚡ [app.js](file:///d:/MY%20STOCK%20MARKET%20WEBSITE%20MODEL/app.js)
The brain of the platform. It manages all core interactions:
- **Image Preloader**: Asynchronously fetches and parses the frame images, feeding percentages to the HTML loading screen.
- **Smooth Render Loop**: Runs on `requestAnimationFrame` to interpolate canvas frames and apply scrolling opacity fade thresholds to title screens.
- **Sidebar Displacer**: Detects scroll depth past `100vh` and triggers the body class to slide out the trading navigation panel.
- **Tab Panel Router**: Listens to clicks on navigation elements, updates active links, slides panels smoothly, and auto-scrolls down past the hero track.
- **AI Dial Gauge**: Drives SVG circle dashoffsets to animate the market sentiment percentage meter.
- **Tick Engine**: Maps standard price parameters to DOM structures and runs the stochastics prices ticker and flash triggers.
- **Twelve Data Feed**: Includes a configured integration slot to map real price payloads directly into the baseline assets.

### 3. 💅 [style.css](file:///d:/MY%20STOCK%20MARKET%20WEBSITE%20MODEL/style.css)
Handles customized design overrides and premium layout animations:
- **Global Typography**: Sets the custom 'Geist' geometric typeface.
- **Custom Scrollbar Styling**: Style overrides for custom scroll tracks.
- **Preloader Animations**: Manages the loader's fading transitions and absolute centered alignment.
- **Dashboard Displacements**: Offsets main workspace containers to shift smoothly when the slide-out navigation bar is visible.
- **Dynamic Pulse Animations**: Powers neon glows, pulsing sentiment indicators, and canvas preloading bars.

### 4. ☁️ [vercel.json](file:///d:/MY%20STOCK%20MARKET%20WEBSITE%20MODEL/vercel.json)
Configures hosting settings on Vercel:
- Forces clean URL outputs (strips `.html` endings).
- Employs routing rewrites to point subfolders or wildcard paths directly to `index.html`, making it a robust Single Page Application.

### 5. 🛠️ [push_to_github.bat](file:///d:/MY%20STOCK%20MARKET%20WEBSITE%20MODEL/push_to_github.bat)
A custom automation script written in Batch syntax to expedite developers' workflow:
- Scans system environment paths to verify Git is installed.
- Checks for local git records, initializing the repository if missing.
- Sets the remote origin to `https://github.com/Ashishverma3012/FINANCIAL-POWER-SYMBOL-STOCK-MARKET-WEBSITE-.git`.
- Automatically stages (`git add .`), commits with preloaded summaries, and pushes code to the `main` branch to trigger the live Vercel continuous deployment.

---

## 📈 Local Development & Deploying
1. Clone the repository to your system:
   ```bash
   git clone https://github.com/Ashishverma3012/FINANCIAL-POWER-SYMBOL-STOCK-MARKET-WEBSITE-.git
   ```
2. Simply double click `index.html` to run locally or use an extension like **Live Server** to preview.
3. Once edits are made, double-click **`push_to_github.bat`** to automatically stage, commit, and deploy changes to GitHub and Vercel.
