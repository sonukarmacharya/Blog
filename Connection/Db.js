const mongoose = require("mongoose");

const connect = mongoose
  .connect(
    "mongodb+srv://sonu123:sonu123@cluster0.lhjb5.mongodb.net/Blog?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to db"))
  .catch((err) => console.log("Error in conntecting to db", err));
