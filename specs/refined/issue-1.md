# Issue #1: As a user, I want to be able to switch to dark mode

## User Story
As a user, I want to be able to switch between light and dark mode so that I can comfortably view the application in different lighting conditions.

## Acceptance Criteria
- [ ] Add a theme toggle button in the navigation bar (light/dark mode).
- [ ] Support system preference detection (`prefers-color-scheme`) by default if no preference is saved.
- [ ] Persist the user's theme selection in `localStorage`.
- [ ] Update UI components (Navbar, Car Cards, Modals, Filter Bar, Backgrounds, Text) to adapt smoothly to dark mode styling with Tailwind CSS.

## Architect Agent: Technical Refinement & Architecture Analysis
- **OpenAPI Contract Compatibility**: 100% compliant. Presentation concern only.
- **Backend Impact**: None. Zero modifications required for Spring Boot.
- **Tailwind Mode**: Enable `darkMode: 'class'` in `frontend/tailwind.config.js`.
- **Anti-FOUC Bootstrapper**: Add script in `frontend/index.html` to check localStorage / system preference and apply `dark` class before React mounts.
- **State Management & Persistence**: Create `useTheme` hook in `frontend/src/hooks/useTheme.js` returning `{ theme, isDark, toggleTheme }`.
- **Component Styling**:
  - `Icons.jsx`: Add `SunIcon` and `MoonIcon`.
  - `Navbar.jsx`: Theme toggle button, styled dark navbar.
  - `App.jsx`: Dark background (`dark:bg-slate-950`), titles, text, modal containers.
  - `FilterBar.jsx`: Dark container, inputs, dropdowns, price slider.
  - `CarCard.jsx`: Dark container, text, badge variants for fuel types.
  - `CarDetailModal.jsx` & `CreateCarModal.jsx`: Dark modal panels, inputs, highlight boxes.
  - `index.css`: Dark scrollbar styles.
- **Verification**: Tests passing and `npm run build` succeeds without errors.
