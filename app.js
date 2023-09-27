const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const port = 3000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");

const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "calendar_db",
  multipleStatements: true,
});

// cssファイルの取得
app.use(express.static("assets"));

// mysqlからデータを持ってくる
app.get("/", (req, res) => {
  // 初期データ
  const sql = "SELECT * from schedule;";

  con.query(
    sql,
    function (err, result, fields) {
      if (err) throw err;
      res.render("index", {
        users: result,
      });
    }
  );
});

app.post("/", (req, res) => {
  const sql = "INSERT INTO schedule SET ?";

  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("/close");
  });
});

app.get("/create", (req, res) => {
  res.sendFile(path.join(__dirname, "html/form.html"));
});

app.get("/close", (req, res) => {
  res.sendFile(path.join(__dirname, "html/formClose.html"));
});

app.get("/edit/:id", (req, res) => {
  const sql = "SELECT * FROM schedule WHERE id = ?;";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render("edit", {
      user: result,
    });
  });
});

app.post("/update/:id", (req, res) => {
  console.log(req.params.id);
  const sql = "UPDATE schedule SET ? WHERE id = " + req.params.id;
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("/");
  });
});

app.get("/delete/:id", (req, res) => {
  const sql = "DELETE FROM schedule WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("/");
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
