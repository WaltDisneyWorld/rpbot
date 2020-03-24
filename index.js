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
  if (message.content.startsWith(prefix + "help")) {
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
    embed.setColor(0x59e68e);
    message.channel.send(embed);
  }
});
    
bot.on("ready", () => { 
  console.log("Bot Enabled");
  bot.user.setActivity("Fiberize Juicery"); 
});

bot.login(process.env.DISCORD_TOKEN);



