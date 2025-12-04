# Project Structure

## Root Directory
```
/
├── .kiro/              # Kiro AI assistant configuration
│   └── steering/       # AI guidance documents
├── .vscode/            # VS Code workspace settings
├── index.html          # Main HTML entry point
├── game.js             # Complete game implementation
├── style.css           # All styling and UI
└── kiro-logo.png       # Player sprite asset
```

## Code Organization

### game.js Structure
The game logic is organized in a single file with clear sections:

1. **Canvas Setup** - Canvas initialization and sizing
2. **Game State** - Global game state object (score, lives, camera)
3. **Player Object** - Player properties, physics constants, sprite
4. **Level Data** - Platform positions, collectibles, goal location
5. **Input Handling** - Keyboard event listeners
6. **Update Functions** - Player movement, physics, collision detection
7. **Collision System** - Horizontal and vertical collision checks
8. **Camera System** - Side-scrolling camera following player
9. **Game Logic** - Collectible pickup, goal checking, life management
10. **Rendering Functions** - Draw player, platforms, collectibles, background
11. **UI Functions** - Score/lives updates, game over, level complete
12. **Game Loop** - Main update/render loop using requestAnimationFrame

### index.html Structure
- Game container with HUD (score and lives display)
- Canvas element for game rendering
- Overlay divs for game over and level complete screens
- Script tag loading game.js

### style.css Structure
- Global resets and body styling
- Game container and canvas styling with Kiro purple branding
- HUD styling at top of game
- Overlay screens (game over, level complete)
- Button styling with hover effects

## Conventions
- All game logic in a single `game.js` file (no modules)
- Global objects for game state, player, and level data
- Function names use camelCase
- Constants defined at top of file
- Kiro brand colors (#790ECB purple) used throughout UI
