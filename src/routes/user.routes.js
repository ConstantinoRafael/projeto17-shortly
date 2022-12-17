import { Router } from "express";
import { signUp } from "../controllers/user.controllers.js";
import { userSchemaValidation } from "../middlewares/userValidation.middleware.js";

const router = Router();

router.post("/signup", userSchemaValidation, signUp);
router.post("/signin");
