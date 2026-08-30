const express = require("express");
const { RESPONSE_CODE } = require("../constant/responseCode");
const { formatResponse, failure } = require("../utils/responseHandler");
const { signIn, signUp } = require("../controller/admin");
const router = express.Router();

router.post("/admin/sign-in", async (req, res) => {
  try {
    res
      .status(RESPONSE_CODE.OK)
      .send(formatResponse(null, await signIn(req.body)));
  } catch (error) {
    res.status(Number.isInteger(error?.code) ? error.code : 500).send(failure(error));
  }
});

router.post("/admin/sign-up", async (req, res) => {
  try {
    res
      .status(RESPONSE_CODE.OK)
      .send(formatResponse(null, await signUp(req.body)));
  } catch (error) {
    res.status(Number.isInteger(error?.code) ? error.code : 500).send(failure(error));
  }
});

module.exports = router;
