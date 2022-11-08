import { Server } from 'bun';
import { route, Router } from './lib/Router';
import { Req2Struct } from './lib/Taco';

async function fetch(this: Server, request: Request, server: Server): Promise<Response> {
  try {
    const struct = Req2Struct(request);
    // const { path, method } = struct;
    // TODO: implement json response here
    return Router(struct);
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

// default port is 3000
const port = process.env.PORT || 3000;

route('GET', '/', (req) => {
  return new Response('slasita');
});

route('GET', /^(\/user\/([^/]+)\/123)$/dgm, (req) => {
  console.log('handler 1');
  const response = new Response(JSON.stringify({ a: 42 }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
  return response;
});

route('GET', '/post', (req) => {
  return new Response('POST === Request');
});

Bun.serve({ fetch, port, development: false });
