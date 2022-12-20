import { connectionDB } from "../database/db.js";
import { nanoid } from "nanoid";

export async function shorter(req, res) {
  const userId = res.locals.userId;
  const url = res.locals.url;

  const shortUrl = nanoid(8);

  const visitCount = 0;

  try {
    await connectionDB.query(
      'INSERT INTO shorts (url, "shortUrl", "visitCount", "userId") Values ($1, $2, $3, $4)',
      [url, shortUrl, visitCount, userId]
    );

    res.status(201).send(shortUrl);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
