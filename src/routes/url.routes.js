import { Router } from "express";
import {
  deleteUrlById,
  findUrlById,
  getRanking,
  redirectUrl,
  shorter,
} from "../controllers/url.controllers.js";

import { urlRouteValidation } from "../middlewares/urlValidation.middleware.js";
import { authenticatedRouteValidation } from "../middlewares/userValidation.middleware.js";

const router = Router();

router.post(
  "/urls/shorten",
  urlRouteValidation,
  authenticatedRouteValidation,
  shorter
);

router.get("/urls/:id", findUrlById);

router.get("/urls/open/:shortUrl", redirectUrl);

router.delete("/urls/:id", authenticatedRouteValidation, deleteUrlById);

router.get("/ranking", getRanking);

export default router;
