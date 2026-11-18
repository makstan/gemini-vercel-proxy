export const config = {
  runtime: 'edge',
  // 強制鎖定在美國華盛頓機房執行，確保出口 IP 100% 為美國
  regions: ['iad1'],
};

export default async function handler(req) {
  const url = new URL(req.url);

  // 將 /api/proxy 路徑還原為乾淨的 Google API 路徑，並保留 ?key=... 參數
  const pathname = url.pathname.replace(/^\/api\/proxy/, '');
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
