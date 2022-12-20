import joi from "joi";

export const urlSchema = joi.object({
    url: joi.string().required().min(3),
  });