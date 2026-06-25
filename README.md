# Phoebe & Vale Advisory

A single-page marketing website for **Phoebe & Vale Advisory**, a long-term wealth management firm. Built as a fast, lightweight static site with plain HTML, CSS, and JavaScript — no build step or framework required.

## 🌐 Live Site

**https://haixinni123.github.io/haixinni/**

## ✨ Features

- Responsive, mobile-friendly landing page
- Sections for Home, About, Services, Testimonials, and Contact
- Smooth in-page navigation and interactive UI elements
- Custom typography (Inter + Playfair Display via Google Fonts)
- Zero dependencies — pure HTML/CSS/JS

## 📁 Project Structure

```
.
├── index.html      # Page markup and content
├── styles.css      # All styling
├── script.js       # Interactive behavior
└── .github/
    └── workflows/
        └── deploy.yml   # Auto-deploys to GitHub Pages on push to main
```

## 🚀 Local Development

No tooling needed. Either open the file directly:

```bash
open index.html
```

…or serve it locally (recommended, so paths resolve correctly):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## 📦 Deployment

Deployment is fully automated via **GitHub Actions**. Every push to the `main`
branch triggers the [deploy workflow](.github/workflows/deploy.yml), which
publishes the site to GitHub Pages. No manual steps required.

```bash
git add .
git commit -m "Update site"
git push origin main   # site redeploys automatically
```

## 📄 License

All rights reserved.
