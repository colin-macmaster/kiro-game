// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Storage Manager - Score persistence with localStorage
const storage = {
    // In-memory fallback for when localStorage is unavailable
    inMemoryHighScore: 0,
    
    // Save current score to localStorage
    saveScore(score) {
        try {
            localStorage.setItem('kiro_high_score', score.toString());
        } catch (e) {
            console.warn('localStorage unavailable, using in-memory storage:', e);
        }
    },
    
    // Load high score from localStorage, return 0 if none exists
    loadHighScore() {
        try {
            const stored = localStorage.getItem('kiro_high_score');
            if (stored !== null) {
                const parsed = parseInt(stored, 10);
                return isNaN(parsed) ? 0 : parsed;
            }
            return 0;
        } catch (e) {
            console.warn('localStorage unavailable, using in-memory storage:', e);
            return this.inMemoryHighScore;
        }
    },
    
    // Update high score if current score exceeds it
    updateHighScore(score) {
        const currentHighScore = this.loadHighScore();
        if (score > currentHighScore) {
            this.saveScore(score);
            this.inMemoryHighScore = score;
            return true; // New high score achieved
        }
        return false; // No new high score
    },
    
    // Check if current score is a new high score
    checkNewHighScore(currentScore, highScore) {
        return currentScore > highScore;
    }
};

// Game state
const game = {
    score: 0,
    lives: 3,
    isRunning: true,
    camera: { x: 0, y: 0 },
    highScore: 0,
    currentLevel: 1,
    levelStartScore: 0  // Score at the beginning of the current level
};

// Player
const player = {
    x: 100,
    y: 100,
    width: 48,
    height: 48,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumpPower: 12,
    gravity: 0.5,
    friction: 0.8,
    isGrounded: false,
    wasGrounded: false, // Track previous grounded state
    hadHorizontalCollision: false, // Track horizontal collision state
    image: new Image()
};

player.image.src = 'kiro-logo.png';

