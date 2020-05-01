let Discord = require("discord.js");
const SessionsDB = require("../sessions.js");
const logsession = (channel, guild, author, user, member, highestRole) => {
    if (member.roles.find("name", "Sessions")) {
        channel.send(
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
                author.send(
                    "What type of session are you logging? Please reply with either **shift**, **interview** or **training**."
                );
                collector.on("collect", msg => {
                    if (msg.content.toLowerCase() === "cancel") {
                        author.send("Cancelled Prompt.");
                    } else {
                        let sessiontype = msg.content;
                        author.send(
                            "Alright! What time is did your session start and end at? Make sure you put the time in EST."
                        );
                        const collector1 = new Discord.MessageCollector(
                            channel,
                            m => m.author.id == author.id,
                            { maxMatches: 1 }
                        );

                        collector1.on("collect", msg1 => {
                            if (msg1.content.toLowerCase() === "cancel") {
                                author.send("Cancelled Prompt.");
                            } else {
                                let timestarting = msg1.content;
                                author.send(
                                    "Who attended your session? If these users need promoting, type ``promotion needed`` next to their names."
                                );
                                const collector1 = new Discord.MessageCollector(
                                    channel,
                                    m => m.author.id == author.id,
                                    { maxMatches: 1 }
                                );

                                collector1.on("collect", msg3 => {
                                    if (msg3.content.toLowerCase() === "cancel") {
                                        author.send("Cancelled Prompt.");
                                    } else {
                                        let SessionAttended = msg3.content.toUpperCase();
                                        author.send("Any comments/notes you would like to add to it?");
                                        const collector2 = new Discord.MessageCollector(
                                            channel,
                                            m => m.author.id == author.id,
                                            { maxMatches: 1 }
                                        );

                                        collector2.on("collect", msg2 => {
                                            if (msg2.content.toLowerCase() === "cancel") {
                                                author.send("Cancelled Prompt.");
                                            } else {
                                                let channel2 = guild.channels.find(
                                                    c => c.name === "session-logs"
                                                );
                                                let channel3 = guild.channels.find(
                                                    c => c.name === "session-notifications"
                                                );
                                                let notes = msg2.content;

                                                author.send(
                                                    `Thanks! I'm now sending the notification on Discord.`
                                                );
                                                let embed = new Discord.RichEmbed()
                                                    .setTitle("Session Hosted")
                                                    .addField("Session Type:", sessiontype)
                                                    .addField("Session Host:", member)
                                                    .addField("Started at and ended at:", timestarting)
                                                    .addField('Attended:', SessionAttended)
                                                    .addField("Notes:", notes)
                                                    .setColor("#5b9cc2")
                                                    .setThumbnail(user.avatarURL);
                                                channel2.send(embed);
                                                channel3.send(`The ${sessiontype} hosted by ${member.displayName} has ended. Well done if you passed, if you failed there is always another time.`)
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            });
        };
    }
}



exports.logsession = logsession;