import { connectionDB } from "../database/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export async function signUp(req, res) {
  const { name, email, password } = res.locals.user;
  const passwordHash = bcrypt.hashSync(password, 10);

  try {
    await connectionDB.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, passwordHash]
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
