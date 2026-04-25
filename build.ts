import sharp from 'sharp';
import { variants, type Variant } from './src/assets/variants';
import { slugify } from 'transliteration';

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

      const exif: sharp.Exif = {
        IFD0: {
          ImageDescription: `Глэмпинг Терруар — ${variant.title}`,
          Artist: 'Alex Yurin <contact@yurin.dev>',
          Copyright: 'terruarhome.ru',
          Make: 'Глэмпинг Терруар',
        },
      };

      await sharp(filePath)
        .webp({ quality: 70 })
        .withExifMerge(exif)
        .toFile(hqPath);
      await sharp(filePath)
        .webp({ quality: 70 })
        .resize(700)
        .withExifMerge(exif)
        .toFile(smPath);

      console.log(hqPath);
      console.log(smPath);

      galleryFiles.push(hqPath, smPath);

      console.log('✅ ' + variant.title);
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
  if (id === 0) {
    throw `Gallery is empty for ${variant.title}`;
  }
}
await Promise.all(variants.map(async (variant) => prepareGalleries(variant)));

async function buildServer() {
  await Bun.build({
    entrypoints: ['./server'],
    outdir: './dist',
  });
}

await buildServer();
