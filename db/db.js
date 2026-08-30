const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "../../leads.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("busy_timeout = 5000");

console.log("SQLite database connected");

module.exports = db;