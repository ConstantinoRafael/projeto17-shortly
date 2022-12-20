import { urlSchema } from "../models/url.model.js";

export async function urlRouteValidation(req, res, next) {
  const body = req.body;

  const { error } = urlSchema.validate(body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  res.locals.url = body.url;

  next();
}
