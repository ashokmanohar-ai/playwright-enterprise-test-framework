import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const posts: Post[] = [
  { userId: 1, id: 1, title: 'Quality engineering baseline', body: 'Reference contract data.' },
  { userId: 1, id: 2, title: 'Independent test data', body: 'Safe for parallel reads.' },
  { userId: 2, id: 3, title: 'Release confidence', body: 'Evidence drives decisions.' },
];

const users = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  name: `Quality User ${index + 1}`,
  username: `qe-user-${index + 1}`,
  email: `qe-user-${index + 1}@example.test`,
}));

const todos = [
  { userId: 1, id: 1, title: 'Run smoke tests', completed: false },
  { userId: 1, id: 2, title: 'Review quality evidence', completed: true },
  { userId: 2, id: 3, title: 'Approve release gate', completed: true },
];

function json(response: ServerResponse, status: number, value: unknown): void {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'x-request-id': `local-${Date.now()}`,
  });
  response.end(JSON.stringify(value));
}

async function readJson(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk as Uint8Array));
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, unknown>;
}

async function handleRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
  const method = request.method ?? 'GET';
  const url = new URL(request.url ?? '/', 'http://127.0.0.1:4010');

  if (method === 'GET' && url.pathname === '/health') {
    json(response, 200, { status: 'ok' });
    return;
  }

  if (method === 'GET' && url.pathname === '/posts') {
    const userId = url.searchParams.get('userId');
    json(response, 200, userId ? posts.filter((post) => post.userId === Number(userId)) : posts);
    return;
  }

  if (method === 'POST' && url.pathname === '/posts') {
    json(response, 201, { ...(await readJson(request)), id: 101 });
    return;
  }

  const postMatch = url.pathname.match(/^\/posts\/(\d+)$/);
  if (postMatch) {
    const id = Number(postMatch[1]);
    const existing = posts.find((post) => post.id === id);
    if (method === 'GET') {
      json(response, existing ? 200 : 404, existing ?? {});
      return;
    }
    if (method === 'PUT') {
      json(response, 200, { ...(await readJson(request)), id });
      return;
    }
    if (method === 'PATCH') {
      json(response, 200, { ...(existing ?? posts[0]), ...(await readJson(request)), id });
      return;
    }
    if (method === 'DELETE') {
      json(response, 200, {});
      return;
    }
  }

  if (method === 'GET' && url.pathname === '/users') {
    json(response, 200, users);
    return;
  }

  const userMatch = url.pathname.match(/^\/users\/(\d+)$/);
  if (method === 'GET' && userMatch) {
    const user = users.find((item) => item.id === Number(userMatch[1]));
    json(response, user ? 200 : 404, user ?? {});
    return;
  }

  if (method === 'GET' && url.pathname === '/todos') {
    const completed = url.searchParams.get('completed');
    const filtered =
      completed === null
        ? todos
        : todos.filter((todo) => todo.completed === (completed === 'true'));
    json(response, 200, filtered);
    return;
  }

  const todoMatch = url.pathname.match(/^\/todos\/(\d+)$/);
  if (method === 'GET' && todoMatch) {
    const todo = todos.find((item) => item.id === Number(todoMatch[1]));
    json(response, todo ? 200 : 404, todo ?? {});
    return;
  }

  json(response, 404, {});
}

const server = createServer((request, response) => {
  void handleRequest(request, response).catch((error: unknown) => {
    console.error('Local contract API request failed', error);
    if (!response.headersSent) json(response, 500, { error: 'Internal contract service error' });
    else response.end();
  });
});

server.listen(4010, '127.0.0.1', () => {
  console.log('Local contract API listening on http://127.0.0.1:4010');
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
