const fs = require('fs');
require("dotenv").config({ path: '../.env' });

const db = require("./connect");

const sql = fs.readFileSync('./database/db.sql').toString();

db.query(sql)
    .then(data => console.log("Set-up complete."))
    .catch(error => console.log(error));