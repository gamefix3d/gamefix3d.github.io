// Builds each game listed in games.json and writes it to public/games/<id>/, so
// Vite copies it into dist/ with the shell. Each game is cloned by the publish
// workflow into games-src/<id>/ beforehand. Each game is built with VITE_BASE set
// to its own subpath, so asset URLs resolve on Pages.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const { games } = JSON.parse(fs.readFileSync(path.join(root, 'games.json'), 'utf8'));
const out = path.join(root, 'public', 'games');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const game of games) {
  const src = path.join(root, 'games-src', game.id);
  if (!fs.existsSync(src)) throw new Error(`Missing checkout for ${game.id} at ${src}`);
  console.log(`\n== Building ${game.id}`);
  execFileSync('npm', ['ci'], { cwd: src, stdio: 'inherit' });
  execFileSync('npm', ['test'], { cwd: src, stdio: 'inherit' });
  execFileSync('npm', ['run', 'build'], {
    cwd: src,
    stdio: 'inherit',
    env: { ...process.env, VITE_BASE: `/games/${game.id}/` },
  });
  fs.cpSync(path.join(src, 'dist'), path.join(out, game.id), { recursive: true });
}

fs.writeFileSync(path.join(out, 'games.json'), JSON.stringify(games, null, 2));
console.log(`\nBuilt ${games.length} game(s) into public/games`);
