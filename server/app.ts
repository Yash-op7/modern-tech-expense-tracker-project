import {Hono} from 'hono';
import { logger } from 'hono/logger';
import { expensesHono } from './routes/expenses';
import { authRoute } from './routes/auth';

import { serveStatic } from 'hono/bun';

const app = new Hono();

app.use('*', logger());

// app.get('/test', (c) => {
//     return c.json({"message" : "test"});
// })

const apiRoutes = app.basePath("/api").route("/expenses", expensesHono).route("/", authRoute);

app.get('/*', serveStatic({ root: './frontend/dist' }))
app.get('/*', serveStatic({ root: './frontend/dist/index.html' }))

export default app;
export type ApiRoutes = typeof apiRoutes