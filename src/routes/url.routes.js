import { Router } from "express";
import { shorter } from "../controllers/url.controllers.js";

import { urlRouteValidation } from "../middlewares/urlValidation.middleware.js";
import { authenticatadeRouteValidation } from "../middlewares/userValidation.middleware.js";

const router = Router();

router.post(
  "/urls/shorten",
  urlRouteValidation,
  authenticatadeRouteValidation,
  shorter
);

export default router;
