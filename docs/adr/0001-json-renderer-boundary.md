# 0001: JSON Renderer Boundary

## Status

Accepted

## Context

The upstream StorylineJS fork mixes several concerns:

- rendering an annotated timeline
- reading Google Sheets or CSV data
- hosting an authoring website
- building browser assets with Webpack

For Symfony projects, the browser component should be installable through AssetMapper/importmap and jsDelivr. A host application can produce JSON with API Platform, a controller, a static file, or another backend path.

## Decision

`@tacman1123/storyline` is a browser-only JSON renderer and a clean replacement package.

The core package accepts a stable JSON feed and renders it. It does not fetch Google Sheets, parse CSV, own authoring workflows, preserve legacy APIs, or require a local Node build in consuming Symfony applications.

The repository keeps a no-build demo under `demo/static/`. The demo reads `storyline.json` and imports the package source directly with native browser modules.

## Consequences

- The package API can be tested and demonstrated without the website.
- Symfony/API Platform integration becomes a producer of the JSON contract.
- A future Symfony UX package can fetch the JSON and instantiate the renderer.
- Legacy Knight Lab website and spreadsheet behavior can be removed as the new JSON renderer takes over.
