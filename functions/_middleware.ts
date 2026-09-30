export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();
  const contentType = response.headers.get('content-type');

  if (context.request.url.includes('/assets/') && context.request.url.endsWith('.js')) {
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('content-type', 'application/javascript; charset=utf-8');
    return newResponse;
  }

  return response;
};
