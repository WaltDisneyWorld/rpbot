const mongoose = require("mongoose");

const activitySchema = mongoose.Schema({
    username: String,
    content: String
});

module.exports = mongoose.model("Commands", activitySchema)