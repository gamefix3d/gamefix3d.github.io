# gamefix3d.github.io

Public app shell for GameFix3D, served at https://gamefix3d.github.io/.

The shell builds each game listed in [games.json](games.json) from its private
repo and publishes it at the site root: `https://gamefix3d.github.io/<id>/`.

## How publishing works

- The [publish workflow](.github/workflows/publish.yml) runs on pushes to `main`,
  on `repository_dispatch` (`game-updated`) and on demand.
- It clones each game with the `GAMES_TOKEN` secret (a fine-grained PAT with
  read-only Contents access to the game repos).
- Each game is built with `VITE_BASE=/<id>/` so its assets resolve from the root.

## Adding a game

1. Add an entry to `games.json` (`id`, `repo`, `ref`, `title`, `blurb`, `accent`, `tags`).
2. Add an illustration template `<template id="art-<id>">` in `index.html`.
3. Make sure the game's `vite.config.js` reads `VITE_BASE`.

## Local development

Keep a `.env` with `GAMES_TOKEN=...` (gitignored) for local builds, then run
`npm run build` after cloning each game into `games-src/<id>/`.
