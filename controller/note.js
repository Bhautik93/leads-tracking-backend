const { DBCONSTANTS } = require("../constant/dbConstants");
const { RESPONSE_CODE } = require("../constant/responseCode");
const { selectWithAnd, insertSingle, selectWithAndOne, removeSingle } = require("../utils/queryCreator");
const { errorHandler } = require("../utils/errorHandler");

const list = async (leadId) => {
  if (!leadId) {
    throw errorHandler(
      "leadId is required to fetch notes",
      RESPONSE_CODE.BadRequest,
    );
  }
  const notes = await selectWithAnd(
    DBCONSTANTS.NOTES,
    {
      leadId,
    },
    "*",
    "id DESC",
  );

  if (!notes) {
    throw errorHandler("notes not found", RESPONSE_CODE.ResourceNotFound);
  }

  return notes;
};

const create = async (leadId, body) => {
  if (!leadId) {
    throw errorHandler(
      "leadId is required to create note",
      RESPONSE_CODE.BadRequest,
    );
  }

  const sendData = {
    leadId,
    content: body.content,
  };

  const result = await insertSingle(DBCONSTANTS.NOTES, sendData);
  if (!result) {
    throw errorHandler(
      "Failed to create note",
      RESPONSE_CODE.BadRequest,
    );
  }
  return {
    id: result.lastInsertRowid,
    ...sendData,
  };
};


const remove = async (id, noteId) => {
  const lead = await selectWithAndOne(DBCONSTANTS.NOTES, { leadId: id, id: noteId });

  if (!lead) {
    throw errorHandler("Note not found", RESPONSE_CODE.ResourceNotFound);
  }

  await removeSingle(DBCONSTANTS.NOTES, { leadId: id, id: noteId });

  return {
    message: "Note deleted successfully",
  };
};

module.exports = {
  list,
  create,
  remove
};
