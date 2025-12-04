# Technology Stack

## Core Technologies
- **HTML5 Canvas** - Primary rendering engine for game graphics
- **Vanilla JavaScript (ES6+)** - Game logic and mechanics
- **CSS3** - UI styling and overlays

## Architecture
- Single-page application with no build system required
- Client-side only (no backend/server)
- Direct file references (no bundler or module system)

## Key Libraries & APIs
- Canvas 2D Context API for rendering
- RequestAnimationFrame for game loop
- Keyboard event listeners for input handling
- Image API for sprite loading

## File Structure
- `index.html` - Main HTML structure and game container
- `game.js` - All game logic, physics, rendering, and state management
- `style.css` - Styling for HUD, overlays, and game container
- `kiro-logo.png` - Player sprite image

## Running the Game
No build or compilation required. Simply:
1. Open `index.html` in a modern web browser
2. Or use a local development server:
   ```bash
   python -m http.server 8000
   # or
   npx serve
   ```
3. Navigate to the served URL

## Browser Compatibility
Requires a modern browser with HTML5 Canvas support (Chrome, Firefox, Safari, Edge).
