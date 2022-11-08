// follow a compact regex pattern from:
// https://www.npopov.com/2014/02/18/Fast-request-routing-using-regular-expressions.html

import { RequestStruct } from './Taco';

// URL path to regex examples
// /users/:id => /users/([^\/]+)
// /users/:id/comments => /users/([^\d]+)/comments
// /posts/:id/comments/:commentId => /posts/([^\/]+)/comments/([^\/]+)

type routeHandler = (req: RequestStruct) => Response;

const Routes = new Map<RegExp, [string, routeHandler]>();

export function route(method: string, regexPath: RegExp | string, handler: routeHandler) {
  let rgx: RegExp;
  if (typeof regexPath === 'string') {
    rgx = pathToRegex(regexPath);
  } else {
    rgx = regexPath;
  }

  Routes.set(rgx, [method, handler]);
}

// getHandler({ method: 'GET', path: '/user/juan/123' });
// get all regex routes and check which one matches the request url and return the handler
function getHandler(req: RequestStruct) {
  const allRoutes = Array.from(Routes.keys());
  const match = allRoutes.find((rgx) => rgx.test(req.path));
  return match ? Routes.get(match) : undefined;
}

// TODO: implement params and query, from bun request struct
export const Router = (req: RequestStruct) => {
  const handler = getHandler(req);
  if (handler) {
    const [method, fn] = handler;
    if (method === req.method) {
      return fn(req);
    }
  }
};

// pathToRegex function check is slug is string or number and return the correct regex
// use :[any string] for string slug
// use :# for number slug
// pathToRegex('/users/:id') => ^/^users/([^\/]+)$
// pathToRegex('/users/:#') => ^/users/(\d+)$
function pathToRegex(path: string) {
  // check if path includes numeric slug
  const hasNumberSlug = path.includes(':#');
  let regexPath = path;
  if (hasNumberSlug) {
    // replace numeric slug with regex
    regexPath = path.replace(/:#/g, '(\\d+)');
  } else {
    // replace string slug with regex
    regexPath = path.replace(/:[^/]+/g, '([^/]+)');
  }

  return new RegExp(`^${regexPath}$`, 'dgm');
}
