# Super Kiro World 🎮

A browser-based 2D platformer game featuring side-scrolling gameplay, particle effects, and progressive difficulty. Built with vanilla JavaScript and HTML5 Canvas.

![Game Preview](kiro-logo.png)

## 🎯 Features

- **Side-scrolling platformer** with smooth physics-based movement
- **Two challenging levels** with increasing difficulty
- **Particle system** with trail effects, explosions, sparkles, and confetti
- **Score persistence** using localStorage to track high scores
- **Lives system** with respawning mechanics
- **Collectibles** - Gather crowns for points (5 points each)
- **Progressive difficulty** - Wider gaps and more challenging jumps in level 2

## 🎮 How to Play

### Controls
- **Arrow Keys** or **WASD** - Move left/right and jump
- **Space Bar** - Jump

### Objective
- Collect all the purple crowns scattered across the level
- Navigate platforms and avoid falling off the world
- Reach the golden flag at the end to complete the level
- Beat your high score!

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No build tools or dependencies required!

### Running the Game

**Option 1: Direct File Access**
Simply open `index.html` in your web browser.

**Option 2: Local Development Server**
```bash
# Using Python
python -m http.server 8000

# Or using npx
npx serve
```

Then navigate to `http://localhost:8000` in your browser.

## 🛠️ Technology Stack

- **HTML5 Canvas** - Rendering engine
- **Vanilla JavaScript (ES6+)** - Game logic and mechanics
- **CSS3** - UI styling and overlays
- **localStorage API** - Score persistence

## 🎨 Game Mechanics

### Physics
- Gravity-based jumping with realistic acceleration
- Friction for smooth horizontal movement
- Collision detection for platforms and collectibles

### Particle Effects
- **Trail particles** - Follow the player during movement
- **Explosion particles** - Trigger on collisions with platforms
- **Sparkle particles** - Appear when collecting crowns
- **Confetti particles** - Celebrate new high scores

### Scoring
- Each crown collected: **5 points**
- High scores are saved automatically
- Confetti celebration when you beat your high score!

## 📁 Project Structure

```
/
├── index.html          # Main HTML entry point
├── game.js             # Complete game implementation
├── style.css           # All styling and UI
├── kiro-logo.png       # Player sprite asset
└── README.md           # This file
```

## 🎯 Level Design

### Level 1
- Introduction to mechanics
- Moderate platform gaps
- 10 collectible crowns
- Level width: 3000px

### Level 2
- Increased difficulty
- Wider gaps requiring precise jumps
- More vertical challenges
- 17 collectible crowns
- Level width: 3500px

## 🎨 Visual Style

The game features a dark theme with Kiro's signature purple (#790ECB) as the primary accent color, creating a modern and polished aesthetic.

## 🏆 Credits

Built for the AWS Re:Invent workshop as a demonstration of game development with AI assistance.

## 📝 License

This project is open source and available for educational purposes.

---

**Enjoy playing Super Kiro World!** 🎮✨
