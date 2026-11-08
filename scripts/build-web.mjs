// Збирає файли гри в папку www/ — звідти Capacitor бере їх для застосунку iOS та Android.
import { cpSync, mkdirSync, rmSync } from 'node:fs';

const out = 'www';
const files = ['index.html', 'style.css', 'game.js', 'manifest.webmanifest'];
const dirs = ['icons', 'fonts'];

rmSync(out, { recursive: true, force: true });
mkdirSync(out);
for (const f of files) cpSync(f, `${out}/${f}`);
for (const d of dirs) cpSync(d, `${out}/${d}`, { recursive: true });
console.log(`Готово: гру зібрано в ${out}/`);
