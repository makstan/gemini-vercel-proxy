export const config = {
  runtime: 'edge',
  regions: ['iad1'],
};

export default async function handler(req) {
  const url = new URL(req.url);

  // 移除開頭的 /api 前綴，還原為乾淨的 /v1beta/... 路徑並保留 ?key=... 參數
  const pathname = url.pathname.replace(/^\/api/, '');
  const targetUrl = `https://generativelanguage.googleapis.com${pathname}${url.search}`;

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
