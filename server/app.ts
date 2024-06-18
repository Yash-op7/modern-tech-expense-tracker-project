// import {Hono} from 'hono';
// import { logger } from 'hono/logger';
// import { expensesHono } from './routes/expenses';

// import { serveStatic } from 'hono/bun';

// const app = new Hono();

// app.use('*', logger());



// app.route("/api/expenses", expensesHono)

// app.get('/*', serveStatic({ root: './frontend/dist' }))
// app.get('/*', serveStatic({ root: './frontend/dist/index.html' }))

// export default app;

import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { expensesHono } from './routes/expenses';
import { serveStatic } from 'hono/bun';
import fs from 'fs';
import path from 'path';

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const app = new Hono();

app.use('*', logger());


app.route("/api/expenses", expensesHono);

import { Glob } from "bun";

const glob = new Glob("*/*");

for (const file of glob.scanSync(".")) {
    console.log(file);
}


app.use('/*', async (c, next) => {
  const requestedPath = c.req.path;
  const absolutePath = path.resolve('./frontend/dist', requestedPath);
  console.log(`Attempting to serve static file: ${requestedPath}`);
  console.log(`Resolved absolute path: ${absolutePath}`);

  // Check if the file exists
  if (!fs.existsSync(absolutePath)) {
    console.error(`File not found: ${absolutePath}`);
  }

  return next();
});

// Serve static files from frontend/dist
app.get('/*', serveStatic({ root: './frontend/dist' }));

// Serve index.html for SPA fallback
app.get('/*', async (c) => {
  const indexPath = path.resolve('./frontend/dist/index.html');
  console.log(`Serving fallback index.html from: ${indexPath}`);

  // Check if index.html exists
  if (!fs.existsSync(indexPath)) {
    console.error(`Fallback index.html not found: ${indexPath}`);
    return c.text('Fallback index.html not found', 404);
  }

  await c.sendFile('./frontend/dist/index.html');
});

export default app;

