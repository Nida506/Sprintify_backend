//create express server
require("dotenv").config();

const express = require("express");
const { connectDb } = require("./src/config/database");
const cookieParser = require("cookie-parser");

// routes import
const { authRouter } = require("./src/routes/auth");
const { profileRouter } = require("./src/routes/profile");
const cardMoveRoute = require("./src/routes/cardmove");
const cardDetailsRoute = require("./src/routes/cardDetails");

// const { requestRouter } = require("./routes/request");
// const { userRouter } = require("./routes/user");
const cors = require("cors");
const boardRouter = require("./src/routes/boardRoute");
const { app, server } = require("./src/libs/socket"); // require("./utils/cronjob");
const cardRouter = require("./src/routes/cardRoute");
const listRouter = require("./src/routes/listRoute");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow GET method explicitly
    allowedHeaders: ["Content-Type", "Authorization"], // Ensure necessary headers are allowed
  })
);

app.use(express.json());
app.use(cookieParser());

const invitationRoutes = require("./src/routes/invite");
const chatRouter = require("./src/routes/chat");
app.use("/api/invitations", invitationRoutes);

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", boardRouter);
app.use("/", cardRouter);
app.use("/", listRouter);
app.use("/", cardMoveRoute);
app.use("/", chatRouter);
app.use("/api/cards",cardDetailsRoute);
// app.use("/", requestRouter);
// app.use("/", userRouter);
// app.use("/", paymentRouter);
app.use("*", (req, res) => {
  res.send("Invalid path");
});
console.log(process.env.PORT);
connectDb()
  .then(() => {
    console.log("Connection with database is established");
    server.listen(process.env.PORT, () => {
      console.log("Server is listening on port 8214");
    });
  })
  .catch((error) => {
    console.log(error);
  });