// Level data structure
const levels = {
    1: {
        levelNumber: 1,
        levelWidth: 3000,
        startPosition: { x: 100, y: 100 },
        platforms: [
            // Ground platforms with jumpable gaps
            { x: 0, y: 550, width: 450, height: 50 },
            { x: 500, y: 550, width: 450, height: 50 },
            { x: 1000, y: 550, width: 450, height: 50 },
            { x: 1500, y: 550, width: 450, height: 50 },
            { x: 2000, y: 550, width: 1000, height: 50 },
            
            // Mid-level platforms
            { x: 300, y: 450, width: 150, height: 20 },
            { x: 650, y: 400, width: 150, height: 20 },
            { x: 1100, y: 350, width: 200, height: 20 },
            { x: 1600, y: 450, width: 150, height: 20 },
            { x: 2200, y: 350, width: 200, height: 20 },
            
            // High platforms
            { x: 750, y: 250, width: 120, height: 20 },
            { x: 1700, y: 200, width: 150, height: 20 }
        ],
        collectibles: [
            { x: 200, y: 500, collected: false },      // On ground platform (0, 550)
            { x: 375, y: 410, collected: false },      // Above mid-level platform (300, 450)
            { x: 725, y: 360, collected: false },      // Above mid-level platform (650, 400)
            { x: 810, y: 210, collected: false },      // Above high platform (750, 250)
            { x: 1200, y: 310, collected: false },     // Above mid-level platform (1100, 350)
            { x: 1675, y: 410, collected: false },     // Above mid-level platform (1600, 450)
            { x: 1775, y: 160, collected: false },     // Above high platform (1700, 200)
            { x: 2300, y: 310, collected: false },     // Above mid-level platform (2200, 350)
            { x: 2500, y: 500, collected: false },     // On ground platform (2000, 550)
            { x: 2800, y: 500, collected: false }      // On ground platform (2000, 550)
        ],
        goal: { x: 2800, y: 450, width: 60, height: 100 }
    },
    2: {
        levelNumber: 2,
        levelWidth: 3500,
        startPosition: { x: 100, y: 100 },
        platforms: [
            // Ground platforms with wider gaps (increased difficulty)
            { x: 0, y: 550, width: 350, height: 50 },
            { x: 450, y: 550, width: 300, height: 50 },
            { x: 850, y: 550, width: 250, height: 50 },
            { x: 1250, y: 550, width: 300, height: 50 },
            { x: 1700, y: 550, width: 250, height: 50 },
            { x: 2100, y: 550, width: 350, height: 50 },
            { x: 2600, y: 550, width: 900, height: 50 },
            
            // Mid-level platforms - more vertical challenge
            { x: 200, y: 450, width: 120, height: 20 },
            { x: 550, y: 400, width: 120, height: 20 },
            { x: 950, y: 350, width: 120, height: 20 },
            { x: 1350, y: 400, width: 120, height: 20 },
            { x: 1800, y: 450, width: 120, height: 20 },
            { x: 2200, y: 350, width: 150, height: 20 },
            { x: 2800, y: 400, width: 150, height: 20 },
            
            // High platforms - more challenging jumps
            { x: 400, y: 300, width: 100, height: 20 },
            { x: 700, y: 250, width: 100, height: 20 },
            { x: 1100, y: 200, width: 100, height: 20 },
            { x: 1500, y: 250, width: 100, height: 20 },
            { x: 2000, y: 200, width: 120, height: 20 },
            { x: 2950, y: 250, width: 120, height: 20 },
            
            // Very high platforms - expert challenge
            { x: 850, y: 150, width: 80, height: 20 },
            { x: 1650, y: 120, width: 80, height: 20 }
        ],
        collectibles: [
            { x: 150, y: 500, collected: false },      // On ground platform
            { x: 260, y: 410, collected: false },      // Above mid-level platform (200, 450)
            { x: 450, y: 260, collected: false },      // Above high platform (400, 300)
            { x: 610, y: 360, collected: false },      // Above mid-level platform (550, 400)
            { x: 760, y: 210, collected: false },      // Above high platform (700, 250)
            { x: 900, y: 110, collected: false },      // Above very high platform (850, 150)
            { x: 1010, y: 310, collected: false },     // Above mid-level platform (950, 350)
            { x: 1160, y: 160, collected: false },     // Above high platform (1100, 200)
            { x: 1410, y: 360, collected: false },     // Above mid-level platform (1350, 400)
            { x: 1560, y: 210, collected: false },     // Above high platform (1500, 250)
            { x: 1700, y: 80, collected: false },      // Above very high platform (1650, 120)
            { x: 1860, y: 410, collected: false },     // Above mid-level platform (1800, 450)
            { x: 2060, y: 160, collected: false },     // Above high platform (2000, 200)
            { x: 2275, y: 310, collected: false },     // Above mid-level platform (2200, 350)
            { x: 2875, y: 360, collected: false },     // Above mid-level platform (2800, 400)
            { x: 3010, y: 210, collected: false },     // Above high platform (2950, 250)
            { x: 3200, y: 500, collected: false }      // On ground platform (2600, 550)
        ],
        goal: { x: 3300, y: 450, width: 60, height: 100 }
    }
};

// Current level references (will be updated by loadLevel)
let levelWidth = levels[1].levelWidth;
let platforms = levels[1].platforms;
let collectibles = levels[1].collectibles;
let goal = levels[1].goal;

// Store original collectible positions for respawning
let originalCollectibles = collectibles.map(c => ({ x: c.x, y: c.y }));

