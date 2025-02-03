require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const os = require("os");

const app = express();
const port = process.env.PORT;
const uri = process.env.MONGODB_URI;

const resultRouter = require("./src/routes/result.route");
const customerRouter = require("./src/routes/customer.route");
const authRouter = require("./src/routes/auth.route");
const adminRouter = require("./src/routes/admin.route");
const isAdmin = require("./src/middlewares/isAdmin");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/results", resultRouter);
app.use("/api/customers", isAdmin, customerRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", isAdmin, adminRouter);

mongoose
  .connect(uri)
  .then(() => {
    console.log(`Connected to MongoDB | ${uri}`);
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
