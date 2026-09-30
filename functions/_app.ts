export const onRequest: PagesFunction[] = [
  async (context) => {
    const url = new URL(context.request.url);

    // Força content-type para .js, .mjs, .wasm
    if (url.pathname.match(/\.(js|mjs|wasm)$/)) {
      const response = await context.next();
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('Content-Type', 'application/javascript');
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      return newResponse;
    }

    return context.next();
  }
];
