const cors = require("cors");
const express = require("express");
const sequelize = require("./configs/db");
const userRoutes = require("./routes/users.routes");
const tasksRoutes = require("./routes/tasks.routes");
const emailAuthRoutes = require("./routes/emailAuth.routes");
const path = require("path");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const port = process.env.PORT;

sequelize.sync().then(() => console.log("Database conected successfully..."));
app.use(express.json());
app.use(cors());
app.use(
  "/profile",
  express.static(path.resolve(__dirname, "images", "profile"))
);
app.use("/users", userRoutes);
app.use("/tasks", tasksRoutes);
app.use("/emailAuth", emailAuthRoutes);
app.listen(port, console.log("executando..."));

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://advancedtodo-server.onrender.com"],
  },
});

io.on("connection", socket => {
  console.log(`user connected ${socket.id}`);
  
  socket.on("set_username", username => {
    socket.data.username = username;
    console.log(socket.data.username);
  });
  
  socket.on("message", text => {
    io.emit("receive_message", {
      text,
      authorId: socket.id,
      author: socket.data.username,
    });
  });
});

server.listen(process.env.PORT, () => {
  console.log("Servidor rodando");
});
