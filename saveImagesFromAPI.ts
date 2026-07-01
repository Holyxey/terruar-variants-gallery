import z from 'zod';
import pLimit from 'p-limit';
import { slugify } from './src/utils/slugify';

if (!process.env.API_KEY) throw '! process.env.API_KEY';

const CategoriesSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  images: z.array(z.string()),
});
const CategoriesSchemaArr = z.array(CategoriesSchema);

let saved = 0;
const limitImages = pLimit(10);

const headersWithAuth = new Headers();
headersWithAuth.append('Accept', 'application/json');
headersWithAuth.append('Authorization', `Bearer ${process.env.API_KEY}`);

async function parseCategories(): Promise<z.infer<typeof CategoriesSchemaArr>> {
  const requestOptions = {
    method: 'GET',
    headers: headersWithAuth,
  };

  const data = await fetch(
    'https://api.bronirui-online.ru/hotel/v1/hotel/5428/categories',
    requestOptions,
  ).then((response) => response.json());

  const { error, data: categiries } = z.array(CategoriesSchema).safeParse(data);

  if (error) {
    const err = z.prettifyError(error);
    throw "Can't parse categories: " + err;
  } else {
    return categiries;
  }
}

async function prepareImages(args: {
  catName: string;
  hqPath: string;
  smPath: string;
  origBuffer: ArrayBuffer;
}) {
  try {
    const image = new Bun.Image(args.origBuffer);

    await image.resize(1200).webp({ quality: 70 }).write(args.hqPath);
    await image.resize(700).webp({ quality: 70 }).write(args.smPath);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : `!prepare photo for ${args.catName}`;

    console.error(message + error);
  }
}

async function saveGalleryOfCategory(cat: z.infer<typeof CategoriesSchema>) {
  const CATEGORY_NAME = cat.name.split('(')[0]?.trim();
  if (!CATEGORY_NAME) throw "Can't parse category name";
  const slug = slugify(CATEGORY_NAME);

  const start = performance.now();

  const CATEGORY_DIR = `${process.env.DIR_PUBLIC}/${slug}/`;

  await Bun.$`mkdir -p ${CATEGORY_DIR}`;

  let existsCount = 0;
  let savedCount = 0;

  await Promise.all(
    cat.images.map((src, index) =>
      limitImages(async () => {
        const controller = new AbortController();
        const timer = setTimeout(
          () => controller.abort(new Error('Full timeout')),
          10_000,
        );

        try {
          const ind = String(index + 1).padStart(3, '0');
          const hash = Bun.hash(src);
          const hqPath = `${CATEGORY_DIR}/${ind}-${hash}-hq.webp`;
          const smPath = `${CATEGORY_DIR}/${ind}-${hash}-sm.webp`;

          const hqFile = Bun.file(hqPath);
          const smFile = Bun.file(smPath);
          const exists = (await hqFile.exists()) && (await smFile.exists());
          if (!exists) {
            const response = await fetch(src, {
              headers: headersWithAuth,
              signal: controller.signal,
            });

            if (!response.ok) throw new Error('!response.ok');

            const origBuffer = await response.arrayBuffer();
            await prepareImages({
              origBuffer,
              hqPath,
              smPath,
              catName: cat.name,
            });
            savedCount++;
            saved++;
          } else existsCount++;
        } catch (error) {
          const message =
            error instanceof Error
              ? JSON.stringify(error.message)
              : `Can't save photo for ${CATEGORY_NAME}`;

          console.error(index, message);
        } finally {
          clearTimeout(timer);
        }
      }),
    ),
  );

  const end = performance.now();

  const duration = ((end - start) / 1000).toFixed(2);
  console.log(
    CATEGORY_NAME,
    `Saved`,
    savedCount,
    '/',
    cat.images.length,
    `(exists: ${existsCount})`,
    `${duration} sec.`,
  );
  console.log('='.repeat(20) + '\n');
}

export async function saveImagesFromAPI() {
  const cats = await parseCategories();

  console.time('saveImagesFromAPI');

  await Bun.write(
    process.env.DIR_PUBLIC + '/cats.json',
    JSON.stringify(cats, null, 2),
  );

  await Promise.all(
    cats.map(async (cat) => {
      try {
        await saveGalleryOfCategory(cat);
      } catch (error) {
        const message =
          error instanceof Error ? JSON.stringify(error.message) : '!';
        console.error(message, error);
      }
    }),
  );

  console.timeEnd('saveImagesFromAPI');
  console.log('Saved', saved, 'of', cats.flatMap((cat) => cat.images).length);
}
