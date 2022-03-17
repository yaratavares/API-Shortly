import { connection } from "../database.js";
import randomstring from "randomstring";

export async function shortUrl(req, res) {
  const { url } = req.body;
  const { user } = res.locals;

  if (!url) return res.sendStatus(400);

  try {
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
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500);
  }
}

export function getUrl(req, res) {
  const { shortUrl } = req.params;

  try {
    console.log(url);
    res.sendStatus(200);
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
