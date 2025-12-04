# Design Document

## Overview

This design extends Super Kiro World with two major feature sets: a persistent score tracking system using browser localStorage, and a comprehensive particle effects system for visual feedback. The implementation maintains the existing vanilla JavaScript architecture while adding modular particle management and storage utilities.

## Architecture

### High-Level Structure

The enhancements integrate into the existing single-file architecture with clear separation of concerns:

1. **Storage Layer**: LocalStorage wrapper functions for score persistence
2. **Particle System**: Centralized particle manager with type-specific generators
3. **Game Loop Integration**: Particle updates and rendering within existing game loop
4. **UI Layer**: High score display additions to existing HUD

### Data Flow

```
Game Events → Particle Generators → Particle Manager → Renderer
     ↓
Score Updates → Storage Manager → LocalStorage → UI Updates
```

## Components and Interfaces

### Storage Manager

**Purpose**: Manage persistent storage of game scores using localStorage API

**Functions**:
- `saveScore(score)`: Store current score to localStorage
- `loadHighScore()`: Retrieve high score from localStorage, return 0 if none exists
- `updateHighScore(score)`: Update high score if current score exceeds it
- `checkNewHighScore(currentScore, highScore)`: Return boolean indicating if new high score achieved

**Storage Keys**:
- `kiro_high_score`: Stores the player's highest score as a number

### Particle System

**Purpose**: Manage creation, updating, and rendering of all particle effects

**Particle Base Structure**:
```javascript
{
    x: number,           // X position
    y: number,           // Y position
    velocityX: number,   // Horizontal velocity
    velocityY: number,   // Vertical velocity
    life: number,        // Remaining lifetime (0-1)
    decay: number,       // Rate of life decrease per frame
    size: number,        // Particle size in pixels
    color: string,       // CSS color string
    rotation: number,    // Current rotation angle (for confetti)
    rotationSpeed: number // Rotation velocity (for confetti)
}
```

**Particle Manager**:
- `particles`: Array storing all active particles
- `addParticle(particle)`: Add new particle to active array
- `updateParticles()`: Update all particles, remove dead ones
- `renderParticles(ctx, cameraX)`: Draw all particles to canvas
- `clearParticles()`: Remove all particles (for game reset)

**Particle Generators**:
- `createTrailParticles(x, y, velocityX, velocityY)`: Generate 1-2 trail particles
- `createExplosionParticles(x, y)`: Generate 8-12 explosion particles radiating outward
- `createSparkleParticles(x, y)`: Generate 5-8 sparkle particles with upward motion
- `createConfettiParticles()`: Generate 30-50 confetti particles across screen width

### UI Enhancements

**High Score Display**:
- Add high score element to existing HUD
- Position next to current score display
- Update on game start and when new high score achieved
- Style consistently with existing Kiro purple theme

## Data Models

### Particle Object
```javascript
{
    x: 150.5,
    y: 200.3,
    velocityX: 2.5,
    velocityY: -3.0,
    life: 1.0,
    decay: 0.02,
    size: 4,
    color: '#790ECB',
    rotation: 0,
    rotationSpeed: 0.1
}
```

### Storage Data
```javascript
localStorage: {
    'kiro_high_score': '45'  // Stored as string, parsed as number
}
```

## 
Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Storage Properties

**Property 1: Score persistence**
*For any* game session with a score value, when the session ends, querying localStorage should return that same score value.
**Validates: Requirements 1.1**

**Property 2: High score monotonicity**
*For any* current score that exceeds the stored high score, after updating, the high score in localStorage should equal the current score.
**Validates: Requirements 1.3**

**Property 3: Score display completeness**
*For any* game state, the rendered UI should contain both the current score and high score values.
**Validates: Requirements 1.5**

### Particle Lifecycle Properties

**Property 4: Particle cleanup**
*For any* particle with life value less than or equal to zero, after the update cycle, that particle should not exist in the active particles array.
**Validates: Requirements 2.4, 3.4, 4.3**

**Property 5: Particle life decay**
*For any* active particle, after one update cycle, its life value should be less than its previous life value.
**Validates: Requirements 2.3**

### Trail Particle Properties

**Property 6: Movement generates trails**
*For any* player movement (horizontal or vertical velocity > 0), the particle system should generate trail particles.
**Validates: Requirements 2.1, 2.2**

**Property 7: Trail particle color**
*For any* trail particle generated, its color property should equal '#790ECB'.
**Validates: Requirements 2.5**

### Explosion Particle Properties

**Property 8: Collision generates explosions**
*For any* collision event (horizontal or vertical), the particle system should generate explosion particles at the collision coordinates.
**Validates: Requirements 3.1, 3.2**

