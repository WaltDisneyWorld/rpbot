const help = () => {
    let embed = new Discord.RichEmbed();
    embed.setTitle("Commands");
    embed.setDescription("A list of all commands for this bot!");
    embed.addField(
        "General commands",
        "!help\n!bondiverify\n!verifyhelp\n!verifycheck\n!suggest\n"
    );
    embed.addField(
        "Staff commands",
        "!inactivitynotice\n!myactivity\n!staffserverlink\n!appealslink\n!help\n!bondiverify\n!verifyhelp\n!verifycheck\n!suggest"
    );
    embed.addField(
        "SR commands",
        "!promolog\n!demolog\n!suspendlog\n!info\n!dm\n!staffwarn\n!inactivitynotice\n!myactivity\n!staffserverlink\n!appealslink\n!help\n!bondiverify\n!verifyhelp\n!verifycheck\n!suggest"
    );
    embed.addField(
        "Excutive commands",
        "!promolog\n!demolog\n!suspendlog\n!channelactivity\n!info\n!announce\n!srannounce\n!dm\n!staffwarn\n!inactivitynotice\n!myactivity\n!staffserverlink\n!appealslink\n!appealslink\n!help\n!bondiverify\n!verifyhelp\n!verifycheck\n!suggest"
    );
    embed.addField(
        "Freeze and Ethans commands",
        "!reform\n!nonwarnreform\n!activitywarn\n!reset-activity\n!activity-warnings\n!2-warnings\n!updatelb\n!leaderboard\n!makerole\n!fixed\n!addactivity\n!minusactivity"
    );
    embed.setColor("#5b9cc2");
    message.channel.send(embed);
}

exports.help = help