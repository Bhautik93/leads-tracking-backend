const {
  insertSingle,
  selectWithAndOne,
  updateSingle,
  removeSingle,
  listQuery,
} = require("../utils/queryCreator");
const { DBCONSTANTS } = require("../constant/dbConstants");
const { RESPONSE_CODE } = require("../constant/responseCode");
const { errorHandler } = require("../utils/errorHandler");
const { checkDuplicateLead, validateLeadData } = require("../utils/validate");

const list = async (queryParams) => {
  const {
    search = "",
    status = "",
    page = 1,
    limit = 10,
    sortBy = "",
    sortOrder = "",
  } = queryParams;

  const allowedStatus = ["new", "contacted", "qualified", "lost"];

  if (status && !allowedStatus.includes(status)) {
    throw errorHandler("Invalid lead status", RESPONSE_CODE.BadRequest);
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    throw errorHandler(
      "Page must be a positive integer",
      RESPONSE_CODE.BadRequest,
    );
  }

  if (!Number.isInteger(limitNumber) || limitNumber < 1) {
    throw errorHandler(
      "Limit must be a positive integer",
      RESPONSE_CODE.BadRequest,
    );
  }

  const offset = (pageNumber - 1) * limitNumber;

  const allowedSortColumns = ["id", "name", "email", "phone", "status", "createdAt"];
  const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : "id";
  const safeSortOrder = sortOrder?.toLowerCase() === "asc" ? "ASC" : "DESC";

  let whereQuery = `
    WHERE 1 = 1
  `;

  const params = [];

  if (search.trim()) {
    whereQuery += `
      AND (
        name LIKE ?
        OR email LIKE ?
        OR phone LIKE ?
      )
    `;

    const searchValue = `%${search.trim()}%`;

    params.push(searchValue, searchValue, searchValue);
  }

  if (status) {
    whereQuery += `
      AND status = ?
    `;

    params.push(status);
  }

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM ${DBCONSTANTS.LEAD}
    ${whereQuery}
  `;

  const totalResult = await listQuery(countQuery, params);

  const total = totalResult[0].total;

  const dataQuery = `
    SELECT *
    FROM ${DBCONSTANTS.LEAD}
    ${whereQuery}
    ORDER BY ${safeSortBy} ${safeSortOrder}
    LIMIT ?
    OFFSET ?
  `;

  const dataParams = [...params, limitNumber, offset];

  const leads = await listQuery(dataQuery, dataParams);

  return {
    data: leads,

    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const create = async (body) => {
  const { name, email, phone, status = "new" } = body;

  validateLeadData({
    name,
    email,
    phone,
    status,
  });

  const sendData = {
    name: name.trim(),
    email: email.trim(),
    phone: String(phone).trim(),
    status,
    createdAt: new Date().toISOString(),
  };

  await checkDuplicateLead({
    email: sendData.email,
    phone: sendData.phone,
  });

  const result = await insertSingle(DBCONSTANTS.LEAD, sendData);

  return {
    id: result.lastInsertRowid,
    ...sendData,
  };
};

const getById = async (id) => {
  const lead = await selectWithAndOne(DBCONSTANTS.LEAD, {
    id,
  });

  if (!lead) {
    throw errorHandler("Lead not found", RESPONSE_CODE.ResourceNotFound);
  }

  return lead;
};

const update = async (id, body) => {
  const existingLead = await selectWithAndOne(DBCONSTANTS.LEAD, { id });

  if (!existingLead) {
    throw errorHandler("Lead not found", RESPONSE_CODE.ResourceNotFound);
  }

  const sendData = {
    name: body.name ?? existingLead.name,

    email: body.email ?? existingLead.email,

    phone: body.phone ?? existingLead.phone,

    status: body.status ?? existingLead.status,
  };

  validateLeadData({
    name: sendData.name,
    email: sendData.email,
    phone: sendData.phone,
    status: sendData.status,
  });

  await checkDuplicateLead({
    email: sendData.email,
    phone: sendData.phone,
    id,
  });

  await updateSingle(DBCONSTANTS.LEAD, { id }, sendData);

  return selectWithAndOne(DBCONSTANTS.LEAD, { id });
};

const remove = async (id) => {
  const lead = await selectWithAndOne(DBCONSTANTS.LEAD, { id });

  if (!lead) {
    throw errorHandler("Lead not found", RESPONSE_CODE.ResourceNotFound);
  }

  await removeSingle(DBCONSTANTS.LEAD, { id });
  await removeSingle(DBCONSTANTS.NOTES, { leadId: id });

  return {
    message: "Lead deleted successfully",
  };
};

module.exports = {
  create,
  getById,
  update,
  remove,
  list,
};
