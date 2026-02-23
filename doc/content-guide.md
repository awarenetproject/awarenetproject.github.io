# Content Update Guide

This guide explains how to update the main content of the AWARENET website.

## 1. Adding News Items

News are currently listed in `pages/news.html`.

1.  Open `pages/news.html`.
2.  Locate the `<div class="news-grid">`.
3.  Copy an existing `<article class="news-card">` block.
4.  Paste it at the beginning of the grid (to show it first).
5.  Update the content:
    *   **Image**: Update the `src` attribute of the `<img>` tag.
    *   **Category**: Update the text inside `<span class="news-card__category">`.
    *   **Date**: Update `<time>`.
    *   **Title**: Update the `<h3>` content and the `<a>` link.
    *   **Excerpt**: Update the `<p>` tag.

## 2. Creating a New Event Page

1.  Duplicate the file `events/event-template.html` and rename it (e.g., `events/my-new-event.html`).
2.  Open the new file and update:
    *   `<title>` tag in the `<head>`.
    *   `<h1>` title inside `main`.
    *   Event details (Date, Time, Location).
    *   Registration button link (if applicable).
    *   Program section.
3.  **Important**: If the event has a specific registration form, you might need a separate registration page (like `cnj-register.html`).

## 3. Adding a Team Member

1.  Add the photo to `assets/images/team/`. Suggest using a square aspect ratio.
2.  Open `pages/team.html`.
3.  Locate the appropriate group (e.g., "Principal Investigators", "Postdocs").
4.  Copy an existing `<li>` block containing a `.team-card`.
5.  Update:
    *   **Image**: `src` attribute.
    *   **Name**: `<h3>` tag.
    *   **Role**: `<p class="team-card__role">`.
    *   **Social Links**: Update `href` attributes for Mail, Twitter/X, Google Scholar, etc.

## 4. Updates Flow

After making changes locally:
1.  Test the changes by running `python3 -m http.server` and visiting `http://localhost:8000`.
2.  Commit and push changes to the `main` branch.
3.  The site will automatically update on `https://awarenetproject.github.io`.
