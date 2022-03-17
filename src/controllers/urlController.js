import { connection } from "../database.js";
import randomstring from "randomstring";

export async function shortUrl(req, res) {
  const { url } = req.body;
  const { user } = res.locals;

  if (!url) return res.sendStatus(400);

  try {
    const urlUserExist = await connection.query(
      `SELECT * FROM urls WHERE "userId" = $1 AND url = $2 `,
      [user.id, url]
    );

    if (urlUserExist.rowCount > 0) {
      return res.sendStatus(409);
    }

    const shortUrl = randomstring.generate({
      length: 8,
      capitalization: "lowercase",
    });

    await connection.query(
      `
        INSERT INTO urls ("userId", "visitCount", "shortUrl", url)
        VALUES($1, $2, $3, $4)
        `,
      [user.id, 0, shortUrl, url]
    );
    res.status(201).send({ shortUrl });
  } catch (err) {
    res.sendStatus(500);
  }
}

export async function getUrl(req, res) {
  const { shortUrl } = req.params;
  console.log(shortUrl);

  try {
    const shortUrlExist = await connection.query(
      `SELECT * FROM urls WHERE "shortUrl" = $1`,
      [shortUrl]
    );

    if (!shortUrlExist.rowCount > 0) {
      return res.sendStatus(404);
    }

    const { id, url } = shortUrlExist.rows[0];
    res.status(200).send({ id, shortUrl, url });
  } catch (err) {
    res.sendStatus(500);
  }
}

export function deleteUrl(req, res) {
  const { id } = req.params;

  try {
    console.log(id);
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
}
