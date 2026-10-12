export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const imageTypes = {webp:'image/webp',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',svg:'image/svg+xml',gif:'image/gif',avif:'image/avif',ico:'image/x-icon'};
    const extension = new URL(request.url).pathname.split('.').pop().toLowerCase();
    if (response.ok && imageTypes[extension]) {
      const headers = new Headers(response.headers);
      headers.set('content-type', imageTypes[extension]);
      return new Response(response.body, {status:response.status,statusText:response.statusText,headers});
    }
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
      return response;
    }

    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = "";
    return env.ASSETS.fetch(new Request(indexUrl, request));
  },
};
