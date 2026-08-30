const express = require("express");
const cors = require("cors");
require("dotenv").config();
const logger = console.log;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    PING: "PONG",
  });
});

app.use("/api", require("./router/lead"));
app.use("/api", require("./router/note"));
app.use("/api", require("./router/admin"));

const connectServer = async () => {
  try {
    app.listen(
      {
        port: parseInt(process.env.PORT || "5000"),
      },
      (err) => {
        if (err) throw err;
      },
    );
    require("./db/db");
    logger(`Express server is listing on port ${process.env.PORT}`);
  } catch (error) {
    console.error(error);
  }
};

connectServer();
