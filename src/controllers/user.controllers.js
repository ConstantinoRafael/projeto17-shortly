import { connectionDB } from "../database/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export async function signUp (req, res) {
    const user = res.locals.user;
    const passwordHash = bcrypt.hashSync(user.password, 10);

    try {
        await connectionDB.query(
        "INSERT INTO users "
        )
    } catch (err) {
        res.status(500).send(err.message);
    }
}