const Discord = require("discord.js");

const srannounce = (channel, guild, author, user, member, highestRole) => {
    message.channel.send(
        "Check your direct messages for more information."
    );
    var channel = null;
    if (channel == null) {
        author.createDM().then(chan => {
            channel = chan;
            const collector = new Discord.MessageCollector(
                channel,
                m => m.author.id == author.id,
                { maxMatches: 1 }
            );
            author.send("Title of the announcement:");
            collector.on("collect", msg => {
                let announcetitle = msg.content;
                author.send("Description of the announcement:");
                const collector1 = new Discord.MessageCollector(
                    channel,
                    m => m.author.id == author.id,
                    { maxMatches: 1 }
                );
                collector1.on("collect", msg1 => {
                    let announcedescription = msg1.content;
                    let channel = guild.channels.find(
                        c => c.name === "702526094351400960"
                    );
                    let embed = new Discord.RichEmbed()
                        .setTitle(announcetitle)
                        .setColor("#5b9cc2")
                        .setThumbnail(bot.user.avatarURL)
                        .setDescription(announcedescription);
                    channel.send("@everyone");
                    channel.send(embed);
                    author.send(
                        `The notification is now being sent in sr notifications.`
                    );
                });
            });
        });
    }
}

exports.srannounce = srannounce