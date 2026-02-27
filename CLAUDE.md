# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An interactive educational web application (in Spanish) that visualizes AI/ML concepts: token-to-embedding compression, vector distance and search precision, ReAct agent architecture, and infrastructure cost analysis. Designed to help technical teams understand RAG system trade-offs.

## Running Locally

No build process or package manager. Open directly in a browser or serve with a local HTTP server:

```bash
python -m http.server 8000
# Then visit http://localhost:8000
```

## File Structure

- **`index.html`** — Main 4-tab application (Embeddings, Vector Distance, ReAct, Costs)
- **`app.js`** — All interactive logic (~550 lines): tab management, Canvas drawing, SVG path animations, async simulations
- **`styles.css`** — Dark glassmorphism theme, CSS variables, Canvas/SVG/terminal styling
- **`embeddings-react-viz.html`** — Standalone alternative visualization; self-contained, no external JS files

## Architecture

`index.html` loads `app.js` and `styles.css`. `app.js` is structured as a set of `init*()` functions called once per tab:

- **`initTab1()`** — Slider-driven compression funnel; color codes density (green=precise → red=loss) based on tokens/dimensions ratio
- **`initTab2()`** — Canvas 2D visualization; click-to-query points, Euclidean distance calculation, small vs large chunk scenarios
- **`initTab3()`** — Async `runSimulation()` with `animateDot()` for SVG path traversal using `getPointAtLength`; two scenarios (small=success, large=loops)
- **`initTab4()`** — Cost calculation from slider inputs (100M token database baseline); animated meter bars

## Key Design Decisions

- **No frameworks or build tools** — Vanilla JS, CSS, HTML only. No npm, no transpilation.
- **Canvas for 2D plots** — Tab 2 uses Canvas API directly; redraws on every interaction.
- **Inline SVG** — ReAct flow diagram in `index.html` uses inline SVG with `getPointAtLength` for animated dot traversal.
- **Self-contained alt version** — `embeddings-react-viz.html` is intentionally standalone and duplicates some logic.
- **All content in Spanish** — Labels, terminal output, and UI text are in Spanish.

## Theme

CSS variables drive a black/red dark theme (`--accent: #e11d48`). Glassmorphism via `backdrop-filter: blur(16px)` on `.glass-panel`. The standalone HTML uses a different dark blue-cyan palette.
