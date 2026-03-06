require("dotenv").config();
const cors = require("cors");
const express = require("express");
// Database connection is initialized in configs/db.js
require("./configs/db");
const userRoutes = require("./routes/users.routes");
const postRoutes = require("./routes/post.routes");
const geducRoutes = require("./routes/geduc.routes");
const emailAuthRoutes = require("./routes/email-auth.routes");
const path = require("path");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const socketConections = require("./configs/socket");
const port = process.env.PORT;
app.use(express.json());
app.use(cors());
app.use(
  "/profile",
  express.static(path.resolve(__dirname, "images", "profile")),
);
app.use("/posts", express.static(path.resolve(__dirname, "images", "posts")));
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/geduc", geducRoutes);
app.use("/emailAuth", emailAuthRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://10.0.0.111:5173",
      "https://geduc-api.onrender.com",
    ],
  },
});

io.on("connection", socket => {
  socketConections({ socket, io });
});

server.listen(3001, () => {
  console.log("Servidor rodando");
});
