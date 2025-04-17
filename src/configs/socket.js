const socket_types = {
  message: "message",
  user: "set_username",
  login: "login",
  editedTask: "editedTask",
  createdTask: "createdTask",
  deletedTask: "deletedTask",
  completedTask: "completedTask",
};

function socketConections({ socket, io }) {
  socket.on(socket_types.message, text => {
    io.emit("receive_message", {
      text,
      authorId: socket.id,
      author: socket.data.username,
    });
  });

  socket.on(socket_types.login, text => {
    io.emit("receive_message", {
      text,
      authorId: socket.id,
      author: socket.data.username,
    });
  });

  socket.on(socket_types.editedTask, text => {
    io.emit("receive_message", {
      text,
      authorId: socket.id,
      author: socket.data.username,
    });
  });

  socket.on(socket_types.createdTask, text => {
    io.emit("receive_message", {
      text,
      authorId: socket.id,
      author: socket.data.username,
    });
  });

  socket.on(socket_types.completedTask, text => {
    io.emit("receive_message", {
      text,
      authorId: socket.id,
      author: socket.data.username,
    });
  });

  socket.on(socket_types.deletedTask, text => {
    io.emit("receive_message", {
      text,
      authorId: socket.id,
      author: socket.data.username,
    });
  });
}

module.exports = socketConections;
