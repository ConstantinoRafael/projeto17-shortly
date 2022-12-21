import { Router } from "express";
import {
  findShortsUrlsMe,
  signIn,
  signUp,
} from "../controllers/user.controllers.js";
import {
  authenticatedRouteValidation,
  signInBodyValidation,
  userSchemaValidation,
} from "../middlewares/userValidation.middleware.js";

const router = Router();

router.post("/signup", userSchemaValidation, signUp);
router.post("/signin", signInBodyValidation, signIn);
router.get("/users/me", authenticatedRouteValidation, findShortsUrlsMe);

export default router;
