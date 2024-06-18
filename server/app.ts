import {Hono} from 'hono';
import { logger } from 'hono/logger';
import { expensesHono } from './routes/expenses';

import { serveStatic } from 'hono/bun';

const app = new Hono();

app.use('*', logger());

app.get('/', (c) => {
    return c.json({
        message: "home page"
    })
})

app.route("/api/expenses", expensesHono)

app.get('/*', serveStatic({ root: './frontend/dist' }))
app.get('/*', serveStatic({ root: './frontend/dist/index.html' }))

export default app;