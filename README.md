# Storyline

A browser-only JSON renderer for annotated timeline/chart stories. This is a fork of Knight Lab's [StorylineJS](https://storyline.knightlab.com) that drops the Google Sheets/CSV/authoring-website dependency in favor of a single stable JSON feed. See [`docs/adr/0001-json-renderer-boundary.md`](docs/adr/0001-json-renderer-boundary.md) for why.

**[Live demo](https://tacman.github.io/storyline/demo/static/index.html)**

## Usage

```js
import { loadStoryline } from './src/index.js';

await loadStoryline('#storyline', './storyline.json');
```

No build step is required to consume the package — it's plain ESM, importable directly (e.g. via Symfony AssetMapper/importmap and jsDelivr). See [`demo/static/index.html`](demo/static/index.html) and [`demo/README.md`](demo/README.md) for a complete no-build example you can run locally.

## JSON contract

The renderer accepts a single JSON object with `title`, `description`, `chart`, `points`, and `cards`. Full field-by-field reference: [`docs/json-contract.md`](docs/json-contract.md).

A host application can produce this JSON from API Platform, a plain controller, or a static file — the browser component doesn't need to know how the feed was produced.

## Developing

See [DEVELOPING.md](DEVELOPING.md) and [DEPLOYING.md](DEPLOYING.md). Note these describe the legacy `website/` authoring-tool build (node-sass, webpack, S3 deploy) inherited from upstream, not the no-build `src/` package described above.

---

## Upstream / legacy: Google Sheets authoring tool

This fork's package no longer talks to Google Sheets, CSV, or Knight Lab's hosted authoring tool — that path is unrelated to the JSON contract above. If you're looking for it:

* Original StorylineJS: https://github.com/NUKnightLab/storyline
* Hosted authoring tool: https://storyline.knightlab.com — lets you build a storyline from a Google Sheet and get an iframe embed. Note that Google decommissioned the API this depended on in September 2020; Knight Lab now proxies Sheets reads through their own servers, which only works for storylines built with their tool and hosted on their systems.
* If you want to self-host without their iframe embeds, upstream's README documents a CSV+JSON `data`/`chart`/`cards` config format — see [NUKnightLab/storyline#roll-your-own](https://github.com/NUKnightLab/storyline#roll-your-own).

ROADMAP
-------
As of September, 2017, upstream StorylineJS was considered ready for general use, with no active roadmap for further development. This fork exists to remove the Sheets dependency for self-hosted, Symfony-friendly use; see the ADR linked above for scope.
