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

export async function findShortsUrlsMe(req, res) {
  const userId = res.locals.userId;

  try {
    const { rows } = await connectionDB.query(
      "SELECT id, name FROM users WHERE id = $1",
      [userId]
    );

    console.log(rows);

    if (rows.length === 0) {
      return res.sendStatus(404);
    }

    const totalVisitCount = await connectionDB.query(
      'SELECT SUM("visitCount") FROM shorts WHERE "userId" = $1',
      [userId]
    );

    //console.log(totalVisitCount.rows[0].sum);

    const shortenedUrls = await connectionDB.query(
      'SELECT id, url, "shortUrl", "visitCount" FROM shorts WHERE "userId" = $1 ',
      [userId]
    );

    //console.log(shortenedUrls.rows);

    const body = {
      "id": rows[0].id,
      "name": rows[0].name,
      "visitCount": totalVisitCount.rows[0].sum,
      "shortenedUrls": shortenedUrls.rows
    }

    res.status(200).send(body);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