// Particle System
const particleSystem = {
    particles: [],
    maxParticles: 500,
    
    // Add a new particle to the system
    addParticle(particle) {
        // Enforce maximum particle limit - remove oldest if at limit
        if (this.particles.length >= this.maxParticles) {
            this.particles.shift(); // Remove oldest particle
        }
        this.particles.push(particle);
    },
    
    // Update all particles - decay life, update positions, remove dead particles
    updateParticles() {
        // Update each particle
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Decay life
            p.life -= p.decay;
            
            // Update position based on velocity
            p.x += p.velocityX;
            p.y += p.velocityY;
            
            // Update rotation if particle has rotation
            if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
                p.rotation += p.rotationSpeed;
            }
        }
        
        // Remove dead particles (life <= 0) and confetti that fell below screen
        this.particles = this.particles.filter(p => {
            // Remove if life depleted
            if (p.life <= 0) return false;
            
            // Remove confetti particles that fell below screen
            if (p.isConfetti && p.y > canvas.height + 50) return false;
            
            return true;
        });
    },
    
    // Render all particles to canvas
    renderParticles(ctx, cameraX) {
        for (let p of this.particles) {
            // Calculate alpha based on life (0-1)
            const alpha = Math.max(0, Math.min(1, p.life));
            
            ctx.save();
            
            // Set particle color with alpha
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            
            // Translate to particle position (accounting for camera)
            const screenX = p.x - cameraX;
            
            // Apply rotation if particle has rotation
            if (p.rotation !== undefined) {
                ctx.translate(screenX, p.y);
                ctx.rotate(p.rotation);
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            } else {
                // Draw particle as a square
                ctx.fillRect(screenX - p.size / 2, p.y - p.size / 2, p.size, p.size);
            }
            
            ctx.restore();
        }
    },
    
    // Clear all particles (for game reset)
    clearParticles() {
        this.particles = [];
    }
};

// Particle Generators

// Create trail particles that follow behind the player during movement
function createTrailParticles(x, y, velocityX, velocityY) {
    // Generate 1-2 trail particles per frame
    const particleCount = Math.floor(Math.random() * 2) + 1; // 1 or 2 particles
    
    for (let i = 0; i < particleCount; i++) {
        const particle = {
            x: x + player.width / 2 + (Math.random() - 0.5) * player.width * 0.5, // Center of player with slight randomness
            y: y + player.height / 2 + (Math.random() - 0.5) * player.height * 0.5,
            velocityX: -velocityX * 0.2 + (Math.random() - 0.5) * 0.5, // Opposite direction of movement, slight randomness
            velocityY: -velocityY * 0.2 + (Math.random() - 0.5) * 0.5,
            life: 1.0, // Full life
            decay: 0.02 + Math.random() * 0.01, // Decay rate: 0.02-0.03 per frame
            size: 3 + Math.random() * 3, // Size: 3-6 pixels
            color: '#790ECB', // Kiro purple
            rotation: undefined,
            rotationSpeed: undefined
        };
        
        particleSystem.addParticle(particle);
    }
}

