import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const filename = path.join(root, 'index.html');
const html = await readFile(filename, 'utf8');
// The site stays fully static. A changed file gets a new URL instead of reusing a cached script.
const resources =
  /((?:src|href)=")([.]\/assets\/(?:js\/[\w.-]+\.js|styles\.css))(?:\?v=[^"]*)?(")/g;
let updated = html;
for (const [reference, prefix, asset, suffix] of html.matchAll(resources)) {
  const content = await readFile(path.join(root, asset));
  const version = createHash('sha256').update(content).digest('hex').slice(0, 12);
  updated = updated.replace(reference, `${prefix}${asset}?v=${version}${suffix}`);
}

if (process.argv.includes('--check')) {
  if (updated !== html) {
    console.error('Les versions des ressources sont périmées. Lancer npm run version:assets.');
    process.exitCode = 1;
  } else console.log('Les versions des ressources sont à jour.');
} else {
  if (updated !== html) await writeFile(filename, updated);
  console.log('Les URL des scripts et des styles sont à jour dans index.html.');
}
