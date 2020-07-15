const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const Db = require("./Connection/Db");
const blog = require("./api/index");

const app = express();

const PORT = process.env.PORT || 5000;     //i have changed to port 5000 should do with 8000 too

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", blog);                   // never put "/api/" unless we need other routes such as "/api/user" or "/api/product" which indicates route path

app.listen(PORT, console.log(`Server is starting at ${PORT}`));
