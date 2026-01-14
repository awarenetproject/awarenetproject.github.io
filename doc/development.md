# Development Guide

Technical documentation for the AWARENET website codebase.

## 1. Architecture Overview

This is a **static website** that uses standard HTML, CSS, and JavaScript.
It leverages **Web Components** for reusable UI parts (Header, Footer) but does not require a build step (bundler) to run locally.

## 2. CSS Architecture

We use a modular CSS approach using `@import`.

*   **Entry Point**: `assets/css/styles.css`
*   **Modules** (`assets/css/modules/`):
    *   `variables.css`: Global CSS variables (colors, spacing, fonts).
    *   `base.css`: Reset and typography defaults.
    *   `layout.css`: Grid/Flexbox containers, responsive wrappers.
    *   `components.css`: Buttons, cards, and other shared UI elements.
*   **Pages** (`assets/css/pages/`):
    *   Specific styles for individual pages (e.g., `home.css`, `contact.css`).

### BEM Convention
We follow a strict **Block Element Modifier (BEM)** naming convention to keep styles isolated and maintainable.
*   Block: `.navbar`
*   Element: `.navbar__link`
*   Modifier: `.navbar__link--active`

## 3. JavaScript & Web Components

### Reusable Components
Located in `assets/js/components/`.
*   `Header.js`: Defines `<site-header>`. Automatically highlights the active page based on the `active-page` attribute.
*   `Footer.js`: Defines `<site-footer>`.

### Global Scripts
*   `assets/js/main.js`: Handles global interactions like:
    *   Mobile menu toggle.
    *   Smooth scrolling for anchor links.
    *   Email copy-to-clipboard functionality.

### Feature Scripts
*   `assets/js/registration.js`: Handles form validation and submission for the event registration page.
*   `assets/js/institutions.js`: Contains the list of universities for the autocomplete feature.

## 4. Local Development

To circumvent CORS issues with ES Modules (used for Web Components), you must serve the files via HTTP.

```bash
# In the project root
python3 -m http.server 8000
```
Visit `http://localhost:8000`.

## 5. Deployment

Deployment is handled via **GitHub Actions**.
*   Workflow file: `.github/workflows/deploy.yml`
*   Trigger: Push to `main` branch.
*   Host: GitHub Pages.
