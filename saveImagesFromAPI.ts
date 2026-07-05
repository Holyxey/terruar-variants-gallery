import z from 'zod';
import pLimit from 'p-limit';
import { slugify } from './src/utils/slugify';
import { getS3 } from './src/utils/s3';

if (!process.env.API_KEY) throw '! process.env.API_KEY';

const CategoriesSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  images: z.array(z.string()),
});
const CategoriesSchemaArr = z.array(CategoriesSchema);

let saved = 0;
let skipped = 0;
const limitImages = pLimit(10);
const s3 = getS3();

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

async function saveGalleryToS3(cat: z.infer<typeof CategoriesSchema>) {
  const CATEGORY_NAME = cat.name.split('(')[0]?.trim();
  if (!CATEGORY_NAME) throw "Can't parse category name";
  const slug = slugify(CATEGORY_NAME);

  try {
    const list = await s3.list({ prefix: `${slug}/` });
    const existingKeys = (list.contents || []).map((item) => item.key);
    const activeKeys = new Set<string>();

    const tasks = cat.images.map(async (src, ind) => {
      return limitImages(async () => {
        try {
          const hash = Bun.hash(src).toString().substring(10);

          const index = ind.toString().padStart(3, '0');
          const hqName = `${slug}/${index}-${hash}-hq.webp`;
          const smName = `${slug}/${index}-${hash}-sm.webp`;

          activeKeys.add(hqName);
          activeKeys.add(smName);

          const exists =
            existingKeys.includes(hqName) && existingKeys.includes(smName);

          if (!exists) {
            const req = await fetch(src);
            if (!req.ok) throw new Error(`Failed to fetch image: ${src}`);

            const buffer = await req.arrayBuffer();
            const image = new Bun.Image(buffer);

            const hq = await image
              .resize(1200)
              .webp({ quality: 70 })
              .toBuffer();
            const sm = await image.resize(700).webp({ quality: 70 }).toBuffer();

            await Promise.all([
              s3.write(hqName, hq, { type: 'image/webp' }),
              s3.write(smName, sm, { type: 'image/webp' }),
            ]);
            saved++;
          } else skipped++;
        } catch (error) {
          console.error(error);
          skipped++;
        }
      });
    });

    await Promise.allSettled(tasks);

    const keysToDelete = existingKeys.filter((key) => !activeKeys.has(key));

    if (keysToDelete.length > 0) {
      console.log(
        `Deleting ${keysToDelete.length} obsolete files in ${CATEGORY_NAME}...`,
      );
      const deleteTasks = keysToDelete.map((key) =>
        limitImages(() =>
          s3.delete(key).catch((err) => {
            console.error(`Failed to delete ${key}:`, err);
          }),
        ),
      );
      await Promise.all(deleteTasks);
    }

    console.log(CATEGORY_NAME, '| saved |', cat.images.length);
  } catch (error) {
    const message =
      `${CATEGORY_NAME} | ` +
      (error instanceof Error
        ? JSON.stringify(error.message)
        : '!unhandler error');
    console.error(message, error);
  }
}

export async function saveImagesFromAPI() {
  const cats = await parseCategories();

  console.time('saveImagesFromAPI');

  await Promise.all(
    cats.map(async (cat) => {
      try {
        await saveGalleryToS3(cat);
      } catch (error) {
        const message =
          error instanceof Error ? JSON.stringify(error.message) : '!';
        console.error(message, error);
      }
    }),
  );

  console.timeEnd('saveImagesFromAPI');

  console.log('\n\nSaved', saved);
  console.log('Skipepd (exists)', skipped);
}
