export interface RequestStruct {
  method: string; // 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS'
  path: string; // /path/to/endpoint
  url: string;
  headers: Record<string, string>;
  params: Record<string, any>; // url wildcard params
  query: Record<string, any>; // query params
  body: Record<string, any>;
}

export function Req2Struct(request: Request): RequestStruct {
  const { searchParams, pathname } = new URL(request.url);
  const headers = getHeader(request);

  return {
    method: request.method,
    path: pathname,
    url: request.url,
    headers: headers,
    params: {},
    query: Object.fromEntries(searchParams.entries()),
    body: {},
  };
}

async function parseBody(request: Request, headers: Record<string, string>) {
  let body: Record<string, string>;
  if (isFormEncode(headers)) {
    const txt = await request.text();
    body = formUrlDecode(txt);
  } else {
    body = await request.json();
  }
  return body;
}

function getHeader(request: Request) {
  return Object.fromEntries(request.headers.entries());
}

function isFormEncode(headers: Record<string, string>) {
  return headers['content-type'] === 'application/x-www-form-urlencoded';
}

function formUrlDecode(txt: string) {
  const url = new URL(`http://localhost?${txt}`);
  return Object.fromEntries(url.searchParams.entries());
}
