const mongoose = require("mongoose");

const activitySchema = mongoose.Schema({
    robloxUser: String,
    robloxID: String,
    discordID: String
});

module.exports = mongoose.model("Verified", activitySchema)