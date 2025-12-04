# Implementation Plan

- [x] 1. Implement score persistence system with localStorage
  - Create storage utility functions (saveScore, loadHighScore, updateHighScore)
  - Add high score display to HUD next to current score
  - Integrate high score loading on game start
  - Integrate score saving on game over and level complete
  - Add error handling for localStorage failures with fallback to in-memory storage
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ]* 1.1 Write property test for score persistence
  - **Property 1: Score persistence**
  - **Validates: Requirements 1.1**

- [ ]* 1.2 Write property test for high score monotonicity
  - **Property 2: High score monotonicity**
  - **Validates: Requirements 1.3**

- [ ]* 1.3 Write unit tests for storage functions
  - Test saveScore with various values
  - Test loadHighScore with empty and existing localStorage
  - Test updateHighScore with scores above and below high score
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Create particle system foundation
  - Implement particle manager with particles array and core functions (addParticle, updateParticles, renderParticles, clearParticles)
  - Create base particle update logic (life decay, position updates, cleanup)
  - Integrate particle updates and rendering into main game loop
  - Add maximum particle limit (500) with oldest particle removal
  - _Requirements: 2.4, 3.4, 4.3_

- [ ]* 2.1 Write property test for particle cleanup
  - **Property 4: Particle cleanup**
  - **Validates: Requirements 2.4, 3.4, 4.3**

- [ ]* 2.2 Write property test for particle life decay
  - **Property 5: Particle life decay**
  - **Validates: Requirements 2.3**

- [ ]* 2.3 Write unit tests for particle manager
  - Test updateParticles removes dead particles
  - Test updateParticles decreases particle life
  - Test clearParticles empties array
  - Test particle limit enforcement
  - _Requirements: 2.4, 3.4, 4.3_

- [x] 3. Implement trail particle effects
  - Create createTrailParticles generator function
  - Generate 1-2 trail particles per frame when player is moving
  - Set trail particles with Kiro purple color (#790ECB)
  - Add trail particle generation to player update function
  - Configure trail particles with appropriate life, decay, and size values
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [ ]* 3.1 Write property test for movement generates trails
  - **Property 6: Movement generates trails**
  - **Validates: Requirements 2.1, 2.2**

- [ ]* 3.2 Write property test for trail particle color
  - **Property 7: Trail particle color**
  - **Validates: Requirements 2.5**

- [x] 4. Implement explosion and sparkle particle effects
  - Create createExplosionParticles generator (8-12 particles radiating outward)
  - Create createSparkleParticles generator (5-8 particles with upward motion and rotation)
  - Add explosion particle generation to collision detection functions
  - Add sparkle particle generation to collectible pickup function
  - Configure explosion particles with varying sizes and velocities
  - Configure sparkle particles with white/gold colors and upward velocity
  - _Requirements: 3.1, 3.2, 3.3, 3.5, 4.1, 4.2, 4.4, 4.5_

- [ ]* 4.1 Write property test for collision generates explosions
  - **Property 8: Collision generates explosions**
  - **Validates: Requirements 3.1, 3.2**

- [ ]* 4.2 Write property test for explosion particle radiation
  - **Property 9: Explosion particle radiation**
  - **Validates: Requirements 3.3**

- [ ]* 4.3 Write property test for explosion particle variety
  - **Property 10: Explosion particle variety**
  - **Validates: Requirements 3.5**

- [ ]* 4.4 Write property test for collection generates sparkles
  - **Property 11: Collection generates sparkles**
  - **Validates: Requirements 4.1**

- [ ]* 4.5 Write property test for sparkle particle motion
  - **Property 12: Sparkle particle motion**
  - **Validates: Requirements 4.2**

- [ ]* 4.6 Write property test for sparkle particle colors
  - **Property 13: Sparkle particle colors**
  - **Validates: Requirements 4.4**

- [ ]* 4.7 Write property test for sparkle particle quantity
  - **Property 14: Sparkle particle quantity**
  - **Validates: Requirements 4.5**

- [x] 5. Implement confetti celebration effect for new high scores
  - Create createConfettiParticles generator (30-50 particles across screen width)
  - Configure confetti with falling motion, rotation, and multiple colors (purple, gold, white)
  - Add confetti trigger when current score exceeds high score
  - Implement confetti position-based cleanup (remove when below screen)
  - Integrate confetti generation into score update logic
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 5.1 Write property test for high score triggers confetti
  - **Property 15: High score triggers confetti**
  - **Validates: Requirements 5.1**

- [ ]* 5.2 Write property test for confetti screen distribution
  - **Property 16: Confetti screen distribution**
  - **Validates: Requirements 5.2**

- [ ]* 5.3 Write property test for confetti particle motion
  - **Property 17: Confetti particle motion**
  - **Validates: Requirements 5.3**

- [ ]* 5.4 Write property test for confetti position cleanup
  - **Property 18: Confetti position cleanup**
  - **Validates: Requirements 5.4**

- [ ]* 5.5 Write property test for confetti color variety
  - **Property 19: Confetti color variety**
  - **Validates: Requirements 5.5**

- [x] 6. Implement score reset on life loss
  - Create resetCurrentRun function to reset score to zero
  - Create respawnCollectibles function to restore all collectibles to original positions
  - Store original collectible positions when level loads
  - Integrate reset logic into life loss handler
  - Ensure high score is preserved during reset
  - Reset player position to starting location
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]* 6.1 Write property test for life loss resets score
  - **Property 20: Life loss resets score**
  - **Validates: Requirements 6.1**

