import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argument = process.argv.indexOf('--port');
const port = Number(argument >= 0 ? process.argv[argument + 1] : process.env.PORT || 4173);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Port invalide.');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png'
};
const server = http.createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    const url = new URL(request.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    // Only public assets are served: never expose .git, source tooling or dependencies.
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const filename = path.resolve(root, relative);
    const allowed = relative === 'index.html' || relative.startsWith('assets/');
    if (
      !allowed ||
      !filename.startsWith(root + path.sep) ||
      relative.split('/').some((part) => part.startsWith('.'))
    ) {
      response
        .writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
        .end('Page introuvable.');
      return;
    }
    const data = await fs.readFile(filename);
    response.writeHead(200, {
      'Content-Type': types[path.extname(filename)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch (error) {
    const malformed = error instanceof URIError || error instanceof TypeError;
    response
      .writeHead(malformed ? 400 : 404, { 'Content-Type': 'text/plain; charset=utf-8' })
      .end(malformed ? 'Requête invalide.' : 'Page introuvable.');
  }
});
server.listen(port, '0.0.0.0', () =>
  console.log(`Les curiosités de Louna — http://0.0.0.0:${port}`)
);
for (const signal of ['SIGTERM', 'SIGINT'])
  process.on(signal, () => server.close(() => process.exit(0)));
