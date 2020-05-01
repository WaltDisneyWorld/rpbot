const Discord = require("discord.js")
const help = (author, channel) => {
    let embed = new Discord.RichEmbed();
    embed.setTitle("Commands");
    embed.setDescription("A list of all commands for this bot!");
    embed.addField(
        "General commands",
        "!help\n!naverify\n!verifyhelp\n!verifycheck\n!suggest\n"
    );
    embed.addField(
        "Staff commands",
        "!inactivitynotice\n!myactivity\n!staffserverlink\n!appealslink\n!help\n!verifyhelp\n!naverify\n!suggest"
    );
    embed.addField(
        "SR commands",
        "!promolog\n!demolog\n!suspendlog\n!info\n!dm\n!staffwarn\n!inactivitynotice\n!myactivity\n!staffserverlink\n!appealslink\n!help\n!naverify\n!verifyhelp\n!verifycheck\n!suggest"
    );
    embed.addField(
        "Excutive commands",
        "!promolog\n!demolog\n!suspendlog\n!channelactivity\n!info\n!announce\n!srannounce\n!dm\n!staffwarn\n!inactivitynotice\n!myactivity\n!staffserverlink\n!appealslink\n!appealslink\n!help\n!naverify\n!verifyhelp\n!verifycheck\n!suggest"
    );
    embed.addField(
        "Roblo  and Supreme's commands",
        "!reform\n!nonwarnreform\n!activitywarn\n!reset-activity\n!activity-warnings\n!2-warnings\n!updatelb\n!leaderboard\n!makerole\n!fixed\n!addactivity\n!minusactivity"
    );
    embed.setColor("#5b9cc2");
    channel.send("**Please check your DMs for more information on my commands!**")
    author.send(embed);
}

exports.help = help