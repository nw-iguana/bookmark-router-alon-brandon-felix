const express = require("express");
const router = express.Router();
const bodyParser = express.json();
const bookmarks = require("../store");
const uuid = require("uuid/v4");
const logger = require("../logger");

router.route("/bookmarks").get((req, res) => {
  res.status(200).json(bookmarks);
});

router.route("/bookmarks/:id").get((req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  const bookmark = bookmarks.find(bookmark => bookmark.id === id);

  if (!bookmark) {
    logger.error(`Bookmark with id ${id} not found.`);
    return res.status(404).send("Bookmark not found!");
  }

  res.json(bookmark);
});

router.route("/bookmark").post(bodyParser, (req, res) => {
  const { title, content } = req.body;

  if (!title) {
    logger.error(`Title is required`);
    return res.status(400).send("Use a title");
  }
  if (!content) {
    logger.error(`Content is required`);
    return res.status(400).send("Use a content");
  }

  const id = uuid();

  const userBookmark = { title, content, id };
  bookmarks.push(userBookmark);

  logger.info(`Bookmark with id ${id} created.`);

  res
    .status(201)
    .location(`http://localhost:8000/bookmarks/${id}`)
    .json(bookmarks);
});
router.route("/bookmark/:id").delete((req, res) => {
  let { id } = req.params;
  id = parseInt(id);

  const bookmarkIndex = bookmarks.findIndex(book => book.id === id);

  if (bookmarkIndex === -1) {
    logger.error(`Bookmark with id ${id} not found`);
    return res.status(404).send("Not Found");
  }

  bookmarks.splice(bookmarkIndex, 1);
  logger.info(`Bookmark with id ${id} was deleted :)`);
  res.status(204).end();
});
module.exports = router;
