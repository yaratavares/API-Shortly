import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const user = "postgres";
const password = "123456";
const host = "localhost";
const port = 5432;
const database = "shortly";

export const connection = new Pool({
  user,
  password,
  host,
  port,
  database,
});

// export const connection = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });
