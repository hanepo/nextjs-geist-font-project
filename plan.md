Below is the complete detailed plan for the Lucky Fun Casino app. This plan lists all the files that must be created or updated, details the UI/UX and sound features, and includes robust error handling and best practices for local storage and state management.

---

### 1. Global Styles and Variables

**File:** src/app/globals.css  
**Changes:**  
- Add CSS variables for the classic casino colors:  
  - --casino-gold: #FFD700  
  - --casino-red: #B22222  
  - --casino-black: #000000  
  - --casino-green: #006400  
- Update global element styles (headings, buttons, links) to use these variables so the design has consistent Las Vegas vibes.  
- Ensure responsive design and reset default margins/paddings.

---

### 2. Casino State Management

**File:** src/hooks/useCasinoStore.ts  
**Changes:**  
- Create a new hook to manage the casino state (coins, achievements, leaderboard, settings).  
- Initialize state with 5000 coins and default settings (sound enabled).  
- Use useEffect to load and save state from/to localStorage with try/catch blocks for error handling.  
- Expose helper functions (updateCoins, toggleSound, addAchievement) for use by game pages.

---

### 3. Sound Effects with Web Audio API

**File:** src/components/SoundManager.tsx  
**Changes:**  
- Build a context provider component that offers a playSound(soundName) function.  
- Use the Web Audio API to load sound files (e.g., /sounds/slot.mp3, /sounds/roulette.mp3, etc.) from the public folder.  
- Include error handling (try/catch and promise rejection handling on audio.play) and verify that sound plays only when enabled.  
- Wrap the entire casino app in this provider (or use it in individual game pages as needed).

---

### 4. Reusable Casino Navigation

**File:** src/components/CasinoNav.tsx  
**Changes:**  
- Create a navigation component with links to the home page and every game page, as well as Leaderboard, Achievements, and Settings.  
- Style the nav with a dark background (var(--casino-black)) and white text for clear visibility.  
- Use responsive flex layouts and spacing.

---

### 5. Casino Application Pages

#### a. Landing/Home Page

**File:** src/app/casino/page.tsx  
**Changes:**  
- Display the title “Lucky Fun Casino” in large, bold text using var(--casino-gold).  
- Show a disclaimer: “This game does not offer real money gambling or prizes.”  
- Display the current coin balance (from useCasinoStore).  
- Provide clear navigation links (using CasinoNav and shadcn/ui–styled buttons or links) to each game: Slot Machine, Roulette, Blackjack, Poker, Dice Game.

#### b. Game Pages

Create separate folders/pages under src/app/casino/games for each game.

i. **Slot Machine**  
 **File:** src/app/casino/games/slot-machine/page.tsx  
 **Changes:**  
 - Build a modern UI showing three “reels” (displayed as text labels such as "Cherry", "Lemon", etc.—do not use external icon libraries).  
 - Animate reels using CSS transitions/animations.  
 - Add a “Spin” button that triggers random draws and calls playSound("slot") through SoundManager.  
 - Update coins via updateCoins (e.g., win 500 coins if all symbols match; otherwise deduct 100).  
 - Include error handling in game logic.

ii. **Roulette Wheel**  
 **File:** src/app/casino/games/roulette/page.tsx  
 **Changes:**  
 - Create a UI with a visual representation of the roulette wheel (text/numeric display with simple CSS rotation animation).  
 - Add a spin button that triggers a random number (0–36) and uses playSound("roulette").  
 - Update coins accordingly (e.g., if even, add 200; if odd, deduct 200).

iii. **Blackjack (with simple AI)**  
 **File:** src/app/casino/games/blackjack/page.tsx  
 **Changes:**  
 - Develop a basic layout showing player’s and dealer’s cards (use text placeholders).  
 - Implement simple game logic for hitting, standing, and card dealing.  
 - Use playSound("card") when dealing cards and update coins based on win/loss outcome.

iv. **Poker (with bots)**  
 **File:** src/app/casino/games/poker/page.tsx  
 **Changes:**  
 - Create a UI with a table layout representing the poker game.  
 - Simulate bot actions with a simple logic to decide win/loss.  
 - Play card-dealing sounds and update coin balance accordingly.

v. **Dice Game**  
 **File:** src/app/casino/games/dice/page.tsx  
 **Changes:**  
 - Create an interface to roll dice, showing the dice number (using text or styled boxes).  
 - When the roll button is pressed, call playSound("dice") and generate a random number (1–6).  
 - Use basic win criteria (e.g., if the number matches a lucky number, add coins; otherwise, deduct coins).

Each game page must:  
- Include a “Back to Home” link (using CasinoNav or a separate link).  
- Use clear typography, spacing, and the classic casino color palette.  
- Handle any process errors (bad RNG output, unexpected state update issues).

#### c. Settings Page

**File:** src/app/casino/settings/page.tsx  
**Changes:**  
- Create a modern settings interface that shows a toggle for sound settings.  
- Use the toggle button to call toggleSound() from useCasinoStore.  
- Display the current status (sound on/off) clearly.

#### d. Leaderboard Page

**File:** src/app/casino/leaderboard/page.tsx  
**Changes:**  
- Build a clean leaderboard table (or list) that shows (locally) stored high scores from the leaderboard state.  
- Include error handling if the leaderboard array is empty or not formatted correctly.

#### e. Achievements Page

**File:** src/app/casino/achievements/page.tsx  
**Changes:**  
- Create a grid or list of achievement cards.  
- Each card displays an achievement unlocked (e.g., “Win 3 times in a row” or “Hit a jackpot”).  
- Use clear typography and spacing and fall back to a “No achievements unlocked yet” message if empty.

---

### 6. Public Assets

**Directory:** public/sounds/  
**Changes:**  
- Place sound assets such as slot.mp3, roulette.mp3, card.mp3, and dice.mp3.  
- Ensure that each sound file is correctly named and accessible by the SoundManager.

---

### 7. Utility Functions

**File:** src/lib/utils.ts  
**Changes:**  
- Add helper functions (e.g., random number generators, string formatting helpers).  
- Implement error handling within utility functions where necessary.

---

### 8. Documentation & Error Handling

**File:** README.md  
**Changes:**  
- Update documentation with game instructions, how state is managed via local storage, and the disclaimer on no real money betting.  
- Emphasize offline mode and note that enhancements (like Firebase integration) can be added later.

**General Best Practices:**  
- All localStorage operations are wrapped in try/catch blocks.  
- Audio playback is handled with correct promise handling and error messaging.  
- UI elements use only built-in styling (typography, spacing, color variables) with no external icons or SVG libraries.  
- Each page includes navigation to ensure consistent UX.

---

### Summary

- globals.css is updated to declare casino colors and base styles.  
- useCasinoStore hook manages coins, achievements, leaderboard, and settings with local storage and proper error handling.  
- SoundManager.tsx implements Web Audio API sound playback with error controls.  
- CasinoNav.tsx provides navigation across home, games, settings, leaderboard, and achievements.  
- A dedicated page is created for each game (Slot Machine, Roulette, Blackjack, Poker, Dice) with modern, mobile-friendly UI, animations, and sound effects.  
- Settings, Leaderboard, and Achievements pages are added with clean, accessible interfaces using only typography, color, and layout.  
- Utility functions and documentation ensure maintainability and clarity for future enhancements.  
- The entire app is built with robust error handling and best practices across all interactive and persistent components.
