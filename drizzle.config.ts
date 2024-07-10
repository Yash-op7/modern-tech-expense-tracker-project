
import type { Config } from 'drizzle-kit'

export default {
    dialect: "postgresql", // "sqlite" | "mysql"     
    schema: './server/db/schema/*',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    out: './drizzle',
} satisfies Config