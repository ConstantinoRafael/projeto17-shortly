import { userSchema } from "../models/users.model.js";
import { connectionDB } from "../database/db.js";

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
