import { db } from "../../Config/db.js";

export async function findUserByEmail(email: string) {
  const result = await db.query(
    `SELECT id, name, email, password_hash
     FROM users
     WHERE email = $1`,
    [email]
  );

  return result.rows[0];
}

export async function createUser(
  name: string,
  email: string,
  passwordHash: string
) {
  const result = await db.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email`,
    [name, email, passwordHash]
  );

  return result.rows[0];
}