const express = require("express");
const { RESPONSE_CODE } = require("../constant/responseCode");
const { formatResponse, failure } = require("../utils/responseHandler");
const { create, list, remove } = require("../controller/note");
const { validateAdmin } = require("../utils/auth");
const router = express.Router();

router.get("/leads/:id/notes", validateAdmin, async (req, res) => {
  try {
    res
      .status(RESPONSE_CODE.OK)
      .send(formatResponse(null, await list(req.params.id)));
  } catch (error) {
    res.status(error?.code || 500).send(failure(error));
  }
});

router.post("/leads/:id/notes", validateAdmin, async (req, res) => {
  try {
    res
      .status(RESPONSE_CODE.Created)
      .send(formatResponse(null, await create(req.params.id, req.body)));
  } catch (error) {
    res.status(error?.code || 500).send(failure(error));
  }
});

router.delete("/leads/:id/notes/:noteId", validateAdmin, async (req, res) => {
  try {
    res
      .status(RESPONSE_CODE.OK)
      .send(formatResponse(null, await remove(req.params.id, req.params.noteId)));
  } catch (error) {
    const statusCode = Number.isInteger(error?.code) ? error.code : 500;
    res.status(statusCode).send(failure(error));
  }
});

module.exports = router;
