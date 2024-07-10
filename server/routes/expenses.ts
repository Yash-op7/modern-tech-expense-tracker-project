import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from 'zod'
import { getUser } from "../kinde";

import { db } from "../db";
import { expenses as expenseTable } from "../db/schema/expenses";
import { eq } from "drizzle-orm";

// type 
const expenseSchema = z.object({
    id: z.number().int().positive().min(1),
    title: z.string().min(3).max(100),
    amount: z.number().int().positive()
})

type Expense = z.infer<typeof expenseSchema>
    
const fakeExpenses: Expense[] = [               // a temporary database for now
    { id:1, title:"Groceries", amount:50 },
    { id:2, title:"Utilities", amount:100 },
    { id:3, title:"Rent", amount:1000 },
]

const createPostSchema = expenseSchema.omit({id: true})

export const expensesHono = new Hono()              // the api defined on the route in index: /api/expenses
.get("/", getUser, async (c) => {                            // ! gets all expenses
    const user = c.var.user;
    
    const expenses = await db.select().from(expenseTable).where(eq(expenseTable.userId, user.id))

    return c.json({ expenses: fakeExpenses })
})
.post("/", getUser, zValidator("json", createPostSchema), async (c) => {         // add zod alidator as middleware to validate the input to have the correct schema 
    const user = c.var.user;
    const expense = await c.req.valid("json")

    const result = db.insert(expenseTable).values({
        ...expense,
        userId: user.id
    }).returning()

    // fakeExpenses.push({...expense, id:fakeExpenses.length + 1})         // ! adds a new expense to our db
    c.status(201)
    return c.json(result)
})
.get("/total-spent", getUser, c => {
    const total =  fakeExpenses.reduce((acc, expense) => acc + expense.amount, 0);
    return c.json({total}); 
})
.get("/:id{[0-9]+}", getUser, c => {                 // ! fetches a particular expense by id, expecting any integer in the url to be directed to this route, thats why the regex is used
    const id = Number.parseInt(c.req.param("id"));
    const expense = fakeExpenses.find(expense => expense.id === id) 
    if(!expense) {
        return c.notFound()
    }
    return c.json(expense)
})
.delete("/:id{[0-9]+}", getUser, c => {                 // ! fetches a particular expense by id, expecting any integer in the url to be directed to this route, thats why the regex is used
    const id = Number.parseInt(c.req.param("id"));
    const index = fakeExpenses.findIndex(expense => expense.id === id) 
    if(index == -1) {
        return c.notFound()
    }
    const deletedExpense = fakeExpenses.splice(index, 1)[0];
    return c.json({expense:fakeExpenses});
})
// .put