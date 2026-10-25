# 📓 Notebook Kanban

**Live website:** [https://notebookanban.netlify.app/](https://notebookanban.netlify.app/)

A Kanban task board that lives inside a battered, well-loved notebook on a desk at midnight.
Sticky-note cards, ruled paper, a red margin line, spiral rings, and a real 3D page flip when
you switch boards or toggle light/dark.

Frontend only. No backend, no API keys, no `.env`. Everything is saved in `localStorage`.

> Built as a college tech-team recruitment project.


## Two versions in this repo

| | Where | What it is |
|---|---|---|
| **React app** | `src/` | The main project: React + Vite, small components, custom hook, touch-friendly drag and drop. |

## Features

### React app
- Multiple boards, each a "notebook page" (Study, Project, Personal by default)
- Three columns per board: To Do, In Progress, Done
- Add, edit and delete notes: title, optional note, priority (High / Medium / Low), optional due date
- Drag cards between and within columns; order is saved. Works with mouse, touch and keyboard
- Search and priority filter (dragging is paused while a filter is active)
- Empty states, a short loading state, and a "Page cleared" message when a column is emptied
- Page-flip animation when switching boards and when toggling light/dark
- Light theme (cream paper) and dark theme (navy paper, chalk ink, lamplight glow, paper grain)
- Handwriting font picker (Caveat, Patrick Hand, Kalam, Gloria Hallelujah)
- Theme follows `prefers-color-scheme` on the first visit, then remembers your choice
- Responsive: open double-page spread on desktop; single page with swipeable columns on mobile
- Keyboard accessible, visible focus states, aria labels, `prefers-reduced-motion` respected
- Live clock with date and a motto, with the day/night switch next to it
- Photo and scribble pad: add a picture, draw on it, pick ink colors, erase, clear (saved locally)
- **Customize** button at the bottom opens a live panel:
  paper, ink, line, margin and note colors (per day/night page), handwriting and body fonts, text and
  heading size, paper style (ruled / grid / dots / plain), desk and ring colors, note tilt, roundness and
  tape, page and column names, and clock options. "Reset all" restores the defaults
- Tap a card's priority chip to cycle priority; tap its note line to write an extra note in place
- Double-click a page tab to rename it
- Drag and drop uses the browser's built-in drag, so it is desktop-only (the React app handles touch)

## Tech stack
- React 18 + Vite
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) for drag and drop
- Plain CSS (variables, 3D transforms, gradients). No Tailwind, no UI library
- Google Fonts: Caveat, Patrick Hand, Kalam, Gloria Hallelujah, Nunito

## Getting started

```bash
git clone <your-repo-url>
cd notebook-kanban
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # production build in dist/
npm run preview    # serve the production build
```


## Project structure

```
notebook-kanban/
├── index.html
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx                All state and actions (single source of truth)
    ├── styles.css             Themes, paper, sticky notes, flip, responsive layout
    ├── components/
    │   ├── FlipPage.jsx       The 3D page flip
    │   ├── BoardTabs.jsx      Notebook page tabs
    │   ├── Toolbar.jsx        Search, priority filter, font picker, theme toggle
    │   ├── Column.jsx         One column + empty / cleared states
    │   ├── TaskCard.jsx       Sticky note + drag handle
    │   └── TaskModal.jsx      Add / edit form
    ├── hooks/useLocalStorage.js
    └── utils/data.js          Seed data, tilt helper, pure moveTask()
```

## How it works

**State.** `App.jsx` keeps `{ boards, activeId }`. Each board holds three arrays of tasks. Every edit goes
through one `patch()` helper that updates the active board's columns, so there is one update path.

**Persistence.** `useLocalStorage(key, initial)` is a drop-in replacement for `useState` that reads on
load and writes on change. Keys: `nb-data`, `nb-theme`, `nb-font`.

**Drag and drop.** `onDragEnd` calls `moveTask()`, a pure function that removes the card from its source
slot and inserts it at the destination. On touch, a short press starts the drag so normal swipes still scroll.

**Page flip.** The real page always renders its new state underneath. On a board or theme change,
`FlipPage` lays a "leaf" showing the old page on top and rotates it 180° around its left edge. Its front face
is the old paper and its back face is the new paper, so the old theme turns over to reveal the new one.
Only `transform` and `opacity` animate, and a shade strip sweeps across for the shadow. With reduced motion,
CSS swaps the rotation for a fade.

**Theming.** Two sets of CSS variables selected by `data-theme`. The theme is set on each page element
(not on the root), which lets the old and new themes appear together mid-flip. Dark mode has its own
palette, lamplight glow and heavier grain rather than an inverted light theme.

**Layout.** The modal and floating add button sit outside the 3D stage, because `perspective` would
otherwise break `position: fixed`.

## Accessibility
Keyboard-operable controls and drag (Space to lift, arrows to move), visible focus rings, aria labels on
icon buttons, 44px minimum touch targets, and reduced-motion support.

## Roadmap
- Port the clock, scribble / photo pad and customization panel into the React app
- Touch drawing polish and photo cropping
- Export / import boards as JSON

## License
MIT. See [LICENSE](LICENSE)
