const express = require("express");
const { getNotes, createNote, deleteNote, updateNote, createDecryptedNote } = require("../controllers/noteController");
const auth = require("../middlewares/auth");
const noteRouter = express.Router();

noteRouter.get("/", auth, getNotes);

noteRouter.post("/", auth, createNote);

noteRouter.post("/decrypted", createDecryptedNote);

noteRouter.post("/encrypt", require("../controllers/noteController").encryptNoteData);

noteRouter.delete("/:id", auth, deleteNote);

noteRouter.put("/:id", auth, updateNote);

module.exports = noteRouter;