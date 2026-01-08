# AWARENET Website

Sito web statico multipagina pensato per presentare il network AWARENET, le sue attività di ricerca e i partner coinvolti.

## Struttura del progetto

```
.
├── index.html               # Home page (punto di ingresso)
├── pages                    # Pagine principali del sito
│   ├── research.html
│   ├── team.html
│   ├── news.html
│   └── contact.html
├── events                   # Pagine di dettaglio eventi
│   ├── event-template.html  # Template per nuovi eventi
│   ├── conejo-2026.html
│   └── retreat-2025.html
├── assets
│   ├── css
│   │   ├── styles.css       # File principale (importa i moduli)
│   │   ├── modules/         # CSS base, layout, componenti
│   │   └── pages/           # CSS specifico per pagina
│   ├── js
│   │   ├── main.js          # Script globali
│   │   └── components/      # Web Components (Header.js, Footer.js)
│   └── images               # Immagini, loghi, icone
└── README.md
```

## Pagine disponibili

- **Home (`index.html`)** – Hero principale, link alle sezioni.
- **Pagine (`pages/*.html`)** – Research, Team, News, Contact sono ora raccolte nella cartella `pages`.
- **Eventi (`events/*.html`)** – Le pagine dei singoli eventi si trovano nella cartella `events`. Usa `event-template.html` come base per crearne di nuove.

Tutte le pagine condividono la stessa barra di navigazione responsive (Web Component `<site-header>`) e il footer (`<site-footer>`).

## Stili e risorse condivise

- `assets/css/styles.css` è il file entry-point che importa i moduli da `assets/css/modules/` e `assets/css/pages/`.
- `assets/js/components/` contiene i Web Components per Header e Footer.
- Le sottocartelle di `assets/images` raccolgono segnaposto (es. `placeholders/`) e icone social (`social/`).

## Personalizzazione rapida

1. **Logo e identità** – aggiorna l'immagine in `assets/js/components/Header.js`.
2. **Contenuti** – modifica testi direttamente nei file HTML.
3. **Eventi** – duplica `events/event-template.html` per creare nuove pagine evento e aggiungi il link in `pages/news.html`.
4. **Immagini del team** – carica le foto in `assets/photos_team`.

## Anteprima locale

Dato che il sito utilizza **Web Components** in moduli JavaScript, **non è possibile aprire semplicemente i file HTML** nel browser (l'header e il footer non verrebbero caricati per motivi di sicurezza CORS).

Per visualizzare il sito in locale:

```bash
python3 -m http.server
```

Visitando `http://localhost:8000` potrai navigare tutte le pagine correttamente.

## Pubblicazione su GitHub Pages

Il repository include un workflow GitHub Actions (`.github/workflows/deploy.yml`) che pubblica automaticamente il sito come GitHub Page.

1. Vai su **Settings → Pages** nel repository GitHub.
2. Seleziona **GitHub Actions** come sorgente di pubblicazione.
3. Ogni push su `main` farà partire la pipeline che aggiornerà il sito pubblico.
