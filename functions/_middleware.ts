export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);

  // Se for um arquivo .js, força o content-type correto
  if (url.pathname.endsWith('.js')) {
    const response = await context.next();
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Content-Type', 'application/javascript');
    return newResponse;
  }

  return context.next();
};
