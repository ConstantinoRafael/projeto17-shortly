import express from "express";
import dotenv from "dotenv";
dotenv.config();

import userRoutes from "./routes/user.routes.js";
import urlRoutes from "./routes/url.routes.js"

const app = express();
app.use(express.json());

app.use(userRoutes);
app.use(urlRoutes);

const port = process.env.PORT;
app.listen(port, () => console.log(`Server running in port ${port}`));
