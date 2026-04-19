import { join } from 'node:path';

import { build } from 'esbuild';
import { getManifest } from 'workbox-build';

const outDir = 'out';
const swSrc = 'src/service-worker.ts';
const swDest = join(outDir, 'service-worker.js');

async function main() {
  const { manifestEntries, count, size, warnings } = await getManifest({
    globDirectory: outDir,
    // Files copied from public/ (wagon_maps, logos, tiles, locales, etc.) are
    // served via the runtime caching routes in src/service-worker.ts instead.
    globPatterns: ['_next/**/*', '**/*.html'],
    dontCacheBustURLsMatching: /^_next\/static\//i,
  });

  if (warnings.length) {
    for (const w of warnings) console.warn(w);
  }
  console.log(
    `Precaching ${count} entries (${(size / 1024).toFixed(2)} KiB) into ${swDest}`
  );

  await build({
    entryPoints: [swSrc],
    outfile: swDest,
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: 'es2017',
    minify: true,
    sourcemap: true,
    define: {
      'self.__WB_MANIFEST': JSON.stringify(manifestEntries),
    },
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
