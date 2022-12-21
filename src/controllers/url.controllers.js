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

    res.status(201).send({ shortUrl: shortUrl });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function findUrlById(req, res) {
  const { id } = req.params;

  try {
    const { rows } = await connectionDB.query(
      "SELECT * FROM shorts WHERE id = $1",
      [id]
    );

    if (rows.length === 0) {
      return res.sendStatus(404);
    }

    const sendUrl = {
      id: rows[0].id,
      shortUrl: rows[0].shortUrl,
      url: rows[0].url,
    };

    res.send(sendUrl);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function deleteUrlById(req, res) {
  const { id } = req.params;

  const userId = res.locals.userId;

  try {
    const { rows } = await connectionDB.query(
      "SELECT * FROM shorts WHERE id = $1",
      [id]
    );

    console.log(typeof Number(rows[0].userId));

    if (rows.length === 0) {
      return res.sendStatus(404);
    }

    if (Number(rows[0].userId) !== userId) {
      return res.sendStatus(401);
    }

    await connectionDB.query("DELETE FROM shorts WHERE id = $1", [id]);

    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function redirectUrl(req, res) {
  const { shortUrl } = req.params;

  try {
    const { rows } = await connectionDB.query(
      'SELECT * FROM shorts WHERE "shortUrl" = $1',
      [shortUrl]
    );

    if (rows.length === 0) {
      return res.sendStatus(404);
    }

    let contador = Number(rows[0].visitCount) + 1;

    await connectionDB.query(
      'UPDATE shorts SET "visitCount" = $1 WHERE "shortUrl" = $2',
      [contador, shortUrl]
    );

    const url = rows[0].url;

    console.log(typeof(url))

    res.redirect(url);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getRanking(req, res) {
  try {
    const { rows } = await connectionDB.query(
      'SELECT u.id, u.name, count(s."userId") AS "linksCount", COALESCE(sum(s."visitCount"), 0) AS "visitCount" FROM users AS u LEFT JOIN shorts AS s ON u.id = s."userId" GROUP by u.id ORDER BY "visitCount" DESC LIMIT 10'
    );

    res.status(200).send(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
