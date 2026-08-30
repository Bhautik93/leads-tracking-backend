const express = require("express");
const { RESPONSE_CODE } = require("../constant/responseCode");
const { formatResponse, failure } = require("../utils/responseHandler");
const { create, list, getById, update, remove } = require("../controller/lead");
const { validateAdmin } = require("../utils/auth");

const router = express.Router();

router.get("/leads", validateAdmin, async (req, res) => {
  try {
    const requestQuery = {
      ...req.query,
    };
    res
      .status(RESPONSE_CODE.OK)
      .send(formatResponse(null, await list(requestQuery)));
  } catch (error) {
    const statusCode = Number.isInteger(error?.code) ? error.code : 500;
    res.status(statusCode).send(failure(error));
  }
});

router.post("/leads", validateAdmin, async (req, res) => {
  try {
    res
      .status(RESPONSE_CODE.Created)
      .send(formatResponse(null, await create(req.body)));
  } catch (error) {
    const statusCode = Number.isInteger(error?.code) ? error.code : 500;
    res.status(statusCode).send(failure(error));
  }
});

router.get("/leads/:id", validateAdmin, async (req, res) => {
  try {
    res
      .status(RESPONSE_CODE.OK)
      .send(formatResponse(null, await getById(req.params.id)));
  } catch (error) {
    const statusCode = Number.isInteger(error?.code) ? error.code : 500;
    res.status(statusCode).send(failure(error));
  }
});

router.patch("/leads/:id", validateAdmin, async (req, res) => {
  try {
    const requestQuery = {
      id: req.params.id,
      ...req.body,
    };
    res
      .status(RESPONSE_CODE.OK)
      .send(formatResponse(null, await update(requestQuery)));
  } catch (error) {
    const statusCode = Number.isInteger(error?.code) ? error.code : 500;
    res.status(statusCode).send(failure(error));
  }
});

router.delete("/leads/:id", validateAdmin, async (req, res) => {
  try {
    res
      .status(RESPONSE_CODE.OK)
      .send(formatResponse(null, await remove(req.params.id)));
  } catch (error) {
    const statusCode = Number.isInteger(error?.code) ? error.code : 500;
    res.status(statusCode).send(failure(error));
  }
});

module.exports = router;