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
const mongoose = require("mongoose");
const ActivityDB = require("./activity.js");
const DemotionDB = require("./demotions.js");
const WarningsDB = require("./warnings.js");
const SessionsDB = require("./sessions.js");
const InactivityDB = require("./inactivity.js");
const CommandDB = require("./commands.js");
const ChatlogDB = require("./chatlogs.js");
//const DiscordDB = require("./Discchatlogs.js")
//const awardDB = require("./awards.js");
const embed = new Discord.RichEmbed();
mongoose.connect(
  "mongodb+srv://FreezeBall1:Test@cluster0-oovta.mongodb.net/fiberize", { useUnifiedTopology: true },
);
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

bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.content.startsWith(prefix + "logsession")) {
      if (message.member.roles.find("name", "Sessions")) {
        const logsession = require("./commands/sessionlog");
        logsession.logsession(
          message.channel,
          message.guild,
          message.author,
          bot,
          message.member,
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

bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.content.startsWith(prefix + "promolog")) {
      if (message.member.roles.find("name", "Super Rank")) {
        const promolog = require("./commands/promolog");
        promolog.promolog(
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

bot.on("message", message => {
  if (message.channel.id === "692138028583354438") {
    let ActivityToAddVar = message.content;
    var ActivityToAdd = parseInt(ActivityToAddVar, 10);
    //dmuseractivity(message.author.username, message.content);
    ActivityDB.findOne(
      { username: message.author.username },
      (err, activity) => {
        if (err) console.log(err);
        if (!activity) {
          const newActivity = new ActivityDB({
            username: message.author.username,
            activity: ActivityToAdd,
            warnings: 0,
            sessions: 0,
            inactivity: false
          });
          newActivity.save();
          let activityEmbed = new Discord.RichEmbed();
          activityEmbed.setTitle("Activity logged");
          activityEmbed.addField("Username", message.author.username, true);
          activityEmbed.addField("Amount added", ActivityToAdd, true);
          activityEmbed.setColor("#5b9cc2");
          activityEmbed.setTimestamp();
          activityEmbed.setThumbnail(
            "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6"
          );
          activityEmbed.setAuthor("Bondi Beach Roleplay");
          bot.channels.get(`692489993091940467`).send(activityEmbed);
          console.log("Saved");
        } else {
          activity.activity = activity.activity++ + ActivityToAdd;
          activity.save().catch(err => console.log(err));
          let activityEmbed = new Discord.RichEmbed();
          activityEmbed.setTitle("Activity logged");
          activityEmbed.addField("Username", message.author.username, true);
          activityEmbed.addField("Amount added", ActivityToAdd, true);
          activityEmbed.addField("Total", `${activity.activity} minutes`, true);
          activityEmbed.setColor("#5b9cc2");
          activityEmbed.setTimestamp();
          activityEmbed.setThumbnail(
            "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6"
          );
          activityEmbed.setAuthor("Bondi Beach Roleplay");
          bot.channels.get(`692489993091940467`).send(activityEmbed);
          console.log("Saved");
        }
      }
    );
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

//verification commands
bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.content.startsWith(prefix + "fibverify")) {
      if (
        message.member.roles.find("name", "Middle Rank") ||
        message.member.roles.find("name", "High Rank") ||
        message.member.roles.find("name", "Super Rank") ||
        message.member.roles.find("name", "Corporate")
      ) {
        let messageArray = message.content.split(" ");
        let args = messageArray.slice(1);
        let username = args[0];
        const search = require("./commands/search");
        search.search(
          message.channel,
          message.guild,
          message.author,
          bot,
          message.member,
          message.member.highestRole.name,
          username
        );
      } else {
        let embed = new Discord.RichEmbed()
        .setColor("#5b9cc2")
          .setTitle("Error")
          .addField(
            "Missing Permissions",
            "You must be a middle rank or higher to use this command."
          );
        message.channel.send(embed);
      }
    }
  }
});
bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.content.startsWith(prefix + "verifycheck")) {
      if (
        message.member.roles.find("name", "Middle Rank") ||
        message.member.roles.find("name", "High Rank") ||
        message.member.roles.find("name", "Super Rank") ||
        message.member.roles.find("name", "Executive")
      ) {
        let messageArray = message.content.split(" ");
        let args = messageArray.slice(1);
        let username = args[0];
        const verifycheck = require("./commands/verifycheck");
        verifycheck.verifycheck(
          message.channel,
          message.guild,
          message.author,
          bot,
          message.member,
          message.member.highestRole.name,
          username
        );
      } else {
        let embed = new Discord.RichEmbed()
          .setColor("#5b9cc2")
          .setTitle("Error")
          .addField(
            "Missing Permissions",
            "You must be a middle rank or higher to use this command."
          );
        message.channel.send(embed);
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



