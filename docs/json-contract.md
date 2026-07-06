# Storyline JSON Contract

The renderer accepts a single JSON object.

```json
{
  "title": "Release Readiness",
  "description": "A short optional description.",
  "chart": {
    "yLabel": "Completion"
  },
  "points": [
    { "x": "2026-01-01", "y": 12, "label": "Jan" }
  ],
  "cards": [
    {
      "point": 0,
      "title": "Milestone",
      "text": "What happened at this point."
    }
  ]
}
```

## Fields

- `title`: optional display title.
- `description`: optional supporting text.
- `chart.yLabel`: optional label for the chart value.
- `points`: required non-empty array of timeline points.
- `points[].x`: date string parseable by the browser.
- `points[].y`: numeric value.
- `points[].label`: optional display label.
- `cards`: optional annotations.
- `cards[].point`: zero-based index into `points`.
- `cards[].title`: annotation title.
- `cards[].text`: annotation body.

Symfony applications can expose this shape from API Platform, a controller, or a static asset. The browser component should not need to know how the feed was produced.
