let Discord = require("discord.js");
const promolog = (channel, guild, author, user, member, highestRole) => {
  channel.send("Check your direct messages for more information.");
  var channel = null;
  if (channel == null) {
    author.createDM().then(chan => {
      channel = chan;

      const collector = new Discord.MessageCollector(
        channel,
        m => m.author.id == author.id,
        { maxMatches: 1 }
      );
      author.send("What is the name of the person you are promoting?");
      collector.on("collect", msg => {
        if (msg.content.toLowerCase() === "cancel") {
          author.send("Cancelled Prompt.");
        } else {
          let sessiontype = msg.content;
          author.send("What is the old rank of the person you are promoting?");
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
              const collector = new Discord.MessageCollector(
                channel,
                m => m.author.id == author.id,
                { maxMatches: 1 }
              );
              author.send(
                "What is the new rank of the person you are promoting?"
              );
              collector.on("collect", msg3 => {
                if (msg.content.toLowerCase() === "cancel") {
                  author.send("Cancelled Prompt.");
                } else {
                  let newRank = msg3.content;
                  author.send("Why are you promoting them?");
                  const collector2 = new Discord.MessageCollector(
                    channel,
                    m => m.author.id == author.id,
                    { maxMatches: 1 }
                  );

                  collector2.on("collect", msg2 => {
                    if (msg1.content.toLowerCase() === "cancel") {
                      author.send("Cancelled Prompt.");
                    } else {
                      let channel = guild.channels.find(
                        c => c.name === "promotion-logs"
                      );
                      let username = msg2.content;

                      author.send(
                        `Thanks! I'm now sending the notification on discord.`
                      );
                      let embed = new Discord.RichEmbed()
                        .setTitle("Promotion log")
                        .addField("Username:", member)
                        .addField("Rank:", highestRole)
                        .addField("User being promoted:", sessiontype)
                        .addField("Rank promoted from:", timestarting)
                        .addField("Rank promoted to:", newRank)
                        .addField("Reason:", username)
                        .setColor("#5b9cc2")
                        .setThumbnail(user.avatarURL)
                        .addFooter("Made By Freezeball1");
                      channel.send(embed);
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  }
};

exports.promolog = promolog;
