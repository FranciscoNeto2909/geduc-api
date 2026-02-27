require("dotenv").config();
const cors = require("cors");
const express = require("express");
const sequelize = require("./configs/db");
const userRoutes = require("./routes/users.routes");
const postRoutes = require("./routes/post.routes");
const emailAuthRoutes = require("./routes/email-auth.routes");
const path = require("path");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const { isLogged } = require("./middlewares/auth");
const socketConections = require("./configs/socket");
const port = process.env.PORT;

sequelize.sync().then(() => console.log("Database conected successfully..."));
app.use(express.json());
app.use(cors());
app.use(
  "/profile",
  express.static(path.resolve(__dirname, "images", "profile")),
);
app.use("/posts", express.static(path.resolve(__dirname, "images", "posts")));
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
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
