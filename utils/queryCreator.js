const db = require("../db/db");

const selectWithAnd = async (
  tableName,
  where = {},
  columns = "*",
  orderBy = "",
) => {
  const columnNames = Object.keys(where);

  let query = `
    SELECT ${columns}
    FROM ${tableName}
  `;

  const values = [];

  if (columnNames.length) {
    query += " WHERE ";

    query += columnNames.map((column) => `${column} = ?`).join(" AND ");

    columnNames.forEach((column) => {
      values.push(where[column]);
    });
  }

  if (orderBy) {
    query += ` ORDER BY ${orderBy}`;
  }

  return db.prepare(query).all(...values);
};

const selectWithAndOne = async (tableName, where = {}, columns = "*") => {
  const columnNames = Object.keys(where);

  let query = `
    SELECT ${columns}
    FROM ${tableName}
  `;

  const values = [];

  if (columnNames.length) {
    query += " WHERE ";

    query += columnNames.map((column) => `${column} = ?`).join(" AND ");

    columnNames.forEach((column) => {
      values.push(where[column]);
    });
  }

  return db.prepare(query).get(...values);
};

const insertSingle = async (tableName, data) => {
  const columns = Object.keys(data);

  const values = Object.values(data);

  const placeholders = columns.map(() => "?").join(", ");

  const query = `
    INSERT INTO ${tableName}
    (${columns.join(", ")})
    VALUES (${placeholders})
  `;

  return db.prepare(query).run(...values);
};

const updateSingle = async (tableName, where, data) => {
  const updateColumns = Object.keys(data);

  const updateValues = Object.values(data);

  const whereColumns = Object.keys(where);

  const whereValues = Object.values(where);

  const setQuery = updateColumns.map((column) => `${column} = ?`).join(", ");

  const whereQuery = whereColumns
    .map((column) => `${column} = ?`)
    .join(" AND ");

  const query = `
    UPDATE ${tableName}
    SET ${setQuery}
    WHERE ${whereQuery}
  `;

  return db.prepare(query).run(...updateValues, ...whereValues);
};

const removeSingle = async (tableName, where) => {
  const columns = Object.keys(where);

  const values = Object.values(where);

  const whereQuery = columns.map((column) => `${column} = ?`).join(" AND ");

  const query = `
    DELETE FROM ${tableName}
    WHERE ${whereQuery}
  `;

  return db.prepare(query).run(...values);
};

const listQuery = async (query, params = []) => {
  return db.prepare(query).all(...params);
};

module.exports = {
  selectWithAnd,
  selectWithAndOne,
  insertSingle,
  updateSingle,
  removeSingle,
  listQuery,
};
