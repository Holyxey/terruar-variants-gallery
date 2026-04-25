import Elysia, { t } from 'elysia';
import cors from '@elysiajs/cors';

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

      set.headers['content-type'] = file.type;

      const cache = await Bun.redis.get('vue');

      if (canBeGzip) {
        set.headers['content-encoding'] = 'gzip';
      }

      if (cache) {
        if (canBeGzip) return status(200, Bun.gzipSync(cache));
        return status(200, cache);
      }

      const plain = await file.text();
      await Bun.redis.setex('vue', 60 * 60, plain);

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
      const list = new Bun.Glob(
        `${process.env.DIR_PUBLIC}/${slug}/*${query?.size ? `${query.size}.webp` : ''}`,
      );
      const arr = [];

      for await (const filePath of list.scan('.')) {
        arr.push(
          `${PATH}/${slug}/` +
            filePath.split('/')[filePath.split('/').length - 1],
        );
      }

      if (!arr.length) return status('Not Found');

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
