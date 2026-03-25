
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function checkDb() {
  try {
    console.log("Checking database connection...");
    const result = await sql`SELECT 1 as connected`;
    console.log("Database connection successful:", result);

    console.log("Checking for 'sources' table...");
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("Tables in database:", tables.map(t => t.table_name));

    if (tables.some(t => t.table_name === 'sources')) {
      const columns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'sources'
      `;
      console.log("Columns in 'sources' table:", columns);
      
      const count = await sql`SELECT COUNT(*) FROM sources`;
      console.log("Row count in 'sources' table:", count[0].count);
    } else {
      console.log("'sources' table NOT FOUND");
    }

  } catch (error) {
    console.error("Database check failed:", error);
  }
}

checkDb();
