# gamefix3d.github.io

Public app shell for GameFix3D, served at https://gamefix3d.github.io/.

The shell builds each game listed in [games.json](games.json) from its private
repo and publishes everything to GitHub Pages. Games live at `/games/<id>/`.

## How publishing works

- The [publish workflow](.github/workflows/publish.yml) runs on pushes to `main`,
  on `repository_dispatch` (`game-updated`) and on demand.
- It clones each game using the `GAMES_TOKEN` secret (a fine-grained PAT with
  read access to the game repos).
- Each game is built with `VITE_BASE=/games/<id>/`, then the output is published.

## Adding a game

1. Add an entry to `games.json` with its repo, ref, title and blurb.
2. Make sure the game's `vite.config.js` reads `VITE_BASE`.
