import {Pool} from "pg";
import {drizzle} from "drizzle-orm/node-postgres";
import { users } from "./schema";

const pool = new Pool({
    connectionString: "postgresql://postgres:pass123@db:5432/mydb",
});

export const db = drizzle(pool, {schema: {users}});

