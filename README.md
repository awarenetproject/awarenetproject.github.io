# AWARENET Website

Static multi-page website designed to present the AWARENET network, its research activities, and involved partners.

**Live Website:** [https://awarenetproject.github.io](https://awarenetproject.github.io)

## Project Structure

```
.
├── index.html               # Home page (entry point)
├── pages                    # Main site pages
│   ├── research.html
│   ├── team.html
│   ├── news.html
│   └── contact.html
├── events                   # Event detail pages
│   ├── event-template.html  # Template for new events
│   ├── cnj-2026.html
│   └── retreat-2025.html
├── assets
│   ├── css
│   │   ├── styles.css       # Main file (imports modules)
│   │   ├── modules/         # Base CSS, layout, components
│   │   └── pages/           # Page-specific CSS
│   ├── js
│   │   ├── main.js          # Global scripts
│   │   └── components/      # Web Components (Header.js, Footer.js)
│   └── images               # Images, logos, icons
└── README.md
```

## Available Pages

- **Home (`index.html`)** – Main hero, links to sections.
- **Pages (`pages/*.html`)** – Research, Team, News, Contact are now collected in the `pages` folder.
- **Events (`events/*.html`)** – Single event pages are located in the `events` folder. Use `event-template.html` as a base to create new ones.

All pages share the same responsive navigation bar (Web Component `<site-header>`) and footer (`<site-footer>`).

## Shared Styles and Resources

- `assets/css/styles.css` is the entry-point file that imports modules from `assets/css/modules/` and `assets/css/pages/`.
- `assets/js/components/` contains the Web Components for Header and Footer.
- `assets/images` subfolders collect placeholders (e.g., `placeholders/`) and social icons (`social/`).

## Rapid Customization

1. **Logo and identity** – update the image in `assets/js/components/Header.js`.
2. **Content** – edit texts directly in the HTML files.
3. **Events** – duplicate `events/event-template.html` to create new event pages and add the link in `pages/news.html`.
4. **Team images** – upload photos to `assets/photos_team`.

## Local Preview

Since the site uses **Web Components** in JavaScript modules, **you cannot simply open HTML files** in the browser (the header and footer would not load due to CORS security reasons).

To view the site locally:

```bash
python3 -m http.server
```

By visiting `http://localhost:8000` you will be able to navigate all pages correctly.

## GitHub Pages Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically publishes the site as a GitHub Page.

1. Go to **Settings → Pages** in the GitHub repository.
2. Select **GitHub Actions** as the publication source.
3. Every push to `main` will trigger the pipeline that updates the public site.

**Deployment URL:** [https://awarenetproject.github.io](https://awarenetproject.github.io)
