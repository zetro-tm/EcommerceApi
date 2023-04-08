const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();

//Body parser,reading data from the body to req.body
app.use(express.json());

//logs requests to the terminal
app.use(morgan("dev"));

module.exports = app;
