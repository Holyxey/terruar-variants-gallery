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

async function prepareImage(path: string, buffer: ArrayBuffer) {
  try {
    const hqPath = `${path}-hq.webp`;
    const smPath = `${path}-sm.webp`;

    const image = new Bun.Image(buffer);

    await image.resize(1200).webp({ quality: 70 }).write(hqPath);
    await image.resize(700).webp({ quality: 70 }).write(smPath);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : `!prepare photo for ${path}`;

    console.error(message + error);
  }
}

async function saveGalleryOfCategory(cat: z.infer<typeof CategoriesSchema>) {
  const CATEGORY_NAME = cat.name.split('(')[0]?.trim();
  if (!CATEGORY_NAME) throw "Can't parse category name";
  const slug = slugify(CATEGORY_NAME);

  const start = performance.now();

  const CATEGORY_DIR = `${process.env.DIR_PUBLIC}/${slug}/`;

  await Bun.$`rm -rf ${CATEGORY_DIR} && mkdir -p ${CATEGORY_DIR}`;

  let i = 0;

  await Promise.all(
    cat.images.map((src, index) =>
      limitImages(async () => {
        const controller = new AbortController();
        const timer = setTimeout(
          () => controller.abort(new Error('Full timeout')),
          10_000,
        );

        try {
          const response = await fetch(src, {
            headers: headersWithAuth,
            signal: controller.signal,
          });

          if (!response.ok) throw new Error('!response.ok');

          const buffer = await response.arrayBuffer();

          const format = new URL(src).pathname.split('.').pop();
          const filename = String(index + 1).padStart(3, '0');
          const filePath = `${CATEGORY_DIR}/${filename}.${format}`;
          await prepareImage(filePath, buffer);
          i++;
          saved++;
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
    i,
    '/',
    cat.images.length,
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
