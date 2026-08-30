const { DBCONSTANTS } = require("../constant/dbConstants");
const { RESPONSE_CODE } = require("../constant/responseCode");
const { errorHandler } = require("./errorHandler");
const { listQuery } = require("./queryCreator");

module.exports.validateLeadData = ({
  name,
  email,
  phone,
  status,
}) => {

  if (!name || !String(name).trim()) {
    throw errorHandler(
      "Name is required",
      RESPONSE_CODE.BadRequest
    );
  }

  if (!email || !String(email).trim()) {
    throw errorHandler(
      "Email is required",
      RESPONSE_CODE.BadRequest
    );
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(String(email).trim())) {
    throw errorHandler(
      "Please enter a valid email address",
      RESPONSE_CODE.BadRequest
    );
  }

  if (!phone || !String(phone).trim()) {
    throw errorHandler(
      "Phone is required",
      RESPONSE_CODE.BadRequest
    );
  }

  const phoneRegex = /^[0-9]{10}$/;

  if (!phoneRegex.test(String(phone).trim())) {
    throw errorHandler(
      "Please enter a valid 10 digit phone number",
      RESPONSE_CODE.BadRequest
    );
  }

  const allowedStatus = [
    "new",
    "contacted",
    "qualified",
    "lost",
  ];

  if (!allowedStatus.includes(status)) {
    throw errorHandler(
      "Invalid lead status",
      RESPONSE_CODE.BadRequest
    );
  }
};


module.exports.checkDuplicateLead = async ({
  email,
  phone,
  id = null,
}) => {

  let emailQuery = `
    SELECT id
    FROM ${DBCONSTANTS.LEAD}
    WHERE email = ?
  `;

  const emailParams = [email];

  if (id) {
    emailQuery += `
      AND id != ?
    `;

    emailParams.push(id);
  }

  const emailExists = await listQuery(
    emailQuery,
    emailParams
  );

  if (emailExists.length) {
    throw errorHandler(
      "Email already exists",
      RESPONSE_CODE.Conflict
    );
  }


  let phoneQuery = `
    SELECT id
    FROM ${DBCONSTANTS.LEAD}
    WHERE phone = ?
  `;

  const phoneParams = [phone];

  if (id) {
    phoneQuery += `
      AND id != ?
    `;

    phoneParams.push(id);
  }

  const phoneExists = await listQuery(
    phoneQuery,
    phoneParams
  );

  if (phoneExists.length) {
    throw errorHandler(
      "Phone number already exists",
      RESPONSE_CODE.Conflict
    );
  }
};