- [ ]* 6.2 Write property test for life loss respawns collectibles
  - **Property 21: Life loss respawns collectibles**
  - **Validates: Requirements 6.2**

- [ ]* 6.3 Write property test for life loss preserves high score
  - **Property 22: Life loss preserves high score**
  - **Validates: Requirements 6.3**

- [x] 7. Fix level design to make all collectibles reachable
  - Review current collectible positions and identify unreachable items
  - Reposition collectibles to be on or near reachable platforms
  - Ensure all collectibles are within maximum jump height from platforms
  - Test that each collectible can be reached using standard jump mechanics
  - Validate no collectibles are beyond level boundaries
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]* 7.1 Write property test for collectible reachability
  - **Property 23: Collectible reachability**
  - **Validates: Requirements 7.2, 7.5**

- [ ]* 7.2 Write property test for collectible platform association
  - **Property 24: Collectible platform association**
  - **Validates: Requirements 7.1, 7.3**

- [x] 8. Create second level with new layout
  - Design level 2 platform layout with increased difficulty
  - Position collectibles in reachable locations for level 2
  - Set goal flag position for level 2
  - Define starting position for level 2
  - Create level data structure to store both level 1 and level 2 configurations
  - Implement loadLevel function to switch between levels
  - Add level progression logic when goal is reached
  - Maintain score and lives across level transitions
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]* 8.1 Write property test for level transition preserves state
  - **Property 25: Level transition preserves state**
  - **Validates: Requirements 8.4**

- [ ]* 8.2 Write property test for level transition resets position
  - **Property 26: Level transition resets position**
  - **Validates: Requirements 8.5**

- [x] 9. Create level transition screen
  - Create HTML overlay for level transition screen
  - Style transition screen with Kiro purple branding
  - Display completed level number and current score
  - Add animated celebration message with bouncing text
  - Implement continue button to proceed to next level
  - Add automatic progression after 3 seconds if button not clicked
  - Integrate transition screen into level completion flow
  - Add fade-in and fade-out animations for smooth transitions
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ]* 9.1 Write property test for transition screen displays score
  - **Property 27: Transition screen displays score**
  - **Validates: Requirements 9.2**

- [ ]* 9.2 Write property test for transition screen shows level number
  - **Property 28: Transition screen shows level number**
  - **Validates: Requirements 9.2**

- [ ] 10. Final checkpoint - Ensure all features work together
  - Ensure all tests pass, ask the user if questions arise
  - Test complete game flow: start → play → collect → lose life → score reset → complete level 1 → transition → level 2 → complete
  - Verify high score persists across page reloads
  - Verify all particle effects render correctly with camera movement
  - Verify all collectibles are reachable in both levels
  - Verify level transition screen displays correctly
  - Verify performance with maximum particle count
