require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

// connect DB
const connectDB = require("./db/connect");

// middleware
const authenticateUser = require("./middleware/authentication");

// routers
const authRouter = require("./routes/auth");
const accountRouter = require("./routes/account");
const transactionsRouter = require("./routes/transactions");
const usersRouter = require("./routes/users");

//error handlers
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());

// extra packages

// routes
app.get("/", (req, res) => {
  res.send("<h1>Liberty Bank Node API</h1>");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/accounts", authenticateUser, accountRouter);
app.use("/api/v1/transactions", transactionsRouter);
app.use("/api/v1/users", authenticateUser, usersRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
