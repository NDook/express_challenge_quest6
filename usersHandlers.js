const database = require("./database");

const getUser = (req, res) => {
  let sql = "select * from users";
  const sqlValue = [];

  if (req.query.language) {
    sql += " where language = ?";
    sqlValue.push(req.query.language);
  }

  if (req.query.city) {
    sql += " where city = ?";
    sqlValue.push(req.query.city);
  }

  database
    .query(sql, sqlValue)
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from users where id = ?", [id])
    .then(([users]) => {
      if(users[0]) {
        res.json(users[0]);
      } else {
        res.status(404).send("Not found");
      }
      
    })
    .catch((err) => {
      err.status(404);
    });
};

const postUser = (req, res)  => {
    const { firstname, lastname, email, city, language } = req.body;
  
    database
      .query(
        "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
        [firstname, lastname, email, city, language]
      )
      .then(([result]) => {
        console.log(result);
        res.location(`/api/users/${result.insertId}`).sendStatus(201);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving the user");
      });
  }

  const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { firstname, lastname, email, city, language } = req.body;
  
    database
      .query(
        "UPDATE users set firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id = ?",
        [firstname, lastname, email, city, language, id]
      )
      .then(([result]) => {
        //console.log(result);
        if (result.affectedRows === 0) {
          res.status(404).send("Not Found");
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error editing the user");
      });
  };

  const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
      
    database
    .query(
      "DELETE FROM users where id = ?", [id]
    )
    .then(([result]) => {
      //console.log(result);
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting the user");
    });
  };

module.exports = {
  getUser,
  getUserById,
  postUser,
  updateUser,
  deleteUser
};
