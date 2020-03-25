const mongoose = require("mongoose");

const activitySchema = mongoose.Schema({
    username: String,
    rank: String,
    startdate: String,
    enddate: String,
    reason: String
});

module.exports = mongoose.model("Inactivity", activitySchema)