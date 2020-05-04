const prefix = "!"; //discord bot prefix
const Discord = require("discord.js");
const bot = new Discord.Client();
const robloxranking = require("robloxrankingservice");
const gamekey = "xLQXxsZfUH6OAWtbPaXspaHlZgwJKMUjXRIr";
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
    if (message.member.roles.find(r => r.name === "Bot Developer")) {
      let channel = message.guild.channels.find(
        c => c.name === "📣announcements📣"
      );
      if (message.content.includes(prefix + "fixed")) {
        var embed = new Discord.RichEmbed()
          .setTitle("Bot fixed")
          .setThumbnail(bot.user.avatarURL)
          .setColor(0x59e68e)
          .addField(
            "Greetings!",
            "This message has been sent to you to inform you that the bot has been successfully fixed and is now fully functioning again! We apologise for any inconvenience caused. Any issues with it, please create a ticket!"
          );
        channel.send("@here");
        channel.send(embed);
      }
    }
  }
});
bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.member.roles.find(r => r.name === "Bot Developer")) {
      let messageArray = message.content.split(" ");
      let args = messageArray.slice(1);
      let username = args[0];
      let channel = message.guild.channels.find(
        c => c.name === "bondi-bot-logs"
      );
      if (message.content.includes(prefix + "deletenotice")) {
        InactivityDB.deleteOne({ username: username }, function (err) {
          if (err) return console.log(err);
          if (err) return message.channel.send(err);
          channel.send(`Inactivity notice for ${username} deleted.`);
          message.react("👍");
        });
      }
    }
  }
});

bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.member.roles.find(r => r.name === "Bot Developer")) {
      let messageArray = message.content.split(" ");
      let args = messageArray.slice(1);
      let username = args[0];
      let channel = message.guild.channels.find(
        c => c.name === "bondi-bot-logs"
      );
      if (message.content.includes(prefix + "deletedemotion")) {
        DemotionDB.deleteOne({ username: username }, function (err) {
          if (err) return console.log(err);
          if (err) return message.channel.send(err);
          channel.send(`Demotion for ${username} deleted.`);
          message.react("👍");
        });
      }
    }
  }
});

bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.content.startsWith(prefix + "dm")) {
      if (message.member.roles.find(r => r.name === "Super Rank")) {
        if (message.author.bot) return;
        const mention = message.mentions.users.first();

        if (mention == null) {
          return;
        }
        let messageArray = message.content.split(" ");
        const mentionMessage = messageArray.slice(1);
        let reason = mentionMessage.slice(1).join(" ");
        const embed = new Discord.RichEmbed()
          .setTitle(`You have recieved a DM from ${message.member.displayName}`)
          .addField("Message", `${reason}`)
          .setColor(0x59e68e);
        mention.send(embed);
        message.delete();
        message.channel.send("DMed user.");
        let channel2 = message.guild.channels.find(c => c.name === "dm-logs");
        channel2.send(
          `${message.member.displayName} DMed ${mention} with the following message: ${reason}`
        );
      } else {
        embed.setColor("#0D3AEE");
        embed.setTitle("Unauthorised action");
        embed.setAuthor(
          "Bondi Beach Roleplay",
          "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6",
          "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e"
        );
        embed.setDescription(
          "You are not authorised to use this command, please speak to a member of the corporate team if you think this is a mistake."
        );
        embed.setTimestamp();
        message.channel.send(embed);
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
bot.on("message", message => {
  if (message.content == "!list-dev") {
    const ListEmbed = new Discord.RichEmbed()
      .setTitle(`List of all Devs`)
      .setDescription(
        message.guild.roles
          .get("702449642608263208")
          .members.map(m => m.displayName)
          .join("\n")
      );
    message.channel.send(ListEmbed);
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
  if (message.content == "!list-doo") {
    const ListEmbed = new Discord.RichEmbed()
      .setTitle("Lists of all DOOs")
      .setDescription(
        message.guild.roles
          .get("ID")
          .members.map(m => m.displayName)
          .join("\n")
      );
    message.channel.send(ListEmbed);
  }
});
bot.on("message", message => {
  const test123 = new Set();
  if (message.content == "!request") {
    if (test123.has(message.author.id)) {
      message.reply("Please wait another 30 seconds to make a request.");
    } else {
      bot.channels
        .get(`706982903204020434`)
        .send(`@here You are required at the Prison! By ${message.author}`);
    }
  }
});

bot.on("message", message => {
  if (message.content == "!list-sd") {
    const ListEmbed = new Discord.RichEmbed()
      .setTitle("List of all SDs")
      .setDescription(
        message.guild.roles
          .get("ID")
          .members.map(m => m.displayName)
          .join("\n")
      );
    message.channel.send(ListEmbed);
  }
});
bot.on("message", message => {
  let messageArray = message.content.split(" ");
  let args = messageArray.slice(1);
  if (message.content.startsWith(prefix + "reform")) {
    if (message.member.roles.find(r => r.name === "Bot Developer")) {
      let channel = message.guild.channels.find(
        c => c.name === "bondi-bot-logs"
      );
      ActivityDB.find(
        { activity: { $lt: 60 }, inactivity: false },
        (err, activity) => {
          console.log(activity);
          for (var activity of activity) {
            let activityEmbed = new Discord.RichEmbed()
              .setTitle(activity.username)
              .setDescription(activity.activity)
              .setColor(0x59e68e);
            message.channel.send(activityEmbed);
          }
        }
      );
      var conditions = { activity: { $lt: 60 }, inactivity: false },
        update = { $inc: { warnings: 1 } },
        options = { multi: true };

      ActivityDB.update(conditions, update, options, callback);
      function callback(err, numAffected) {
        console.log(numAffected);
        channel.send(`Number of people warned: ${numAffected.n}`);
      }
    }
  }
});

bot.on("message", message => {
  let messageArray = message.content.split(" ");
  let args = messageArray.slice(1);
  if (message.content.startsWith(prefix + "reset-activity")) {
    if (message.member.roles.find(r => r.name === "Bot Developer")) {
      let channel = message.guild.channels.find(
        c => c.name === "bondi-bot-logs"
      );
      let channel2 = message.guild.channels.find(
        c => c.name === "➟announcements"
      );
      var conditions = { activity: { $gt: 0 } },
        update = { $set: { activity: 0 } },
        options = { multi: true };

      ActivityDB.update(conditions, update, options, callback);
      function callback(err, numAffected) {
        console.log(numAffected);
        channel.send(`Number of activity changed: ${numAffected.n}`);
      }
      message.channel.send("Reset all activity back to 0!");
      embed.setTitle("Activity reset");
      embed.setDescription(
        "Activity for this week has now been reset, please keep up the good work. All warnings have been logged."
      );
      embed.setColor(0x59e68e);
      channel2.send("@everyone");
      channel2.send(embed);

      var conditions = { warnings: 2 },
        update = { $set: { warnings: 0 } },
        options = { multi: true };

      ActivityDB.update(conditions, update, options, callback);
    }
  }
});

bot.on("message", message => {
  let messageArray = message.content.split(" ");
  let args = messageArray.slice(1);
  if (message.content.startsWith(prefix + "nonwarnreform")) {
    if (message.member.roles.find(r => r.name === "Bot Developer")) {
      let channel = message.guild.channels.find(
        c => c.name === "bondi-bot-logs"
      );
      ActivityDB.find(
        { activity: { $lt: 60 }, inactivity: false },
        (err, activity) => {
          console.log(activity);
          for (var activity of activity) {
            let activityEmbed = new Discord.RichEmbed();
            activityEmbed.setTitle("Quota");
            activityEmbed.addField(
              "Usernames and activity",
              activity.username + " | " + activity.activity + "\n"
            );
            activityEmbed.setColor(0x59e68e);
            message.channel.send(activityEmbed);
          }
        }
      );
    }
  }
});

bot.on("message", message => {
  let messageArray = message.content.split(" ");
  let args = messageArray.slice(1);
  if (message.content.startsWith(prefix + "activitywarn")) {
    if (message.member.roles.find(r => r.name === "Bot Developer")) {
      let channel = message.guild.channels.find(
        c => c.name === "bondi-bot-logs"
      );
      var conditions = { username: args },
        update = { $inc: { warnings: 1 } },
        options = { multi: false };

      ActivityDB.update(conditions, update, options, callback);
      console.log(args);
      message.channel.send("Activity warnings increased by 1!");
      function callback(err, numAffected) {
        console.log(numAffected);
        channel.send(
          `Number of warnings changed: ${numAffected.n} for ${args}`
        );
      }
    }
  }
});

bot.on("message", message => {
  let messageArray = message.content.split(" ");
  let args = messageArray.slice(1);
  if (message.content.startsWith(prefix + "activity-warnings")) {
    if (message.member.roles.find(r => r.name === "Bot Developer")) {
      let channel = message.guild.channels.find(c => c.name === "warning-logs");
      ActivityDB.find({ warnings: { $gt: 0 } }, (err, activity) => {
        console.log(activity);
        for (var activity of activity) {
          let activityEmbed = new Discord.RichEmbed()
            .setTitle(activity.username)
            .setDescription(activity.activity)
            .setDescription(activity.warnings)
            .setColor(0x59e68e);
          message.channel.send(activityEmbed);
        }
      });
    }
  }
});
bot.on("message", message => {
  let messageArray = message.content.split(" ");
  let args = messageArray.slice(1);
  if (message.content.startsWith(prefix + "2-warnings")) {
    if (message.member.roles.find(r => r.name === "Bot Developer")) {
      let channel = message.guild.channels.find(
        c => c.name === "bot-demotion-logs"
      );
      ActivityDB.find(
        { warnings: 2 },
        (err, activity) => {
          console.log(activity);
          for (var activity of activity) {
            let activityEmbed = new Discord.RichEmbed()
              .setTitle(activity.username)
              .setDescription(activity.activity)
              .setColor(0x59e68e);
            message.channel.send(activityEmbed);
            channel.send(activity.username)
          }
        }
      );
    }
  }
});



bot.on("message", message => {
  if (message.channel.id === "696287724872663100") {
    let channel = message.guild.channels.find(c => c.name === "demotion-logs");
    let embed = new Discord.RichEmbed()
      .setTitle("Demotion log")
      .addField("Username:", "FreezeBall1")
      .addField("User being demoting:", message.content)
      .addField(
        "Reason:",
        "Did not pass the quota for 2 weeks in a row. Demoted 2 ranks."
      )
      .setColor(0x59e68e)
      .setThumbnail(bot.user.avatarURL);
    channel.send(embed);
    const newDemotion = new DemotionDB({
      username: "FreezeBall1",
      userdemoted: message.content,
      reason: "Did not pass the quota for 2 weeks in a row. Demoted 2 ranks."
    });
    newDemotion.save();
  }
});
bot.on("message", message => {
  if (message.channel.id === "705242585559597096") {
    let ActivityToAddVar = message.content;
    var ActivityToAdd = parseInt(ActivityToAddVar, 10);
    ActivityDB.findOne(
      { username: message.member.displayName },
      (err, activity) => {
        if (err) console.log(err);
        if (!activity) {
          const newActivity = new ActivityDB({
            username: message.member.displayName,
            activity: ActivityToAdd,
            warnings: 0,
            sessions: 0,
            inactivity: false
          });
          newActivity.save();
          let activityEmbed = new Discord.RichEmbed();
          activityEmbed.setTitle("Activity logged");
          activityEmbed.addField("Username", message.member.displayName, true);
          activityEmbed.addField("Amount added", ActivityToAdd, true);
          activityEmbed.setColor(0x59e68e);
          activityEmbed.setTimestamp();
          activityEmbed.setThumbnail(
            "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6"
          );
          activityEmbed.setAuthor("Bondi Beach Roleplay");
          bot.channels.get(`660981859601088543`).send(activityEmbed);
          console.log("Saved");
        } else {
          activity.activity = activity.activity++ + ActivityToAdd;
          activity.save().catch(err => console.log(err));
          let activityEmbed = new Discord.RichEmbed();
          activityEmbed.setTitle("Activity logged");
          activityEmbed.addField("Username", message.member.displayName, true);
          activityEmbed.addField("Amount added", ActivityToAdd, true);
          activityEmbed.addField("Total", `${activity.activity} minutes`, true);
          activityEmbed.setColor(0x59e68e);
          activityEmbed.setTimestamp();
          activityEmbed.setThumbnail(
            "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6"
          );
          activityEmbed.setAuthor("Bondi Beach Roleplay");
          bot.channels.get(`660981859601088543`).send(activityEmbed);
          console.log("Saved");
        }
      }
    );
  }
});
bot.on("message", message => {
  if (message.content.startsWith("!myinfo")) {
    if (
      message.member.roles.find("name", "Middle Rank") ||
      message.member.roles.find("name", "Higher Rank") ||
      message.member.roles.find("name", "Super Rank") ||
      message.member.roles.find("name", "Corporate")
    ) {
      ActivityDB.findOne(
        { username: message.member.displayName },
        (err, activity) => {
          if (err) console.log(err);
          let embed = new Discord.RichEmbed()
            .setTitle("**ACTIVITY**")
            .setDescription(
              `Your activity is logged to determine your work ethic and overall status as a staff member in regards to activity. Having a higher level of activity will get you a higher chance of a promotion, as the Corporate team likes to see activity from staff members.`
            )
            .setColor(0x59e68e)
            .setThumbnail(message.author.displayAvatarURL)
            .setTimestamp();
         
          if (!activity) {
            embed.addField("Minutes", "0", true);
            embed.addField("Hours", "0", true);
            embed.addField("Staff Warnings");
            embed.addField("Sessions Hosted", activity.sessions);
            return message.author.send(embed).then(message.author.send(embed));
          } else {
            embed.addField("Minutes", activity.activity, true);
            embed.addField("Hours", activity.activity / 60, true);
            embed.addField("Staff Warnings");
            embed.addField("Sessions Hosted", activity.sessions);
          }
        }
      );
    } else {
      let embed = new Discord.RichEmbed()
        .setColor(0x59e68e)
        .setTitle("Error")
        .addField(
          "Missing Permissions",
          "You must be an HR or higher to use this command."
        );
      message.channel.send(embed);
    }
  }
});


bot.on("message", message => {
  if (message.content == "!list-pro") {
    const ListEmbed = new Discord.RichEmbed()
      .setTitle(`List of all PROs`)
      .setDescription(
        message.guild.roles
          .get("ID")
          .members.map(m => m.displayName)
          .join("\n")
      );
    message.channel.send(ListEmbed);
  }
});

bot.on("message", message => {
  if (message.content == "!list-sr") {
    const ListEmbed = new Discord.RichEmbed()
      .setTitle(`List of all SRs`)
      .setDescription(
        message.guild.roles
          .get("ID")
          .members.map(m => m.displayName)
          .join("\n")
      );
    message.channel.send(ListEmbed);
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
          activityEmbed.setAuthor("Noctis Asylum");
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
          activityEmbed.setAuthor("Noctis Asylum");
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
    if (message.content.startsWith(prefix + "naverify")) {
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
  bot.user.setActivity("Prison Roleplay! | Management");
});

bot.login(process.env.DISCORD_TOKEN);



