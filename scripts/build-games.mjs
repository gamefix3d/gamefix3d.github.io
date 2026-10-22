// Builds each game listed in games.json into public/<id>/, so Vite copies it to
// the site root (https://gamefix3d.github.io/<id>/). The publish workflow clones
// each game into games-src/<id>/ beforehand. Each game is built with VITE_BASE set
// to its own root path so asset URLs resolve.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const { games } = JSON.parse(fs.readFileSync(path.join(root, 'games.json'), 'utf8'));
const publicDir = path.join(root, 'public');
const RESERVED = new Set(['assets', 'games.json', 'index.html']);

for (const game of games) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(game.id)) throw new Error(`Invalid game id: ${game.id}`);
  if (RESERVED.has(game.id)) throw new Error(`Game id collides with a shell path: ${game.id}`);
}

// Only the generated game folders are cleared. Static assets live in static/ and
// are copied in below, so the build never deletes them.
for (const game of games) fs.rmSync(path.join(publicDir, game.id), { recursive: true, force: true });
fs.mkdirSync(publicDir, { recursive: true });
fs.cpSync(path.join(root, 'static'), publicDir, { recursive: true });

for (const game of games) {
  const src = path.join(root, 'games-src', game.id);
  if (!fs.existsSync(src)) throw new Error(`Missing checkout for ${game.id} at ${src}`);
  console.log(`\n== Building ${game.id}`);
  execFileSync('npm', ['ci'], { cwd: src, stdio: 'inherit' });
  execFileSync('npm', ['test'], { cwd: src, stdio: 'inherit' });
  execFileSync('npm', ['run', 'build'], {
    cwd: src,
    stdio: 'inherit',
    env: { ...process.env, VITE_BASE: `/${game.id}/` },
  });
  fs.cpSync(path.join(src, 'dist'), path.join(publicDir, game.id), { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'games.json'), JSON.stringify(games, null, 2));
console.log(`\nBuilt ${games.length} game(s) into the site root`);