// Create explosion particles that radiate outward from collision points
function createExplosionParticles(x, y) {
    // Generate 8-12 explosion particles
    const particleCount = Math.floor(Math.random() * 5) + 8; // 8-12 particles
    
    for (let i = 0; i < particleCount; i++) {
        // Calculate angle for radial distribution
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
        
        // Varying velocity magnitudes for visual variety
        const speed = 2 + Math.random() * 3; // Speed: 2-5 pixels per frame
        
        // Explosion colors: orange and red for impact effects
        const colors = ['#FF6B35', '#FF8C42', '#FFA500'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const particle = {
            x: x,
            y: y,
            velocityX: Math.cos(angle) * speed,
            velocityY: Math.sin(angle) * speed,
            life: 1.0, // Full life
            decay: 0.015 + Math.random() * 0.01, // Decay rate: 0.015-0.025 per frame (longer lived than trails)
            size: 3 + Math.random() * 5, // Varying sizes: 3-8 pixels
            color: color, // Orange/red tones for explosions
            rotation: undefined,
            rotationSpeed: undefined
        };
        
        particleSystem.addParticle(particle);
    }
}

// Create sparkle particles with upward motion and rotation
function createSparkleParticles(x, y) {
    // Generate 5-8 sparkle particles
    const particleCount = Math.floor(Math.random() * 4) + 5; // 5-8 particles
    
    for (let i = 0; i < particleCount; i++) {
        // Sparkle colors: white or gold
        const colors = ['#ffffff', '#FFD700'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const particle = {
            x: x + (Math.random() - 0.5) * 20, // Spread around collection point
            y: y + (Math.random() - 0.5) * 20,
            velocityX: (Math.random() - 0.5) * 2, // Slight horizontal spread
            velocityY: -2 - Math.random() * 2, // Upward motion: -2 to -4 pixels per frame
            life: 1.0, // Full life
            decay: 0.02 + Math.random() * 0.01, // Decay rate: 0.02-0.03 per frame
            size: 4 + Math.random() * 4, // Size: 4-8 pixels
            color: color,
            rotation: Math.random() * Math.PI * 2, // Random initial rotation
            rotationSpeed: (Math.random() - 0.5) * 0.2 // Rotation speed: -0.1 to 0.1 radians per frame
        };
        
        particleSystem.addParticle(particle);
    }
}

// Create confetti particles for new high score celebration
function createConfettiParticles() {
    // Generate 30-50 confetti particles
    const particleCount = Math.floor(Math.random() * 21) + 30; // 30-50 particles
    
    for (let i = 0; i < particleCount; i++) {
        // Confetti colors: purple, gold, and white
        const colors = ['#790ECB', '#FFD700', '#ffffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Distribute confetti across screen width (in world coordinates)
        const worldX = game.camera.x + Math.random() * canvas.width;
        
        const particle = {
            x: worldX,
            y: -20 - Math.random() * 50, // Start above screen
            velocityX: (Math.random() - 0.5) * 3, // Horizontal drift: -1.5 to 1.5 pixels per frame
            velocityY: 1 + Math.random() * 2, // Falling motion: 1-3 pixels per frame (downward)
            life: 1.0, // Full life
            decay: 0.005 + Math.random() * 0.005, // Slower decay: 0.005-0.01 per frame (long-lived)
            size: 6 + Math.random() * 6, // Size: 6-12 pixels (larger than other particles)
            color: color,
            rotation: Math.random() * Math.PI * 2, // Random initial rotation
            rotationSpeed: (Math.random() - 0.5) * 0.15, // Rotation speed: -0.075 to 0.075 radians per frame
            isConfetti: true // Mark as confetti for position-based cleanup
        };
        
        particleSystem.addParticle(particle);
    }
}

// Input handling
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Update player
function updatePlayer() {
    // Horizontal movement
    if (keys['ArrowLeft'] || keys['a']) {
        player.velocityX = -player.speed;
    } else if (keys['ArrowRight'] || keys['d']) {
        player.velocityX = player.speed;
    } else {
        player.velocityX *= player.friction;
    }
    
    // Jumping
    if ((keys['ArrowUp'] || keys['w'] || keys[' ']) && player.isGrounded) {
        player.velocityY = -player.jumpPower;
        player.isGrounded = false;
    }
    
    // Apply gravity
    player.velocityY += player.gravity;
    
    // Generate trail particles when player is moving
    // Check if player has significant horizontal or vertical velocity
    const isMoving = Math.abs(player.velocityX) > 0.5 || Math.abs(player.velocityY) > 0.5;
    if (isMoving) {
        createTrailParticles(player.x, player.y, player.velocityX, player.velocityY);
    }
    
    // Apply horizontal movement with collision check
    player.x += player.velocityX;
    checkHorizontalCollision();
    
    // Apply vertical movement with collision check
    player.y += player.velocityY;
    checkVerticalCollision();
    
    // Fall off the world
    if (player.y > canvas.height + 100) {
        loseLife();
    }
    
    // Keep player in bounds horizontally
    if (player.x < 0) player.x = 0;
    if (player.x > levelWidth - player.width) player.x = levelWidth - player.width;
}

// Check horizontal collisions (left/right)
function checkHorizontalCollision() {
    let hasCollision = false;
    
    for (let platform of platforms) {
        if (checkCollision(player, platform)) {
            hasCollision = true;
            
            // Determine collision point for explosion effect
            let collisionX, collisionY;
            
            // Only create explosion on NEW collision (not continuous)
            if (!player.hadHorizontalCollision) {
                // Moving right - hit left side of platform
                if (player.velocityX > 0) {
                    player.x = platform.x - player.width;
                    collisionX = player.x + player.width;
                    collisionY = player.y + player.height / 2;
                    createExplosionParticles(collisionX, collisionY);
                }
                // Moving left - hit right side of platform
                else if (player.velocityX < 0) {
                    player.x = platform.x + platform.width;
                    collisionX = player.x;
                    collisionY = player.y + player.height / 2;
                    createExplosionParticles(collisionX, collisionY);
                }
            } else {
                // Still need to adjust position even if not creating particles
                if (player.velocityX > 0) {
                    player.x = platform.x - player.width;
                } else if (player.velocityX < 0) {
                    player.x = platform.x + platform.width;
                }
            }
            
            player.velocityX = 0;
        }
    }
    
    player.hadHorizontalCollision = hasCollision;
}

// Check vertical collisions (up/down)
function checkVerticalCollision() {
    player.isGrounded = false;
    
    for (let platform of platforms) {
        if (checkCollision(player, platform)) {
            // Determine collision point for explosion effect
            let collisionX, collisionY;
            
            // Falling down - landing on top of platform
            if (player.velocityY > 0) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.isGrounded = true;
                
                // Only create explosion when FIRST landing (not every frame on ground)
                if (!player.wasGrounded) {
                    collisionX = player.x + player.width / 2;
                    collisionY = player.y + player.height;
                    createExplosionParticles(collisionX, collisionY);
                }
            }
            // Moving up - hitting bottom of platform
            else if (player.velocityY < 0) {
                player.y = platform.y + platform.height;
                player.velocityY = 0;
                collisionX = player.x + player.width / 2;
                collisionY = player.y;
                createExplosionParticles(collisionX, collisionY);
            }
        }
    }
    
    // Update previous grounded state for next frame
    player.wasGrounded = player.isGrounded;
}

// Collision detection
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Update camera
function updateCamera() {
    // Center camera on player
    game.camera.x = player.x - canvas.width / 2 + player.width / 2;
    
    // Keep camera in bounds
    if (game.camera.x < 0) game.camera.x = 0;
    if (game.camera.x > levelWidth - canvas.width) {
        game.camera.x = levelWidth - canvas.width;
    }
}

// Check collectibles
function checkCollectibles() {
    for (let collectible of collectibles) {
        if (!collectible.collected) {
            const collisionBox = {
                x: collectible.x - 15,
                y: collectible.y - 15,
                width: 30,
                height: 30
            };
            
            if (checkCollision(player, collisionBox)) {
                collectible.collected = true;
                game.score += 5;
                updateScore();
                
                // Create sparkle particles at collectible location
                createSparkleParticles(collectible.x, collectible.y);
            }
        }
    }
}

// Check goal
function checkGoal() {
    if (checkCollision(player, goal)) {
        levelComplete();
    }
}

// Draw functions
function drawPlayer() {
    ctx.drawImage(player.image, player.x - game.camera.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    ctx.fillStyle = '#2a2a3e';
    ctx.strokeStyle = '#790ECB';
    ctx.lineWidth = 2;
    
    for (let platform of platforms) {
        ctx.fillRect(
            platform.x - game.camera.x,
            platform.y,
            platform.width,
            platform.height
        );
        ctx.strokeRect(
            platform.x - game.camera.x,
            platform.y,
            platform.width,
            platform.height
        );
    }
}

function drawCollectibles() {
    for (let collectible of collectibles) {
        if (!collectible.collected) {
            drawCrown(collectible.x - game.camera.x, collectible.y);
        }
    }
}

function drawCrown(x, y) {
    ctx.fillStyle = '#790ECB';
    ctx.strokeStyle = '#9a3de8';
    ctx.lineWidth = 2;
    
    // Crown base
    ctx.beginPath();
    ctx.moveTo(x - 12, y + 10);
    ctx.lineTo(x - 15, y - 5);
    ctx.lineTo(x - 10, y);
    ctx.lineTo(x - 5, y - 10);
    ctx.lineTo(x, y);
    ctx.lineTo(x + 5, y - 10);
    ctx.lineTo(x + 10, y);
    ctx.lineTo(x + 15, y - 5);
    ctx.lineTo(x + 12, y + 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Crown jewels
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x - 5, y - 5, 2, 0, Math.PI * 2);
    ctx.arc(x, y - 2, 2, 0, Math.PI * 2);
    ctx.arc(x + 5, y - 5, 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawGoal() {
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 3;
    
    // Flag pole
    ctx.fillRect(goal.x - game.camera.x, goal.y, 5, goal.height);
    
    // Flag
    ctx.beginPath();
    ctx.moveTo(goal.x - game.camera.x + 5, goal.y);
    ctx.lineTo(goal.x - game.camera.x + 55, goal.y + 25);
    ctx.lineTo(goal.x - game.camera.x + 5, goal.y + 50);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawBackground() {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#0f0f1e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for (let i = 0; i < 50; i++) {
        const x = (i * 157) % levelWidth;
        const y = (i * 73) % (canvas.height - 100);
        const screenX = x - game.camera.x;
        
        if (screenX > -10 && screenX < canvas.width + 10) {
            ctx.fillRect(screenX, y, 2, 2);
        }
    }
}

// UI updates
function updateScore() {
    document.getElementById('score').textContent = game.score;
}

function updateHighScore() {
    document.getElementById('highScore').textContent = game.highScore;
}

function updateLives() {
    document.getElementById('lives').textContent = game.lives;
}

function loseLife() {
    game.lives--;
    updateLives();
    
    if (game.lives <= 0) {
        gameOver();
    } else {
        // Reset current run when losing a life
        resetCurrentRun();
    }
}

function resetPlayerPosition() {
    // Use the current level's starting position
    const level = levels[game.currentLevel];
    player.x = level.startPosition.x;
    player.y = level.startPosition.y;
    player.velocityX = 0;
    player.velocityY = 0;
}

// Respawn all collectibles to their original positions
function respawnCollectibles() {
    for (let i = 0; i < collectibles.length; i++) {
        collectibles[i].collected = false;
    }
}

// Reset current run - reset score and respawn collectibles
function resetCurrentRun() {
    // Reset score to the level start score (what you earned in previous levels)
    game.score = game.levelStartScore;
    updateScore();
    
    // Respawn all collectibles
    respawnCollectibles();
    
    // Reset player position to starting location
    resetPlayerPosition();
    
    // Clear particles for clean restart
    particleSystem.clearParticles();
}

function gameOver() {
    game.isRunning = false;
    
    // Update high score if needed
    if (storage.updateHighScore(game.score)) {
        game.highScore = game.score;
        updateHighScore();
    }
    
    document.getElementById('finalScore').textContent = game.score;
    document.getElementById('gameOver').classList.remove('hidden');
}

// Load a specific level
function loadLevel(levelNumber, preserveScore = false) {
    const level = levels[levelNumber];
    if (!level) {
        console.error(`Level ${levelNumber} not found`);
        return;
    }
    
    // Update current level
    game.currentLevel = levelNumber;
    
    // If preserveScore is true, save the current score as the level start score
    // This happens when transitioning to a new level after completing the previous one
    if (preserveScore) {
        game.levelStartScore = game.score;
    }
    
    // Update level references
    levelWidth = level.levelWidth;
    platforms = level.platforms;
    collectibles = level.collectibles.map(c => ({ ...c, collected: false })); // Reset collected state
    goal = level.goal;
    
    // Store original collectible positions for this level
    originalCollectibles = collectibles.map(c => ({ x: c.x, y: c.y }));
    
    // Reset player to starting position for this level
    player.x = level.startPosition.x;
    player.y = level.startPosition.y;
    player.velocityX = 0;
    player.velocityY = 0;
    
    // Clear particles for clean level start
    particleSystem.clearParticles();
    
    // Reset camera
    game.camera.x = 0;
    game.camera.y = 0;
}

function levelComplete() {
    game.isRunning = false;
    
    // Check if this is a new high score and trigger confetti
    const isNewHighScore = storage.updateHighScore(game.score);
    if (isNewHighScore) {
        game.highScore = game.score;
        updateHighScore();
        
        // Trigger confetti celebration for new high score!
        createConfettiParticles();
    }
    
    // Check if there's a next level
    const nextLevel = game.currentLevel + 1;
    
    if (levels[nextLevel]) {
        // Show transition screen for next level
        showLevelTransition(game.currentLevel, game.score);
    } else {
        // No more levels - show game complete screen with same styling
        document.getElementById('completeScore').textContent = game.score;
        const levelCompleteOverlay = document.getElementById('levelComplete');
        levelCompleteOverlay.classList.remove('hidden', 'fade-out');
    }
}

// Show level transition screen
function showLevelTransition(completedLevel, score) {
    const transitionOverlay = document.getElementById('levelTransition');
    
    // Update transition screen content
    document.getElementById('transitionLevelNumber').textContent = completedLevel;
    document.getElementById('transitionScore').textContent = score;
    
    // Show the transition screen with fade-in
    transitionOverlay.classList.remove('hidden', 'fade-out');
    
    // Set up auto-progression after 3 seconds
    const autoProgressTimer = setTimeout(() => {
        hideTransitionScreen();
    }, 3000);
    
    // Store timer ID so we can cancel it if user clicks button
    transitionOverlay.dataset.timerId = autoProgressTimer;
}

// Hide transition screen and load next level
function hideTransitionScreen() {
    const transitionOverlay = document.getElementById('levelTransition');
    
    // Clear auto-progress timer if it exists
    if (transitionOverlay.dataset.timerId) {
        clearTimeout(parseInt(transitionOverlay.dataset.timerId));
        delete transitionOverlay.dataset.timerId;
    }
    
    // Add fade-out animation
    transitionOverlay.classList.add('fade-out');
    
    // Wait for fade-out animation to complete, then hide and load next level
    setTimeout(() => {
        transitionOverlay.classList.add('hidden');
        transitionOverlay.classList.remove('fade-out');
        
        // Load next level and preserve the score earned so far
        const nextLevel = game.currentLevel + 1;
        if (levels[nextLevel]) {
            loadLevel(nextLevel, true);  // Pass true to preserve score
            game.isRunning = true;
        }
    }, 500); // Match the fade-out animation duration
}

function restartGame() {
    game.score = 0;
    game.lives = 3;
    game.isRunning = true;
    game.levelStartScore = 0;  // Reset level start score when restarting
    
    // Load level 1
    loadLevel(1);
    
    updateScore();
    updateLives();
    
    document.getElementById('gameOver').classList.add('hidden');
    document.getElementById('levelComplete').classList.add('hidden');
    
    // Don't call gameLoop() - it's already running!
}

// Event listeners
document.getElementById('restartBtn').addEventListener('click', restartGame);
document.getElementById('nextLevelBtn').addEventListener('click', () => {
    // This button is now only used on the game complete screen to restart
    restartGame();
});
document.getElementById('transitionContinueBtn').addEventListener('click', () => {
    hideTransitionScreen();
});

// Game loop
function gameLoop() {
    // Always update and render particles (even when game is paused)
    particleSystem.updateParticles();
    
    drawBackground();
    drawPlatforms();
    drawCollectibles();
    drawGoal();
    drawPlayer();
    
    // Render particles (after player so they appear on top)
    particleSystem.renderParticles(ctx, game.camera.x);
    
    // Only update game logic if running
    if (game.isRunning) {
        updatePlayer();
        updateCamera();
        checkCollectibles();
        checkGoal();
    }
    
    requestAnimationFrame(gameLoop);
}

// Initialize game
function initGame() {
    // Load high score from localStorage
    game.highScore = storage.loadHighScore();
    updateHighScore();
    
    // Load level 1
    loadLevel(1);
    
    gameLoop();
}

// Start game
player.image.onload = () => {
    initGame();
};

// Start even if image fails to load
player.image.onerror = () => {
    console.warn('Kiro logo not found, using placeholder');
    initGame();
};