**Property 9: Explosion particle radiation**
*For any* explosion particle generated, it should have non-zero velocity in at least one direction (velocityX or velocityY ≠ 0).
**Validates: Requirements 3.3**

**Property 10: Explosion particle variety**
*For any* set of explosion particles generated from a single collision, the particles should have varying size and velocity values (not all identical).
**Validates: Requirements 3.5**

### Sparkle Particle Properties

**Property 11: Collection generates sparkles**
*For any* collectible collection event, the particle system should generate sparkle particles at the collectible's coordinates.
**Validates: Requirements 4.1**

**Property 12: Sparkle particle motion**
*For any* sparkle particle generated, it should have negative velocityY (upward motion) and non-zero rotationSpeed.
**Validates: Requirements 4.2**

**Property 13: Sparkle particle colors**
*For any* sparkle particle generated, its color should be either white ('#ffffff') or gold ('#FFD700').
**Validates: Requirements 4.4**

**Property 14: Sparkle particle quantity**
*For any* collection event, the number of sparkle particles generated should be greater than one.
**Validates: Requirements 4.5**

### Confetti Particle Properties

**Property 15: High score triggers confetti**
*For any* score update where the current score exceeds the high score, the particle system should generate confetti particles.
**Validates: Requirements 5.1**

**Property 16: Confetti screen distribution**
*For any* confetti generation event, the generated particles should have x-coordinates spanning the full screen width (min x ≈ 0, max x ≈ canvas.width).
**Validates: Requirements 5.2**

**Property 17: Confetti particle motion**
*For any* confetti particle generated, it should have positive velocityY (downward motion) and non-zero rotationSpeed.
**Validates: Requirements 5.3**

**Property 18: Confetti position cleanup**
*For any* confetti particle with y-coordinate greater than the canvas height, after the update cycle, that particle should not exist in the active particles array.
**Validates: Requirements 5.4**

**Property 19: Confetti color variety**
*For any* confetti generation event creating multiple particles, the set should include particles with purple ('#790ECB'), gold ('#FFD700'), and white ('#ffffff') colors.
**Validates: Requirements 5.5**

## Error Handling

### LocalStorage Errors

**Scenarios**:
- Browser has localStorage disabled
- Storage quota exceeded
- Private browsing mode restrictions

**Handling**:
- Wrap all localStorage calls in try-catch blocks
- Fall back to in-memory high score if localStorage unavailable
- Log warnings to console for debugging
- Continue game functionality without persistence

### Particle System Errors

**Scenarios**:
- Excessive particle count causing performance issues
- Invalid particle properties (NaN, undefined)

**Handling**:
- Implement maximum particle count limit (e.g., 500 particles)
- Remove oldest particles when limit reached
- Validate particle properties before adding to array
- Skip rendering for particles with invalid properties

## Testing Strategy

### Unit Testing

**Storage Functions**:
- Test `saveScore()` with various score values
- Test `loadHighScore()` with empty localStorage
- Test `loadHighScore()` with existing value
- Test `updateHighScore()` with score lower than high score (no update)
- Test `updateHighScore()` with score higher than high score (update occurs)

**Particle Generators**:
- Test each generator creates correct particle count
- Test particle properties are within expected ranges
- Test particle colors match specifications

**Particle Manager**:
- Test `updateParticles()` removes dead particles
- Test `updateParticles()` decreases particle life
- Test `clearParticles()` empties particle array

### Property-Based Testing

We will use **fast-check** (JavaScript property-based testing library) to verify the correctness properties defined above.

**Configuration**:
- Each property test should run a minimum of 100 iterations
- Each test must include a comment tag referencing the design document property
- Tag format: `// Feature: game-enhancements, Property X: [property description]`

**Test Categories**:

1. **Storage Properties** (Properties 1-3):
   - Generate random score values
   - Test persistence and retrieval
   - Verify UI rendering includes both scores

2. **Particle Lifecycle** (Properties 4-5):
   - Generate random particle states
   - Test cleanup and decay behavior

3. **Trail Particles** (Properties 6-7):
   - Generate random movement velocities
   - Verify trail generation and color

4. **Explosion Particles** (Properties 8-10):
   - Generate random collision events
   - Verify explosion generation, radiation, and variety

5. **Sparkle Particles** (Properties 11-14):
   - Generate random collection events
   - Verify sparkle generation, motion, colors, and quantity

6. **Confetti Particles** (Properties 15-19):
   - Generate random high score scenarios
   - Verify confetti generation, distribution, motion, cleanup, and color variety

### Integration Testing

