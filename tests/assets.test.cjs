const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const resources = [...html.matchAll(/(?:src|href)="([^"\s]+\.(?:js|css)(?:\?[^"\s]*)?)"/g)].map(
  (match) => match[1]
);

test('les scripts et styles sont versionnés selon leur contenu, sans réutiliser les anciennes URL', () => {
  assert.equal(resources.length, 5);
  for (const resource of resources) {
    const url = new URL(resource, 'https://example.test/ecole/');
    const content = fs.readFileSync(path.join(root, resource.split('?')[0]));
    const expected = createHash('sha256').update(content).digest('hex').slice(0, 12);
    assert.equal(
      url.searchParams.get('v'),
      expected,
      `${resource} : exécuter npm run version:assets après modification du fichier.`
    );
  }
});

test('les ressources versionnées restent locales et fonctionnent dans le sous-dossier du site', () => {
  for (const resource of resources) {
    assert.ok(resource.startsWith('./assets/'));
    const url = new URL(resource, 'https://example.test/ecole/');
    assert.equal(url.origin, 'https://example.test');
    assert.ok(url.pathname.startsWith('/ecole/assets/'));
  }
  const scripts = [...html.matchAll(/<script\b[^>]+>/g)].map((match) => match[0]);
  assert.equal(scripts.length, 4);
  for (const script of scripts) assert.match(script, /\sdefer(?:\s|>)/);
});
