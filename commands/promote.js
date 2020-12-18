let Discord = require("discord.js");
const robloxranking = require("robloxrankingservice");
const SessionsDB = require("../sessions.js");
const ActivityDB = require("../activity.js");
const gamekey = "xLQXxsZfUH6OAWtbPaXspaHlZgwJKMUjXRIr";
const sessions = (channel, guild, author, user, member, highestRole) => {
    channel.send(
        "Check your direct messages for more information."
    );
  
  // Promote isn't done bro dms
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
                "What type of promotion are you doing? Please reply with either **general**, **shift** or **booster**."
            );
            collector.on("collect", msg => {
                if (msg.content.toLowerCase() === "cancel") {
                    author.send("Cancelled Prompt.");
                } else {
                    let sessiontype = msg.content;
                    author.send(
                        "Alright! What the reason?"
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
                            let timestarting = msg1.content.toUpperCase();
                            author.send("Please send your Roblox username.");
                            const collector2 = new Discord.MessageCollector(
                                channel,
                                m => m.author.id == author.id,
                                { maxMatches: 1 }
                            );

                            collector2.on("collect", msg2 => {
                                if (msg1.content.toLowerCase() === "cancel") {
                                    author.send("Cancelled Prompt.");
                                } else {
                                    let channel3 = guild.channels.find(
                                        c => c.name === "session-notifications"
                                    );
                                    let channel2 = guild.channels.find(
                                        c => c.name === "bondi-bot-logs"
                                    );
                                    let username = msg2.content;

                                    author.send(
                                        `Thanks! I'm now sending the notification on Discord and Roblox.`
                                    );
                                    robloxranking.setrank(
                                        gamekey,
                                      6997096,
                                        username,
                                      rankid,
                                    );
                                    let embed = new Discord.RichEmbed()
                                        .setTitle("Person promoted")
                                        .addField("Promotion type:", sessiontype)
                                        .addField("Username:", username)
                                        .addField("Reason:", timestarting)
                                        .setColor("#5b9cc2")
                                        .setThumbnail(user.avatarURL);

                                    channel3.send("<@&736253779787382864>");
                                    channel3.send(embed);

                                    const newSession = new SessionsDB({
                                        username: member.displayName,
                                        sessiontype: sessiontype
                                    });
                                    newSession.save();
                                    var conditions = {
                                        username: member.displayName
                                    },
                                        update = { $inc: { sessions: 1 } },
                                        options = { multi: true };

                                    ActivityDB.update(
                                        conditions,
                                        update,
                                        options,
                                        callback
                                    );
                                    function callback(err, numAffected) {
                                        console.log(numAffected);
                                        channel2.send(
                                            `Number of sessions added: ${numAffected.n}`
                                        );
                                    }
                                }
                            });
                        }
                    });
                }
            });
        });
    }
}
exports.sessions = sessions;