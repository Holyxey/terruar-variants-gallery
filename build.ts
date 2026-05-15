import { variants, type Variant } from './src/assets/variants';
import { slugify } from './src/utils/slugify';

const ETAG = JSON.stringify(Math.random().toString(36).substring(3));

const start = Bun.nanoseconds();

async function prepareGalleries(variant: Variant) {
  const photos = new Bun.Glob(`./src/assets/photos/${variant.title}/*`);
  const outDir = `${process.env.DIR_PUBLIC}/${variant.slug}`;

  await Bun.$`rm -rf ${outDir} && mkdir -p ${outDir}`;
  let id = 0;

  for await (const filePath of photos.scan('.')) {
    const galleryFiles: string[] = [];

    try {
      const outName = slugify(
        'terruar-' + filePath.split('/')[filePath.split('/').length - 1],
      );
      const hqPath = `${outDir}/${outName}-hq.webp`;
      const smPath = `${outDir}/${outName}-sm.webp`;

      await Bun.file(filePath).image().webp({ quality: 70 }).write(hqPath);
      await Bun.file(filePath)
        .image()
        .resize(700)
        .webp({ quality: 70 })
        .write(smPath);

      console.log(hqPath);
      console.log(smPath);

      galleryFiles.push(hqPath, smPath);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : `!prepare photo for ${variant.title}`;
      console.error(message + error);
    } finally {
      id++;
    }
  }

  console.log('✅ ' + variant.title);
  if (id === 0) {
    throw `Gallery is empty for ${variant.title}`;
  }
}

await Promise.all(variants.map((variant) => prepareGalleries(variant)));

const end = Bun.nanoseconds();
console.log(
  '='.repeat(30) +
    `\nВремя выполнения: ${(end - start) / 1000000} мс\n` +
    '='.repeat(30),
);

async function buildServer() {
  await Bun.build({
    entrypoints: ['./server'],
    outdir: './dist',
    minify: {
      whitespace: true,
      syntax: true,
    },
    banner: '// yurin.dev\n',
    define: { 'process.env.ETAG': ETAG },
    sourcemap: true,
  });

  console.log(`✅ Server built with etag: ${ETAG}`);
}
await buildServer();
