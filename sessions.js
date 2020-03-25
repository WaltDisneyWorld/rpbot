const mongoose = require("mongoose");

const activitySchema = mongoose.Schema({
    username: String,
    sessiontype: String
});

module.exports = mongoose.model("Sessions", activitySchema)