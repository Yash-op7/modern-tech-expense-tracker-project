import {Hono} from 'hono';
import { logger } from 'hono/logger';
import { expensesHono } from './routes/expenses';

const app = new Hono();

app.use('*', logger());

app.get("/test", c => {
    return c.json({"message":"response to test endpoint"})
}
);

app.route("/api/expenses", expensesHono)

export default app;