- Test complete game flow: start → play → collect → new high score → confetti
- Test particle system performance with maximum particle count
- Test localStorage persistence across page reloads
- Test particle rendering with camera movement

## Implementation Notes

### Performance Considerations

1. **Particle Pooling**: Consider object pooling for particles to reduce garbage collection
2. **Particle Limits**: Enforce maximum particle count to prevent performance degradation
3. **Render Optimization**: Only render particles within camera view
4. **Update Batching**: Update all particles in single loop iteration

### Browser Compatibility

- localStorage API supported in all modern browsers
- Canvas 2D context required for particle rendering
- RequestAnimationFrame for smooth particle animation
- No external dependencies required

### Visual Polish

- Use alpha blending for particle transparency
- Apply easing functions to particle decay for smoother fading
- Add slight randomization to particle properties for organic feel
- Consider adding glow effects using shadow blur for sparkles

### Score Reset System

**Purpose**: Reset game state when player loses a life while preserving high score

**Functions**:
- `resetCurrentRun()`: Reset score to 0 and respawn all collectibles
- `respawnCollectibles()`: Restore all collected items to original positions
- `resetPlayerPosition()`: Move player back to starting coordinates

**State Management**:
- Track original collectible positions for respawning
- Maintain separate current score and high score values
- Preserve lives count during reset

### Level System

**Purpose**: Manage multiple levels with different layouts and progression

**Level Data Structure**:
```javascript
{
    platforms: [...],      // Platform positions for this level
    collectibles: [...],   // Collectible positions for this level
    goal: {x, y},         // Goal flag position
    startPosition: {x, y}, // Player spawn point
    levelNumber: 1         // Level identifier
}
```

**Functions**:
- `loadLevel(levelNumber)`: Load level data and initialize game state
- `validateLevelDesign(level)`: Check all collectibles are reachable
- `transitionToNextLevel()`: Handle level completion and progression

**Level Progression**:
- Level 1: Current platform layout (revised for reachability)
- Level 2: New platform layout with increased difficulty
- Level Complete: Show completion screen after level 2

### Level Transition Screen

**Purpose**: Display celebratory screen between levels

**UI Components**:
- Level completion message ("Level X Complete!")
- Current score display
- Animated elements (bouncing text, particles)
- Continue button or auto-advance timer (3 seconds)

**Functions**:
- `showLevelTransition(levelNumber, score)`: Display transition screen
- `hideTransitionScreen()`: Remove transition and start next level
- `animateTransitionElements()`: Animate celebration text and effects

**Styling**:
- Full-screen overlay with semi-transparent background
- Kiro purple accent colors
- Large, bold typography for level completion
- Smooth fade-in/fade-out animations

## Correctness Properties (Updated)

### Score Reset Properties

**Property 20: Life loss resets score**
*For any* game state where the player loses a life, after the reset, the current score should equal zero.
**Validates: Requirements 6.1**

**Property 21: Life loss respawns collectibles**
*For any* game state where collectibles have been collected, after losing a life, all collectibles should be present at their original positions.
**Validates: Requirements 6.2**

**Property 22: Life loss preserves high score**
*For any* game state with a high score value, after losing a life, the high score should remain unchanged.
**Validates: Requirements 6.3**

### Level Design Properties

**Property 23: Collectible reachability**
*For any* collectible in the level, there should exist a valid path from the starting position using standard jump mechanics.
**Validates: Requirements 7.2, 7.5**

**Property 24: Collectible platform association**
*For any* collectible in the level, it should be positioned on or above a reachable platform within maximum jump height.
**Validates: Requirements 7.1, 7.3**

### Level Progression Properties

**Property 25: Level transition preserves state**
*For any* level completion, the player's score and remaining lives should be maintained when loading the next level.
**Validates: Requirements 8.4**

**Property 26: Level transition resets position**
*For any* level load, the player's position should be set to the level's starting position.
**Validates: Requirements 8.5**

### Transition Screen Properties

**Property 27: Transition screen displays score**
*For any* level completion, the transition screen should display the current score value.
**Validates: Requirements 9.2**

**Property 28: Transition screen shows level number**
*For any* level completion, the transition screen should display the completed level number.
**Validates: Requirements 9.2**

## Future Enhancements

- Particle sound effects (whoosh, sparkle, explosion sounds)
- Particle textures instead of solid colors
- Advanced particle behaviors (gravity, wind, bounce)
- Particle emitters for continuous effects
- Score history tracking (not just high score)
- Leaderboard integration with backend storage
- Additional levels (3, 4, 5+)
- Level editor for custom level creation
- Power-ups and special abilities
- Enemy characters and obstacles
