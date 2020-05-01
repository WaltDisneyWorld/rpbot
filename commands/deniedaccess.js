const Discord = require("discord.js")
const denied = (channel) => {
    const Embed = new Discord.RichEmbed()
    .setTitle("Unauthorised action.")
    .setDescription("You are not authorised to use this command, please speak to a member of the corporate team if you think this is a mistake.")
    .setTimestamp()
    .setColor("#5b9cc2");
    channel.send(Embed)

}

exports.denied = denied