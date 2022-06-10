const express = require("express");

const serverConfig = require("./configs/server.config");

const mongoose = require("mongoose");

const dbConfig = require("./configs/db.config");

const bodyParser = require("body-parser");

const User = require("./models/user.model");

const bcrypt = require("bcryptjs");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/*
 * Setup mongodb connection and create Admin user
 */
mongoose.connect(dbConfig.DB_URL, () => {
  console.log("MongoDB connected");
  init();
});

async function init() {
  const user = await User.findOne({ userID: "admin" });
  if (user) {
    return;
  } else {
    const user = await User.create({
      name: "Sairam",
      userID: "admin",
      email: "sairamravula4@gmail.com",
      userType: "ADMIN",
      password: bcrypt.hashSync("Hello1", 8),
    });
    console.log("Admin user created");
  }
}

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/ticket.routes")(app);

app.listen(serverConfig.PORT, () => {
  console.log("Application is listening on port ", serverConfig.PORT);
});
