require("dotenv").config();
require("express-async-errors");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

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

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 100, // limit each ip address to 100 request per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.get("/", (req, res) => {
  res.send("<h1>Fox Bank API</h1>");
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
