require("dotenv").config();
const express = require("express");
const router = require("./routes");
const http = require('http');
const app = express();
var server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.APP_URL,
  },
});
const Dbconnect = require("./database");
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
const corsOption = {
  credentials: true,
  origin: [process.env.APP_URL],
};

const PORT = process.env.PORT || 5500;
Dbconnect();
app.use(express.json({ limit: "8mb" }));
app.use("/storage", express.static("storage"));
app.use(cors(corsOption));
app.use(router);
app.get("/", (req, res) => {
  
  res.send(req.cookies);
});
server.listen(PORT, () => console.log(`Listening on port  ${PORT}`));

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  const phone = socket.handshake.query.phone;
  const pubkey = socket.handshake.query.pubkey;
  socket.join(id);
  //when ceonnect
  //console.log("a user connected.");
  //console.log(id)
  socket.on("send-message", ({ chatId, recipient, payload, type, time, status }) => {
    const message = { chatId, recipient, payload, type, time, status };
    console.log(message)
    socket.to(recipient._id).emit("receive-message", message);
  });
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
  });
});
