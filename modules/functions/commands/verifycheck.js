let Discord = require("discord.js");
const verifiedDB = require("../verified.js");


const verifycheck = (channel, guild, author, user, member, highestRole) => {
    channel.send("Check your direct messages for more information.")
    verifiedDB.findOne({ robloxUser: member.displayName }, (err, activity) => {
        if (!activity) {
            author.send("Sorry we do not have you verified on our database, to verify then type ``!fibverify    ``.")
        } else {
            let activityEmbed = new Discord.RichEmbed()
                .setTitle("User Verified")
                .setDescription("Information that we currently hold on you.")
                .addField("Roblox username", activity.robloxUser)
                .addField("Roblox ID", activity.robloxID)
                .addField("Discord ID", activity.discordID)
                .setColor("#5b9cc2");
            author.send(activityEmbed);
        }
    });
}

exports.verifycheck = verifycheck