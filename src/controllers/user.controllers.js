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

export async function signIn(req, res) {
  const user = res.locals.user;
  const token = uuidv4();

  try {
    await connectionDB.query(
      'INSERT INTO sessions (token, "userId") VALUES ($1, $2)',
      [token, user.id]
    );
    res.send({ token });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
