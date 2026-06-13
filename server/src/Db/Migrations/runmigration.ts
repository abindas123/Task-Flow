import fs from "fs";
import path from "path";
import { db } from "../../Config/db.js";

async function runMigrations() {
  const migrationsPath = path.join(process.cwd(), "src/Db/Migrations");

  const files = fs
    .readdirSync(migrationsPath)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  try {
    for (const file of files) {
      const filePath = path.join(migrationsPath, file);
      const sql = fs.readFileSync(filePath, "utf-8");

      console.log(`Running migration: ${file}`);
      await db.query(sql);
    }

    console.log("All migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await db.end();
  }
}

runMigrations();