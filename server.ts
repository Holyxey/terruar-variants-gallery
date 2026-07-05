import Elysia, { t } from 'elysia';
import cors from '@elysiajs/cors';
import { RedisCache } from './src/utils/redisCache';
import { saveImagesFromAPI } from './saveImagesFromAPI';
import { getS3 } from './src/utils/s3';

const ETAG = process.env.ETAG;
const API_PATH = process.env.API_PATH;
const s3 = getS3();

if (!ETAG) throw '!ETAG';
if (!API_PATH) throw '!API_PATH';

await saveImagesFromAPI();

const app = new Elysia({ prefix: '/gallery' })
  .use(cors())
  .all('/', ({ status }) => status(200, 'yurin.dev'))

  // ===== ETAG & Cache Headers ===== //
  .onBeforeHandle(({ set, headers, status }) => {
    set.headers['etag'] = ETAG;
    set.headers['cache-control'] = 'public, max-age=31536000, immutable';
    set.headers['expires'] = new Date(Date.now() + 31536000000).toUTCString();

    if (headers['if-none-match'] === ETAG) return status('Not Modified');
  })

  .get('/vue', async ({ status, set, headers }) => {
    try {
      const file = Bun.file(
        import.meta.dir + '/terruar-variants-gallery.iife.js',
      );

      const canBeGzip = headers['accept-encoding']?.includes('gzip');
      const cacheInstance = new RedisCache(
        'gallerySlug',
        'vue' + ETAG,
        t.Object({ plain: t.String() }),
      );

      set.headers['content-type'] = file.type;

      const cache = await cacheInstance.get();

      if (canBeGzip) {
        set.headers['content-encoding'] = 'gzip';
      }

      if (cache.value) {
        if (canBeGzip) return status(200, Bun.gzipSync(cache.value.plain));
        return status(200, cache);
      }

      if (!(await file.exists())) return status('Not Found');

      const plain = await file.text();
      await cacheInstance.set({ plain });

      if (canBeGzip) return status(200, Bun.gzipSync(plain));
      return status(200, plain);
    } catch (error) {
      const message = error instanceof Error ? error.message : '/vue';
      console.error(message + error);

      return status('Internal Server Error', message);
    }
  })

  .get(
    '/list/:slug',
    async ({ status, params: { slug }, query }) => {
      try {
        const cacheKey = slug + query.size + ETAG;
        const cacheInstance = new RedisCache(
          'gallerySlug',
          cacheKey,
          t.Object({ arr: t.Array(t.String()) }),
        );
        const cache = await cacheInstance.get();

        if (cache.value) return status(200, cache.value.arr);

        const list = await s3.list({ prefix: `${slug}/` });
        const images = list.contents
          ?.map((c) => `${process.env.S3_ENDPOINT}/variants/${c.key}`)
          .filter((key) => (query.size ? key.includes(query.size) : key));

        if (!images?.length) return status('Not Found');

        const sorted = images.sort((a, b) => a.localeCompare(b));
        await cacheInstance.set({ arr: sorted });

        return status(200, sorted);
      } catch (error) {
        const message =
          error instanceof Error ? JSON.stringify(error.message) : '!';
        console.error(message, error);

        return status('Internal Server Error', message);
      }
    },
    {
      query: t.Object({
        size: t.Optional(t.Union([t.Literal('hq'), t.Literal('sm')])),
      }),
    },
  );

app.listen(3000);
