//@ts-check
const { RESPONSE_CODE } = require("../constant/responseCode");
const { errorHandler } = require("./errorHandler");

const failure = (error) => {
  try {
    return formatResponse(error, null);
  } catch (error) {
    return formatResponse(
      errorHandler("Internal server error", RESPONSE_CODE.BadRequest),
      null
    );
  }
};

const formatResponse = (error, payload) => {
  if (error) {
    if (process.env.NODE_ENV === "production") {
      return {
        error: {
          message: error?.message
        }
      };
    } else {
      return {
        error: {
          message: error?.message,
          stack: error?.stack
        }
      };
    }
  }
  return {
    payload
  };
};

module.exports = {
  failure,
  formatResponse
};
