import Elysia, { t } from 'elysia';
import cors from '@elysiajs/cors';
import { RedisCache } from './src/utils/redisCache';

const eTag = process.env.ETAG;

const PATH = process.env.DEV
  ? 'http://localhost:3000/gallery'
  : process.env.API_PATH;

if (!eTag) throw '!eTag';

const app = new Elysia({ prefix: '/gallery' })

  .use(cors())
  .all('/', ({ status }) => status(200, 'yurin.dev'))

  .get('/vue', async ({ status, set, headers }) => {
    try {
      const file = Bun.file(
        import.meta.dir + '/./terruar-variants-gallery.iife.js',
      );

      // ===== ETAG
      set.headers['etag'] = eTag;
      if (headers['if-none-match'] === eTag) return status('Not Modified');
      // ===== ETAG

      const canBeGzip = headers['accept-encoding']?.includes('gzip');
      const cacheInstance = new RedisCache(
        'gallerySlug',
        'vue' + eTag,
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
    async ({ status, set, headers, params: { slug }, query }) => {
      const cacheKey = slug + query.size + eTag;
      const cacheInstance = new RedisCache(
        'gallerySlug',
        cacheKey,
        t.Object({ arr: t.Array(t.String()) }),
      );
      const cache = await cacheInstance.get();
      if (cache.value) return status(200, cache.value.arr);

      // ===== ETAG
      set.headers['etag'] = eTag;
      if (headers['if-none-match'] === eTag) return status('Not Modified');
      // ===== ETAG

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

  .get('/*', async ({ set, headers, params, status }) => {
    const path = params['*'];
    const file = Bun.file(import.meta.dir + `/./public/${path}`);

    // ===== ETAG
    set.headers['etag'] = eTag;
    if (headers['if-none-match'] === eTag) return status('Not Modified');
    // ===== ETAG

    if (await file.exists()) {
      return status(200, file);
    } else return status('Not Found', 'Image is not found');
  });

app.listen(3000);
