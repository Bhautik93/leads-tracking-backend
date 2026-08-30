const bcrypt = require("bcrypt");
const { insertSingle, selectWithAndOne } = require("../utils/queryCreator");
const { DBCONSTANTS } = require("../constant/dbConstants");
const { RESPONSE_CODE } = require("../constant/responseCode");
const { errorHandler } = require("../utils/errorHandler");
const { generateToken } = require("../utils/jwt");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signUp = async (body) => {
  const { name, email, password, confirmPassword } = body;

  if (!name || !String(name).trim()) {
    throw errorHandler("Name is required", RESPONSE_CODE.BadRequest);
  }

  if (!email || !String(email).trim()) {
    throw errorHandler("Email is required", RESPONSE_CODE.BadRequest);
  }

  const emailValue = String(email).trim().toLowerCase();

  if (!emailRegex.test(emailValue)) {
    throw errorHandler(
      "Please enter a valid email address",
      RESPONSE_CODE.BadRequest,
    );
  }

  if (!password) {
    throw errorHandler("Password is required", RESPONSE_CODE.BadRequest);
  }

  if (String(password).length < 6) {
    throw errorHandler(
      "Password must be at least 6 characters",
      RESPONSE_CODE.BadRequest,
    );
  }

  if (!confirmPassword) {
    throw errorHandler(
      "Confirm password is required",
      RESPONSE_CODE.BadRequest,
    );
  }

  if (password !== confirmPassword) {
    throw errorHandler(
      "Password and confirm password do not match",
      RESPONSE_CODE.BadRequest,
    );
  }

  const existingAdmin = await selectWithAndOne(DBCONSTANTS.ADMIN, {
    email: emailValue,
  });

  if (existingAdmin) {
    throw errorHandler("Email already exists", RESPONSE_CODE.Conflict);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const sendData = {
    name: String(name).trim(),
    email: emailValue,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  const result = await insertSingle(DBCONSTANTS.ADMIN, sendData);

  return {
    id: result.lastInsertRowid,
    name: sendData.name,
    email: sendData.email,
    createdAt: sendData.createdAt,
  };
};

const signIn = async (body) => {
  const { email, password } = body;

  if (!email || !String(email).trim()) {
    throw errorHandler("Email is required", RESPONSE_CODE.BadRequest);
  }

  const emailValue = String(email).trim().toLowerCase();

  if (!emailRegex.test(emailValue)) {
    throw errorHandler(
      "Please enter a valid email address",
      RESPONSE_CODE.BadRequest,
    );
  }

  if (!password) {
    throw errorHandler("Password is required", RESPONSE_CODE.BadRequest);
  }

  const admin = await selectWithAndOne(DBCONSTANTS.ADMIN, {
    email: emailValue,
  });

  if (!admin) {
    throw errorHandler("Invalid email", RESPONSE_CODE.Unauthorized);
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);

  if (!isPasswordValid) {
    throw errorHandler("Invalid password", RESPONSE_CODE.Unauthorized);
  }

  const token = generateToken({
    id: admin.id,
    email: admin.email,
  });

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    token: token,
  };
};

module.exports = {
  signUp,
  signIn,
};
