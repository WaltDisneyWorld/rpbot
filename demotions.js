const mongoose = require("mongoose");

const activitySchema = mongoose.Schema({
    username: String,
    userdemoted: String,
    oldnewrank: String,
    reason: String,
    proof: String
});

module.exports = mongoose.model("Demotions", activitySchema)