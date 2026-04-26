import Elysia, { t } from 'elysia';
import cors from '@elysiajs/cors';
import { RedisCache } from './src/utils/redisCache';

const PATH = process.env.DEV
  ? 'http://localhost:3000/gallery'
  : process.env.API_PATH;

const app = new Elysia({ prefix: '/gallery' })

  .use(cors())
  .all('/', ({ status }) => status(200, 'yurin.dev'))

  .get('/vue', async ({ status, set, headers }) => {
    try {
      const file = Bun.file(
        import.meta.dir + '/./terruar-variants-gallery.iife.js',
      );
      const canBeGzip = headers['accept-encoding']?.includes('gzip');
      const cacheInstance = new RedisCache(
        'gallerySlug',
        'vue',
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

      const plain = await file.text();
      await cacheInstance.set({ plain });

      if (canBeGzip) return status(200, Bun.gzipSync(plain));
      return status(200, plain);
    } catch (error) {
      const message = error instanceof Error ? error.message : '!';
      console.error(message + error);
    }
  })

  .get(
    '/list/:slug',
    async ({ status, params: { slug }, query }) => {
      const cacheKey = slug + query.size;
      const cacheInstance = new RedisCache(
        'gallerySlug',
        cacheKey,
        t.Object({ arr: t.Array(t.String()) }),
      );
      const cache = await cacheInstance.get();
      if (cache.value) return status(200, cache.value.arr);

      const list = new Bun.Glob(
        `${process.env.DIR_PUBLIC}/${slug}/*${query?.size ? `${query.size}.webp` : ''}`,
      );
      const arr: string[] = [];

      for await (const filePath of list.scan('.')) {
        arr.push(
          `${PATH}/${slug}/` +
            filePath.split('/')[filePath.split('/').length - 1],
        );
      }

      if (!arr.length) return status('Not Found');

      const sorted = arr.sort((a, b) => a.localeCompare(b));
      await cacheInstance.set({ arr: sorted });
      return status(200, arr);
    },
    {
      query: t.Optional(
        t.Object({
          size: t.Union([t.Literal('hq'), t.Literal('sm')]),
        }),
      ),
    },
  )

  .get('/*', async ({ params, status }) => {
    const path = params['*'];
    const file = Bun.file(import.meta.dir + `/./public/${path}`);

    if (await file.exists()) {
      return status(200, file);
    } else return status('Not Found', 'Image is not found');
  });

app.listen(3000);
