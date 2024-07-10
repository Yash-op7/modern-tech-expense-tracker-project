import { numeric, text, pgTable, serial, index, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from "zod";

export const expenses = pgTable(        // great thing about drizlle is the we are defining the current structure of teh table, we dont have to do CREATE table or ALTER table later on like in SQL, we can just modify this expenses object to become the new state of the db and then you can apply a migration and it will always be whatever we have specified right here and we also get a lot of Typescript safety wiht doing things like this
  "expenses",                           // ONCE YOU SETUP THE DB USING NEON PG, THE DB EXISTS BUT THIS TABLE NEEDS TO MIGRATED INTO THAT DB
  {
    id: serial("id").primaryKey(),      // serial is an auto incrementing integer which works well as a primary key
    userId: text("user_id").notNull(),      // in postgres userId will be user_id
    title: text("title").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    date: date("date").notNull(),
    createdAt: timestamp('created_at').defaultNow()
  },
  (expenses) => {           // this is how you can create indexes! 
    return {                // lets make a userId index because most likely our searches will be based on get me the expenses of this userId
      userIdIndex: index("name_idx").on(expenses.userId),       // boosts perfomance, if you know how you will be accessing data you can set up indexes beforehand
    };
  }
);

// Schema for inserting a user - can be used to validate API requests
export const insertExpensesSchema = createInsertSchema(expenses, {
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" }),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, {message: "Amount must be a valid monetary value"})
});
// Schema for selecting a Expenses - can be used to validate API responses
export const selectExpensesSchema = createSelectSchema(expenses);