const { Client } = require("pg");
const con = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "Test@123",
  database: "chatapp",
});

con.connect().then(() => {
  console.log("connected ");
});

con.query("Select * from tableone", (err, res) => {
  console.log(res.rows);
  con.end();
});
