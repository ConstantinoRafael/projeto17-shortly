import { userSchema } from "../models/users.model.js";
import { connectionDB } from "../database/db.js";
import bcrypt from "bcrypt";

export async function userSchemaValidation(req, res, next) {
  const user = req.body;

  const { error } = userSchema.validate(user, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  const userExists = await connectionDB.query(
    "SELECT * FROM users WHERE email=$1",
    [user.email]
  );

  if (userExists.rowCount !== 0) {
    return res.sendStatus(409);
  }

  res.locals.user = user;

  next();
}

export async function signInBodyValidation(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await connectionDB.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rowCount === 0) {
      return res.sendStatus(401);
    }

    const passwordOk = bcrypt.compareSync(password, user.rows[0].password);
    if (!passwordOk) {
      return res.sendStatus(401);
    }

    res.locals.user = user.rows[0];
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }

  next();
}
