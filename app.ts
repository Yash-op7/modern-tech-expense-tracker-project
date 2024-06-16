import {Hono} from 'hono';

const app = new Hono();

app.get("/test", c => {
    return c.json({"message":"response to test endpoint"})
}
);

export default app;