import Elysia from 'elysia';

const PATH = process.env.DEV
  ? 'http://localhost:3000/gallery'
  : process.env.API_PATH;

const app = new Elysia({ prefix: '/gallery' })

  .all('/', ({ status }) => status(200, 'yurin.dev'))

  .get('/vue', () =>
    Bun.file(import.meta.dir + '/./terruar-variants-gallery.iife.js'),
  )

  .get('/list/:slug', async ({ status, params: { slug } }) => {
    const list = new Bun.Glob(`${process.env.DIR_PUBLIC}/${slug}/*`);
    const arr = [];

    for await (const filePath of list.scan('.')) {
      arr.push(
        `${PATH}/${slug}/` +
          filePath.split('/')[filePath.split('/').length - 1],
      );
    }

    if (!arr.length) return status('Not Found');

    status(200, arr);
  })

  .get('/*', async ({ params, status }) => {
    const path = params['*'];
    const file = Bun.file(import.meta.dir + `/./public/${path}`);

    if (await file.exists()) {
      return status(200, file);
    } else return status('Not Found', 'Image is not found');
  });

app.listen(3000);
