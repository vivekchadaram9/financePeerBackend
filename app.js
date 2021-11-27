const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
cors = require("cors");

const databasePath = path.join(__dirname, "mydb.db");

const app = express();

app.use(express.json());
app.use(cors());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    console.log(process.env.PORT);

    app.listen(process.env.PORT || 3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/users/", async (request, response) => {
  let data = null;
  let getUsersQuery = `
      SELECT
        *
      FROM
        users`;
  data = await database.all(getUsersQuery);
  response.send(data);
});

app.post("/users/", async (request, response) => {
  const { userId, id, title, body } = request.body;
  const postUserQuery = `
  INSERT INTO
    users (userId,id, title, body)
  VALUES
    (${userId}, '${id}', '${title}', '${body}');`;
  await database.run(postUserQuery);
  response.send("User Successfully Added");
});

app.delete("/users/:id/", async (request, response) => {
  const { id } = request.params;
  const deleteUserQuery = `
  DELETE FROM
    users
  WHERE
    id = ${id};`;
  await database.run(deleteUserQuery);
  response.send("User Deleted");
});

module.exports = app;
