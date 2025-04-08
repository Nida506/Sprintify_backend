//create express server
require('dotenv').config();

const express = require('express');
const app = express();
const { connectDb } = require('./src/config/database');
const cookieParser = require('cookie-parser');

// routes import
const { authRouter } = require('./src/routes/auth');
const { profileRouter } = require('./src/routes/profile');
// const { requestRouter } = require("./routes/request");
// const { userRouter } = require("./routes/user");
const cors = require('cors');

// require("./utils/cronjob");
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allow GET method explicitly
    allowedHeaders: ['Content-Type', 'Authorization'], // Ensure necessary headers are allowed
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
// app.use("/", requestRouter);
// app.use("/", userRouter);
// app.use("/", paymentRouter);

connectDb()
  .then(() => {
    console.log('Connection with database is established');
    app.listen(process.env.PORT, () => {
      console.log('Server is listening on port 8214');
    });
  })
  .catch((error) => {
    console.log(error);
  });
