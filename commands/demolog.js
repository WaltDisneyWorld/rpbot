
let Discord = require("discord.js");
const DemotionDB = require("../demotions.js");


const demolog = (channel, guild, author, user, member, highestRole) => {
  const memberss = guild.members;
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
      author.send("What is the name of the person you are demoting?");
      collector.on("collect", msg => {
        if (msg.content.toLowerCase() === "cancel") {
          author.send("Cancelled Prompt.");
        } else {
          let sessiontype = msg.content;
          author.send(
            "What is the old and new rank of the person you are demoting? (format: Old rank, new rank)"
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
              const collector = new Discord.MessageCollector(
                channel,
                m => m.author.id == author.id,
                { maxMatches: 1 }
              );
              author.send("Why are you demoting them?");
              collector.on("collect", msg3 => {
                if (msg.content.toLowerCase() === "cancel") {
                  author.send("Cancelled Prompt.");
                } else {
                  let newRank = msg3.content;
                  author.send("Proof?");
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
                        c => c.name === "demotion-logs"
                      );

                      let username = msg2.attachments.array();

                    author.send(
                        `Thanks! I'm now sending the notification on discord.`
                      );
                      let embed = new Discord.RichEmbed()
                        .setTitle("Demotion log")
                        .addField("Username:", member)
                        .addField("Rank:", highestRole)
                        .addField("User being demoting:", sessiontype)
                        .addField("Rank demoting from and to:", timestarting)
                        .addField("Reason:", newRank)
                        .addField("Proof:", username[0].url)
                        .setColor("#5b9cc2")
                        .setThumbnail(user.avatarURL);
                      channel.send(embed);

                      const newDemotion = new DemotionDB({
                        username: member.displayName,
                        userdemoted: sessiontype,
                        oldnewrank: timestarting,
                        reason: newRank,
                        proof: username[0].url
                      });
                      newDemotion.save();
                      let channel2 = guild.channels.find(
                        c => c.name === "bondi-bot-logs"
                      );
                      channel2.send(
                        `Demotion of ${sessiontype} successfully logged on the database`
                      );
                      const member2 = memberss.find(
                        member2 => member == sessiontype
                      );
                      if (!member) {
                        console.log("User not in discord");
                      } else {
                        let newembed = new Discord.RichEmbed()
                          .setTitle("Demotion log")
                          .addField(
                            "User who demoted you:",
                            member
                          )
                          .addField("Rank demoting from and to:", timestarting)
                          .addField("Reason:", newRank)
                          .addField("Proof:", username[0].url)
                          .setColor("#5b9cc2")
                          .setThumbnail(user.avatarURL);
                        //author.send(newembed);
                      }
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
exports.demolog = demolog;