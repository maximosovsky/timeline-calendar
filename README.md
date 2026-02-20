<div align="center">

# 📅 Timeline Calendar

**The original multi-year calendar generator (2020)**

[![Successor: WallPlan](https://img.shields.io/badge/successor-WallPlan-81D8D0?style=for-the-badge)](https://github.com/maximosovsky/wallplan)
[![Status: Legacy](https://img.shields.io/badge/status-legacy-orange?style=for-the-badge)]()
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC_BY--SA_4.0-lightgrey?style=for-the-badge)](https://creativecommons.org/licenses/by-sa/4.0/)

A browser-based PDF calendar generator with vertical day lists, horizontal Gantt rows, and mini month boxes. Configure duration and locale via URL — get a printable PDF instantly.

</div>

---

> [!IMPORTANT]
> This project is the **legacy version** of [**WallPlan**](https://github.com/maximosovsky/wallplan) — the actively maintained successor with SVG rendering, multiple paper sizes, touch support, custom entries, and a mobile-first UI.
>
> **Use [WallPlan](https://osovsky.com/wallplan/) for all new work.**

---

## 💡 Background

In October 2012, the first multi-year calendar covering two years was [released](https://app.box.com/s/7yqyh8vfphq9hj2lg1jw). The publishing industry mostly makes calendars for just the next year, limiting the ability to plan in detail many years ahead. In 2020, [Michael Kvrivishvili](https://wayfinding.pro/cal/?l=6) — the designer of the official Boston Metro map — developed this service to generate a calendar for any number of months, with configurable Gantt rows.

This **Timeline Calendar** was the first implementation — generating PDF directly in the browser using pdfmake. It later evolved into [WallPlan](https://github.com/maximosovsky/wallplan), which replaced PDF generation with a native SVG renderer, added paper format support, touch gestures, and a full mobile UI.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **PDF output** | Generated entirely in-browser via pdfmake, embedded with PDFObject |
| **Duration** | 1–60 months configurable via URL |
| **Gantt rows** | 5–20 blank planning rows |
| **Vertical calendar** | Day list — number, weekday, holiday labels |
| **Horizontal calendar** | Compact day strip with weekday initials |
| **Box calendar** | Traditional 7-column mini months with ISO week numbers |
| **Localization** | Russian and English (`?l=ru` / `?l=en`) |
| **Russian holidays** | Built-in public holiday labels |
| **IBM Plex Sans** | Embedded font (Regular + SemiBold) |
| **Zero install** | All dependencies loaded from CDN |

---

## 🚀 Quick Start

```bash
npx -y serve -l 3456
# Open http://localhost:3456
```

### URL Parameters

| Param | Default | Description |
|-------|---------|-------------|
| `d` | `3` | Duration in months (1–60) |
| `g` | `10` | Number of Gantt rows (5–20) |
| `l` | `ru` | Locale (`ru` / `en`) |

Example: `http://localhost:3456/?d=12&g=8&l=en` — 12 months, 8 rows, English.

---

## 🏗️ Tech Stack

| File | Purpose |
|------|---------|
| `index.html` | App shell — CDN deps, URL state, PDF embed |
| `js/app.js` | Config, pdfmake styles, document definition |
| `js/helpers.js` | Calendar data builder — widths, rows, day iteration |
| `js/vfs_fonts.js` | IBM Plex Sans virtual filesystem for pdfmake |

See [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details.

---

## 🔄 Timeline Calendar → WallPlan

| | Timeline Calendar (this) | [WallPlan](https://github.com/maximosovsky/wallplan) |
|---|---|---|
| **Renderer** | pdfmake (PDF) | Native SVG |
| **Max duration** | 60 months | 240 months (20 years) |
| **Paper sizes** | Auto-width | A4, A3, 914mm (×1, ×2, ×4) |
| **Mobile** | Basic responsive | Full mobile UI + touch gestures |
| **Custom entries** | ❌ | ✅ (dates, yearly repeat) |
| **Month colors** | ❌ | ✅ (temperature palette) |
| **Export** | PDF only | SVG + PDF |
| **Dependencies** | 5 CDN libs | Zero dependencies |

---

## 📐 Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the data flow, calendar object model, and layout engine documentation.

---

## 🙏 Acknowledgements

- [Michael Kvrivishvili](https://www.linkedin.com/in/michael-kvrivishvili-39ab062/) — designer of the official Boston Metro map, built the calendar generator

---

## 📄 License

© 2020–2026 [Michael Kvrivishvili](https://www.linkedin.com/in/michael-kvrivishvili-39ab062/) & [Maxim Osovsky](https://www.wikidata.org/wiki/Q107189449).
Licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
