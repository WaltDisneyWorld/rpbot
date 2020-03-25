const mongoose = require("mongoose");

const activitySchema = mongoose.Schema({
    username: String,
    activity: Number,
    warnings: Number,
    sessions: Number,
    inactivity: Boolean
});

module.exports = mongoose.model("Activity", activitySchema)