require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const router = require("./bookmarks/bookmark-router");

const app = express();
app.use(express.json());

const morganOption = process.env.NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());
app.use(
  (validateBearerToken = (req, res, next) => {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get("Authorization");

    if (!authToken || authToken.split(" ")[1] !== apiToken) {
      return res.status(401).json({ error: "Unauthorized request" });
    }
    next();
  })
);

app.use(router);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
