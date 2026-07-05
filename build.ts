const ETAG = JSON.stringify(Math.random().toString(36).substring(3));
const API_PATH = process.env.API_PATH;

async function buildServer() {
  await Bun.build({
    entrypoints: ['./server'],
    outdir: 'dist/',
    minify: { whitespace: true, syntax: true },
    banner: `// yurin.dev | ${ETAG}\n`,
    define: {
      'process.env.ETAG': ETAG,
      'process.env.API_PATH': JSON.stringify(API_PATH),
    },
    sourcemap: true,
  });

  console.log('_'.repeat(20), `\n✅ Server built with etag: ${ETAG}`);

  if (process.env.DEV) {
    console.log(
      '\n',
      '='.repeat(20),
      '\nWARNING\n',
      'DEVMODE\n',
      '='.repeat(20),
      '\n',
    );
  }
}

await buildServer();
