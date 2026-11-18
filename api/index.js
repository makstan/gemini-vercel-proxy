export const config = {
  runtime: 'edge',
  regions: ['iad1'],
};

export default async function handler(req) {
  const url = new URL(req.url);

  // Rewrite 模式下，url.pathname 會完整保留原始請求路徑（例如 / 或 /v1beta/models/...）
  const targetUrl = `https://generativelanguage.googleapis.com${url.pathname}${url.search}`;

  const headers = new Headers(req.headers);
  headers.set('Host', 'generativelanguage.googleapis.com');
  headers.delete('x-forwarded-for');
  headers.delete('x-real-ip');
  headers.delete('x-vercel-ip-country');
  headers.delete('x-vercel-forwarded-for');

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : null,
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.set('Access-Control-Allow-Origin', '*');

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}
