import express from "express";
import dotenv from "dotenv";
import color from "colors";
import { Server } from "socket.io";

import appSecMiddleware from "./config/securityMiddleware.js";
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import connectToTB from "./config/db.js";

dotenv.config();
connectToTB();
const PORT = process.env.PORT || 4000;

const app = express();

// Handling cors & other issues
appSecMiddleware(app);

app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/message", messageRoutes);

app.use(notFound);
// app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`app is up and running at port ${PORT}`.yellow.bold);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {


  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });


  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chatId;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
