const prefix = "!"; //discord bot prefix
const Discord = require("discord.js");
const bot = new Discord.Client();
const robloxranking = require("robloxrankingservice");
const gamekey = "-CkfniAak-Ip-6FbK6G4eA";
const express = require("express");
const app = express();
const request = require("request")
const apiKey = "85b9f5b7a718a8a13c4fcc7e7ad005bd";
const oauthToken =
  "167f004648ff9619ce3ec3072099c3f972ef138f929c57b3594b2d2bcd30c1b8";
const Trello = require("trello-node-api")(apiKey, oauthToken);

app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);

const getId = function(username, cb) {
  if (username) {
    request(
      "https://users.roblox.com/v1/usernames/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json" 
        }, //where???
        body: `{
                "usernames": [
                  "${username}"
                ]
              }`
      },
      function(err, res, data) {
        try {
          if (err) {
            cb({
              success: false
            });
          } else {
            if (res.statusCode == 429) {
              setTimeout(function() {
                module.exports(username, cb);
              }, 2000);
            } else if (res.statusCode == 404) {
              cb({
                success: false
              });
            } else {
              cb({
                success: true,
                data: JSON.parse(data)["data"][0]["id"]
              });
            }
          }
        } catch (err) {
          cb({
            success: false
          });
        }
      }
    );
  } else {
    cb({
      success: false
    });
  }
};

bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.content.startsWith(prefix + "session")) {
      if (message.member.roles.find("name", "Sessions")) {
        message.channel.send(
          "Check your direct messages for more information."
        );
        var channel = null;
        if (channel == null) {
          message.author.createDM().then(chan => {
            channel = chan;

            const collector = new Discord.MessageCollector(
              channel,
              m => m.author.id == message.author.id,
              { maxMatches: 1 }
            );
            message.author.send(
              "What type of session are you hosting? Please reply with either **shift**, or **training**."
            );
            collector.on("collect", msg => {
              if (msg.content.toLowerCase() === "cancel") {
                message.author.send("Cancelled Prompt.");
              } else {
                let sessiontype = msg.content;
                message.author.send(
                  "Alright! What time is the session starting at? Make sure you put the time in EST."
                );
                const collector1 = new Discord.MessageCollector(
                  channel,
                  m => m.author.id == message.author.id,
                  { maxMatches: 1 }
                );

                collector1.on("collect", msg1 => {
                  if (msg1.content.toLowerCase() === "cancel") {
                    message.author.send("Cancelled Prompt.");
                  } else {
                    let timestarting = msg1.content.toUpperCase();
                    message.author.send("Please send your Roblox username.");
                    const collector2 = new Discord.MessageCollector(
                      channel,
                      m => m.author.id == message.author.id,
                      { maxMatches: 1 }
                    );

                    collector2.on("collect", msg2 => {
                      if (msg1.content.toLowerCase() === "cancel") {
                        message.author.send("Cancelled Prompt.");
                      } else {
                        let channel = message.guild.channels.find(
                          c => c.name === "session-announcements"
                        );
                        let username = msg2.content;

                        message.author.send(
                          `Thanks! I'm now sending the notification on Discord and Roblox.`
                        );
                        robloxranking.shout(
                          gamekey,
                          4944028,
                          `A ${sessiontype} is currently being hosted by ${username} at ${timestarting} Eastern Standard Time. Why not come on down and attend?`
                        );
                        let embed = new Discord.RichEmbed()
                          .setTitle("Session Scheduled")
                          .addField("Session Type:", sessiontype)
                          .addField("Session Host:", username)
                          .addField("Starting At:", timestarting)
                          .addField(
                            "Link:",
                            "[Group Page](https://www.roblox.com/groups/5368531/Twirlz#!/about)"
                          )
                          .setColor(0x59e68e)
                          .setThumbnail(bot.user.avatarURL);

                        channel.send("<@&660415759289286657>");
                        channel.send(embed);
                      }
                    });
                  }
                });
              }
            });
          });
        }
      }
    }
  }
});


bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    let role = message.guild.roles.find(
      r => r.name === "Session Notifications"
    );
    const msg = message.content.toLowerCase();
    if (message.author.bot) return;
    const mention = message.mentions.users.first();
    if (msg.startsWith(prefix + "optin")) {
      message.member.addRole(role);
      let embed = new Discord.RichEmbed()
        .setTitle("Session Ping On")
        .addField(
          "You will now be pinged when sessions are hosted.",
          "To disable being pinged for sessions, simply say !optout."
        )
        .setColor("#5b9cc2");
      message.channel.send(embed);
    }
  }
});

bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    let role = message.guild.roles.find(
      r => r.name === "Session Notifications"
    );
    const msg = message.content.toLowerCase();
    if (message.author.bot) return;
    if (msg.startsWith(prefix + "optout")) {
      message.member.removeRole(role);
      let embed = new Discord.RichEmbed()
        .setTitle("Session Ping Off")
        .addField(
          "You will no longer be pinged when sessions are hosted.",
          "To enable the session ping again, simply say !optin."
        )
        .setColor("#5b9cc2");
      message.channel.send(embed);
    }
  }
});

bot.on("message", message => {
  const msg = message.content.toLowerCase();

  let messageArray = message.content.split(" ");
  let args = messageArray.slice(1);
  if (msg.startsWith(prefix + "blacklist")) {
    let reason = args.slice(1).join(" ");
    let username = args[0];
    if (message.member.roles.find(r => r.name === "Senior High Rank")) {
      getId(`${username}`, data => {
        console.log(data);

        var cardRequest = function(data) {
          var data = {
            name: `${username} | ${data.data}`,
            desc: `N/A`,
            pos: "top",
            idList: "5dcb1b8a58b5d75dfe0d6399" //REQUIRED
          };
          Trello.card
            .create(data)
            .then(function(response) {
              console.log("response ", response);
            })
            .catch(function(error) {
              console.log("error", error);
            });
        };

        cardRequest(data);

        const embed = new Discord.RichEmbed()
          .setTitle("User Blacklisted!")
          .addField(
            "The selected user was permanently banned from Twirlz.",
            "They will now be prevented from joining any game associated with Twirlz."
          )
          .addField("Username", `${username}`)
          .addField("UserId", `${data.data}`)
          .setColor(0x59e68e);
        message.channel.send(embed);
      });
    }
  }
});

bot.on("ready", () => { 
  console.log("Bot Enabled");
  bot.user.setActivity("Twirlz Parlor");
});

bot.login(process.env.DISCORD_TOKEN);



