const mongoose = require("mongoose");

const activitySchema = mongoose.Schema({
    username: String,
    userwarned: String,
    reason: String
});

module.exports = mongoose.model("Warnings", activitySchema)