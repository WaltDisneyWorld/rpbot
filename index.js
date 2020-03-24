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
const denied = require("./commands/deniedaccess")
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
//Inactivity notice commands
bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.content.startsWith(prefix + "inactivitynotice")) {
      if (
        message.member.roles.find("name", "Middle Rank") ||
        message.member.roles.find("name", "Higher Rank") ||
        message.member.roles.find("name", "Super Rank") ||
        message.member.roles.find("name", "Executive")
      ) {
        const inactivitynotice = require("./commands/inactivitynoticecmds");
        inactivitynotice.inactivitynotice(
          message.channel,
          message.guild,
          message.author,
          bot,
          message.member.displayName,
          message.member.highestRole.name,
          message.member
        );
      } else {
        denied.denied(message.channel);
      }
    }
  }
});

bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.content.startsWith(prefix + "endnotice")) {
      if (message.member.roles.find("name", "on inactivity")) {
        const endnotice = require("./commands/inactivitynoticecmds");
        endnotice.endnotice(
          message.channel,
          message.guild,
          message.author,
          bot,
          message.member.displayName,
          message.member.highestRole.name,
          message.member,
          message.content,
          message
        );
      } else {

        denied.denied(message.channel);
      }
    }
  }
});

bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.content.startsWith(prefix + "viewnotice")) {
      let messageArray = message.content.split(" ");
      let args = messageArray.slice(1);
      let username = args[0];
      if (message.member.roles.find("name", "Super Rank")) {
        const viewnotice = require("./commands/inactivitynoticecmds")
        viewnotice.viewnotice(message)

      } else {
        denied.denied(message.channel);
      }
    }
  }
});

//Session commands 
bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.content.startsWith(prefix + "session")) {
      if (message.member.roles.find("name", "Sessions")) {
        const sessions = require("./commands/sessions");
        sessions.sessions(
          message.channel,
          message.guild,
          message.author,
          bot,
          message.member.displayName,
          message.member.highestRole.name
        );
      } else {
        denied.denied(message.channel);
      }
    }
  }
});
//Moderation commands
bot.on("message", message => {
  if (message.content.startsWith(prefix + "infractions")) {
    if (message.member.roles.find(r => r.name === "Super Rank")) {
      let messageArray = message.content.split(" ");
      let args = messageArray.slice(1);
      let username = args[0];
      if (!username) {
        message.channel.send("Please provide a username");
      } else {
        const infractions = require("./commands/infractions");
        infractions.infractions(message.channel, username);
      }
    } else {
      denied.denied(message.channel);
    }
  }
});
//Logging
bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.content.startsWith(prefix + "demolog")) {
      if (message.member.roles.find("name", "Super Rank")) {
        const demolog = require("./commands/demolog");
        demolog.demolog(
          message.channel,
          message.guild,
          message.author,
          bot,
          message.member.displayName,
          message.member.highestRole.name
        );
      }
    }
  }
});
//Announcement commands
bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.content.startsWith(prefix + "srannounce")) {
      if (message.member.roles.find("name", "Super Rank")) {
        const srannounce = require("./commands/announcements");
        srannounce.srannounce(
          message.channel,
          message.guild,
          message.author,
          bot,
          message.member.displayName,
          message.member.highestRole.name,
          message.member,
          message.content,
          message
        );
      } else {
        denied.denied(message.channel);
      }
    }
  }
});
//Help commands
bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.content.startsWith(prefix + "help")) {
      const help = require("./commands/help");
      help.help(message.author, message.channel);
    }
  }
});

bot.on("ready", () => {
  console.log("Bot Enabled");
  bot.user.setActivity("Fiberize Juicery");
});

bot.login(process.env.DISCORD_TOKEN);



