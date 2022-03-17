import bcrypt from "bcrypt";
import { connection } from "../database.js";

export async function createUser(req, res) {
  const user = req.body;

  try {
    const existingUsers = await connection.query(
      "SELECT * FROM users WHERE email=$1",
      [user.email]
    );
    if (existingUsers.rowCount > 0) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);

    await connection.query(
      `
      INSERT INTO 
        users(name, email, password) 
      VALUES ($1, $2, $3)
    `,
      [user.name, user.email, passwordHash]
    );

    res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function getUser(req, res) {
  const { user } = res.locals;

  try {
    res.send(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getIdUser(req, res) {
  const { id } = req.params;

  try {
    const userExist = await connection.query(
      `SELECT id AS "userId", name FROM users WHERE id = $1`,
      [id]
    );

    if (!userExist.rowCount > 0) {
      return res.sendStatus(404);
    }

    const { userId, name } = userExist.rows[0];

    const selectRanking = await connection.query(
      `SELECT id, "visitCount", "shortUrl", url FROM urls
      WHERE "userId" = ${id}
      `
    );

    const shortenedUrls = selectRanking.rows;

    let objectUser = { id: userId, name, visitCount: 0, shortenedUrls };

    res.status(200).send(objectUser);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
