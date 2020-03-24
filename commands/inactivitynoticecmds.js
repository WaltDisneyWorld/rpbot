let Discord = require("discord.js");
const InactivityDB = require("../inactivity.js");
const ActivityDB = require("../activity.js");
const inactivitynotice = (channel, guild, author, user, member, highestRole, messagemember) => {

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
            author.send("What is your Roblox username?");
            collector.on("collect", msg => {
                let username = msg.content;
                author.send(
                    "What is the starting date of your inactivity notice?"
                );
                const collector1 = new Discord.MessageCollector(
                    channel,
                    m => m.author.id == author.id,
                    { maxMatches: 1 }
                );
                collector1.on("collect", msg1 => {
                    let startingdate = msg1.content;
                    author.send(
                        "What is the ending date of your inactivity notice?"
                    );
                    const collector2 = new Discord.MessageCollector(
                        channel,
                        m => m.author.id == author.id,
                        { maxMatches: 1 }
                    );
                    collector2.on("collect", msg2 => {
                        let endingdate = msg2;
                        const collector3 = new Discord.MessageCollector(
                            channel,
                            m => m.author.id == author.id,
                            { maxMatches: 1 }
                        );
                        author.send("Reason for inactivity?");
                        collector3.on("collect", msg3 => {
                            let reason = msg3.content;
                            let channel2 = guild.channels.find(
                                c => c.name === "inactivity"
                            );
                            let embed = new Discord.RichEmbed()
                                .setTitle("Inactivity Notice")
                                .setColor("#5b9cc2")
                                .setThumbnail(user.avatarURL)
                                .addField("Username:", username)
                                .addField("Starting Date", startingdate)
                                .addField("Ending Date", endingdate)
                                .addField("Reason", reason);
                            channel2.send(embed);
                            author.send(
                                `Your inactivity notice has been sent to the Super Rank team to be reviewed. Once your inactivity notice expires, you will be expected to resume back to full activity. This inactivity notice will excuse you of all shift and activity requirements.`
                            );
                            const newNotice = new InactivityDB({
                                username: member,
                                rank: highestRole,
                                startdate: startingdate,
                                enddate: endingdate,
                                reason: reason
                            });
                            var conditions = { username: username },
                                update = { $set: { inactivity: true } },
                                options = { multi: true };

                            ActivityDB.update(conditions, update, options, callback);
                            function callback(err, numAffected) {
                                console.log(numAffected);
                            }
                            newNotice.save();
                            let role = guild.roles.find(n => n.name === "On Inactivity")
                            messagemember.addRole(role)
                            //     let channel3 = guild.channels.find(
                            //         c => c.name === "bondi-bot-logs"
                            //     );
                            //     channel3.send(
                            //         `Inactivity notice of ${username} successfully logged on the database`
                            //     );

                        });
                    });
                });
            });
        });
    };
};

exports.inactivitynotice = inactivitynotice


const endnotice = (channel, guild, author, user, member, highestRole, messagemember, content, message) => {
    let messageArray = content.split(" ");
    let args = messageArray.slice(1);
    let username = args[0];
    let channel2 = guild.channels.find(
        c => c.name === "bondi-bot-logs"
    );
    InactivityDB.deleteOne({ username: member }, function (err) {
        if (err) return console.log(err);
        if (err) return channel.send(err);
        channel2.send(`Inactivity notice for ${member} deleted by the user.`);
        message.react("👍");
    });
    let role = guild.roles.find(n => n.name === "on inactivity")
    messagemember.removeRole(role)
    var conditions = { username: member },
        update = { $set: { inactivity: false } },
        options = { multi: true };

    ActivityDB.update(conditions, update, options, callback);
    function callback(err, numAffected) {
        console.log(numAffected);
    }
}

exports.endnotice = endnotice

const viewnotice = (username) => {
    InactivityDB.find({ username: username }, (err, activity) => {
        console.log(activity);
        let activityEmbed = new Discord.RichEmbed();
        for (var activity of activity) {
            activityEmbed.setTitle("Inactivity notice");
            activityEmbed.addField("Username", activity.username, true);
            activityEmbed.addField("Rank", activity.rank, true);
            activityEmbed.addField("Start date", activity.startdate, true);
            activityEmbed.addField("End date", activity.enddate, true);
            activityEmbed.addField("Reason", activity.reason, true);
            activityEmbed.setColor("#5b9cc2");
            activityEmbed.setTimestamp();
            activityEmbed.setAuthor("Fiberize");
        }
        message.channel.send(activityEmbed);
    });
}
exports.viewnotice = viewnotice