# Architecture

**Timeline Calendar** is a client-side PDF calendar generator that runs entirely in the browser. It reads configuration from URL query parameters, builds a calendar data structure, and renders it as a PDF document inline using pdfmake.

## Data Flow

```
URL query params ──→ query-state ──→ glosets config
                                          │
                                          ▼
                                    Day.js locale
                                          │
                                          ▼
                               helpers.getCalObject()
                                          │
                                          ▼
                                   pdfmake.createPdf()
                                          │
                                          ▼
                                  PDFObject.embed() ──→ Browser PDF viewer
```

## File Structure

```
index.html          Entry point — loads CDN deps, reads URL params, embeds PDF
js/
  app.js            Main application — config, styles, pdfmake document definition
  helpers.js        Calendar object builder — column widths, row generation
  vfs_fonts.js      IBM Plex Sans (Regular + SemiBold) embedded as virtual file system
```

## Configuration (`glosets`)

The global settings object controls the entire calendar layout:

| Property | Description |
|----------|-------------|
| `locale` | Display language (`ru` / `en`) |
| `start` | First day of first month (auto-set to current month) |
| `months` | Calendar duration in months (1–60) |
| `noteLines` | Number of blank Gantt-style rows (5–20) |
| `widths.*` | Page margins, column widths, line thicknesses |
| `ru.holidays` | Russian public holidays (date → name map) |

URL parameters: `?d=3&g=10&l=ru` (duration, gantt rows, locale).

## Calendar Object Model

`helpers.getCalObject()` returns an object with seven row arrays — one per visual section:

| Row | Content |
|-----|---------|
| `rowYears` | Year headers with `colSpan` merging |
| `rowMonthNames` | Localized month names |
| `rowVertCal` | Vertical day list — day number, weekday, holiday label |
| `rowHorCal` | Horizontal compact day strip — weekday initial + day number |
| `rowNotelines` | Blank lined rows for planning/notes |
| `rowBoxCal` | Traditional 7-column mini calendar with ISO week numbers |
| `rowCopy` | Footer copyright |

Each month column width is determined by days count: 31-day months get `colMainWide`, February gets `colMainNarr`.

## Layout Engine

pdfmake table layouts control borders, padding, and line styles:

| Layout | Purpose |
|--------|---------|
| `mainLayout` | Outer table — thick vertical dividers, no horizontal lines |
| `vertMonthCal` | Vertical day list — thin inner lines, dashed horizontals |
| `horMonthCal` | Horizontal day strip — thin dashed verticals |
| `horNoteLines` | Note rows — horizontal lines only |
| `boxMonthCal` | Mini month box — top border only |

## Dependencies

| Library | Version | Purpose |
|---------|---------|---------|
| [pdfmake](https://pdfmake.org/) | 0.2.4 | Client-side PDF generation |
| [Day.js](https://day.js.org/) | 1.10.7 | Date manipulation + locale |
| [Lodash](https://lodash.com/) | 4.17.21 | Utility functions (`clone`, `startCase`, `times`) |
| [PDFObject](https://pdfobject.com/) | 2.2.7 | Embed PDF in page |
| [query-state](https://github.com/anvaka/query-state) | 4.0.0 | Sync state with URL query string |

All loaded from CDN. Font files (IBM Plex Sans) are bundled in `vfs_fonts.js`.
