const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema({
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  date: {
    type: Date.UTC(),
  },
});

module.exports = mongoose.model("Blog", BlogSchema);
