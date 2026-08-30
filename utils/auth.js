const { verifyToken } = require("./jwt");
const { RESPONSE_CODE } = require("../constant/responseCode");
const { errorHandler } = require("./errorHandler");

const validateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw errorHandler(
        "Authorization token is required",
        RESPONSE_CODE.Unauthorized,
      );
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : authHeader.trim();

    if (!token) {
      throw errorHandler(
        "Authorization token is required",
        RESPONSE_CODE.Unauthorized,
      );
    }

    const decoded = verifyToken(token);

    req.admin = decoded;

    next();
  } catch (error) {
    res.status(error?.code || RESPONSE_CODE.Unauthorized).send({
      success: false,
      message: error?.message || "Unauthorized",
    });
  }
};

module.exports = {
  validateAdmin,
};
