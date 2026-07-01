import Elysia, { t } from 'elysia';
import cors from '@elysiajs/cors';
import { RedisCache } from './src/utils/redisCache';
import { saveImagesFromAPI } from './saveImagesFromAPI';

const ETAG = process.env.ETAG;

const API_PATH = process.env.DEV
  ? process.env.API_PATH_LOCAL
  : process.env.API_PATH;

if (!ETAG) throw '!ETAG';
if (!API_PATH) throw '!API_PATH';

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

        const list = new Bun.Glob(
          `${process.env.DIR_PUBLIC}/cats/${slug}/*${query?.size ? `${query.size}.webp` : ''}`,
        );
        const arr: string[] = [];

        for await (const filePath of list.scan('.')) {
          arr.push(`${API_PATH}/cats/${slug}/` + filePath.split('/').pop());
        }

        if (!arr.length) return status('Not Found');

        const sorted = arr.sort((a, b) => a.localeCompare(b));
        await cacheInstance.set({ arr: sorted });

        return status(200, arr);
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
  )

  .get('/*', async ({ params, status }) => {
    const path = params['*'];

    try {
      const file = Bun.file(process.env.DIR_PUBLIC + `/${path}`);

      if (await file.exists()) {
        return status(200, file);
      } else {
        return status('Not Found', 'Image is not found');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '!';
      console.error(message + error);

      return status('Internal Server Error', message);
    }
  });

app.onStart(async () => {
  await saveImagesFromAPI();
});

app.listen(3000);
