// variables
const customKey = "yesthisisacustomkey"; //custom key, must match the roblox version
const prefix = "!"; //discord bot prefix
const gameLink = "https://www.roblox.com/games/4496305968/Bondi-Verification"; //link to your roblox game
const express = require("express");
const app = express();
const fs = require("fs");
const Discord = require("discord.js");
const bot = new Discord.Client();
const robloxranking = require("robloxrankingservice");
const gamekey = "-CkfniAak-Ip-6FbK6G4eA";
const GoogleSpreadsheet = require("google-spreadsheet");
const { promisify } = require("util");
const util = require("util");
const cooldowns = new Discord.Collection();
const mongoose = require("mongoose");
const ActivityDB = require("./activity.js");
const DemotionDB = require("./demotions.js");
const WarningsDB = require("./warnings.js");
const SessionsDB = require("./sessions.js");
const InactivityDB = require("./inactivity.js");
const CommandDB = require("./commands.js");
const ChatlogDB = require("./chatlogs.js");
const DiscordDB = require("./Discchatlogs.js")
const awardDB = require("./awards.js");
const embed = new Discord.RichEmbed();
const DISCORD_TOKEN = 'NTk4NzE0NjM0MDY0NzU2NzM3.XqfekA.TEyXKGBP6M792Mh7NBbVrN_bM0w'
mongoose.connect(
  "mongodb+srv://FreezeBall1:Test@cluster0-oovta.mongodb.net/bondi", { useUnifiedTopology: true },
);
bot.login(DISCORD_TOKEN);

var lbamount = 0;
const Canvas = require("canvas");
const roblox = require("noblox.js");
const discord = require("discord.js");

require("./modules/functions.js")(bot);
// sends bot to the cmd folder where cmds are stored, yknow, to keep index clean :D
// insert your commands in a folder called cmds
fs.readdir("./commands/", (err, files) => {
  if (err) {
    return console.error(err);
  }
  // allow the files to be detectable by glitch, pop the "." so it can be read
  let jsfiles = files.filter(f => f.split(".").pop() === "js");
  if (jsfiles.length <= 0) {
    // log in console if no cmds are present
    console.log("No commands are present.");
    return;
  }
  console.log(`Loading ${jsfiles.length} js files.`);
});


//////////////////////////////////////////////////////////////////////////////////////////
//announcements and shit

bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.member.roles.find(r => r.name === "Bot Developer")) {
      let channel = message.guild.channels.find(
        c => c.name === "public-notifications"
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
        channel.send("@everyone");
        channel.send(embed);
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
  if (message.content.startsWith(prefix + "infractions")) {
    if (message.member.roles.find(r => r.name === "Super Rank")|| message.member.roles.find("name", "Higher Rank")) {
      let messageArray = message.content.split(" ");
      let args = messageArray.slice(1);
      let username = args[0];
      if (!username) {
        message.channel.send("Cannot find user");
      } else {
        const infractions = require("./commands/infractions");
        infractions.infractions(message.channel, username);
      }
    }
  }
});

bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.content.startsWith(prefix + "bondiverify")) {
      if (
        message.member.roles.find("name", "Middle Rank") ||
        message.member.roles.find("name", "Higher Rank") ||
        message.member.roles.find("name", "Super Rank") ||
        message.member.roles.find("name", "Executive")
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
          .setColor(0x59e68e)
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
        message.member.roles.find("name", "Higher Rank") ||
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
          .setColor(0x59e68e)
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
    if (message.content.startsWith(prefix + "promolog")) {
      if (message.member.roles.find("name", "Super Rank")|| message.member.roles.find("name", "Higher Rank")) {
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

// let mark = message.guild.members.get("116319120844259329")

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

////////////////////////////////////////////////

bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    let role = message.guild.roles.find(
      r => r.name === "Update Notifications"
    );
    const msg = message.content.toLowerCase();
    if (message.author.bot) return;
    const mention = message.mentions.users.first();
    if (msg.startsWith(prefix + "updatepingon")) {
      message.member.addRole(role);
      let embed = new Discord.RichEmbed()
        .setTitle("Update Ping On")
        .addField(
          "You will now be pinged when updates are made.",
          "To disable being pinged for updates, simply say !updatepingoff."
        )
        .setColor("#5b9cc2");
      message.channel.send(embed);
    }
  }
});

bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    let role = message.guild.roles.find(
      r => r.name === "Update Notifications"
    );
    const msg = message.content.toLowerCase();
    if (message.author.bot) return;
    if (msg.startsWith(prefix + "updatepingoff")) {
      message.member.removeRole(role);
      let embed = new Discord.RichEmbed()
        .setTitle("Update Ping Off")
        .addField(
          "You will no longer be pinged when updates are made.",
          "To enable the update ping again, simply say !updatepingon."
        )
        .setColor("#5b9cc2");
      message.channel.send(embed);
    }
  }
});

bot.on("message", message => {
  if (message.content == "!list-doe") {
    const ListEmbed = new Discord.RichEmbed()
      .setTitle(`List of all DOEs`)
      .setDescription(
        message.guild.roles
          .get("635613005861879828")
          .members.map(m => m.displayName)
          .join("\n")
      );
    message.channel.send(ListEmbed);
  }
});

bot.on("message", message => {
  if (message.content == "!list-doo") {
    const ListEmbed = new Discord.RichEmbed()
      .setTitle("Lists of all DOOs")
      .setDescription(
        message.guild.roles
          .get("660251668268449844")
          .members.map(m => m.displayName)
          .join("\n")
      );
    message.channel.send(ListEmbed);
  }
});

bot.on("message", message => {
  if (message.content == "!list-sd") {
    const ListEmbed = new Discord.RichEmbed()
      .setTitle("List of all SDs")
      .setDescription(
        message.guild.roles
          .get("660466314095362048")
          .members.map(m => m.displayName)
          .join("\n")
      );
    message.channel.send(ListEmbed);
  }
});

bot.on("message", message => {
  if (message.content == "!list-pro") {
    const ListEmbed = new Discord.RichEmbed()
      .setTitle(`List of all PROs`)
      .setDescription(
        message.guild.roles
          .get("660306732513493014")
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
          .get("627593987783655427")
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
        .get(`630196014409842690`)
        .send(`@here You are required at the beach! By ${message.author}`);
    }
  }
});

bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.content.startsWith(prefix + "srannounce")) {
      if (message.member.roles.find("name", "Executive")) {
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
            message.author.send("Title of the announcement:");
            collector.on("collect", msg => {
              let announcetitle = msg.content;
              message.author.send("Description of the announcement:");
              const collector1 = new Discord.MessageCollector(
                channel,
                m => m.author.id == message.author.id,
                { maxMatches: 1 }
              );
              collector1.on("collect", msg1 => {
                let announcedescription = msg1.content;
                let channel = message.guild.channels.find(
                  c => c.name === "sr-notifications"
                );
                let embed = new Discord.RichEmbed()
                  .setTitle(announcetitle)
                  .setColor(0x59e68e)
                  .setThumbnail(bot.user.avatarURL)
                  .setDescription(announcedescription);
                channel.send("@everyone");
                channel.send(embed);
                message.author.send(
                  `The notification is now being sent in sr notifications.`
                );
              });
            });
          });
        }
      }
    }
  }
});

bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    let msg = message.content.toLowerCase();
    if (msg.startsWith(prefix + "staffserverlink")) {
      if (
        message.member.roles.find("name", "Low Rank") ||
        message.member.roles.find("name", "Middle Rank") ||
        message.member.roles.find("name", "Higher Rank") ||
        message.member.roles.find("name", "Super Rank") ||
        message.member.roles.find("name", "Executive")
      ) {
        message.channel.send(
          "Please check your direct messages for more information."
        );
        let embed = new Discord.RichEmbed()
          .setTitle("Staff Server Link")
          .addField(
            `Greetings, ${message.author.username}!`,
            "We see you have requested an invite link to the Bondi staff server. As our systems have found that you are a verified Bondi staff member, the link has been provided below."
          )
          .addField("Link:", "https://discord.gg/2dtPzsB")
          .addField(
            "Please Note:",
            "Distribution of the staff server invite link will result in a blacklist and permanent demotion to Beach Guest."
          )
          .setColor(0x59e68e);
        message.author.send(embed);
      }
    }
  }
});

bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    let msg = message.content.toLowerCase();
    if (msg.startsWith(prefix + "appealslink")) {
      if (
        message.member.roles.find("name", "Lower Rank") ||
        message.member.roles.find("name", "Middle Rank") ||
        message.member.roles.find("name", "Higher Rank") ||
        message.member.roles.find("name", "Super Rank") ||
        message.member.roles.find("name", "Executive")
      ) {
        message.channel.send(
          "Please check your direct messages for more information."
        );
        let embed = new Discord.RichEmbed()
          .setTitle("Staff Server Link")
          .addField(
            `Greetings, ${message.author.username}!`,
            "We see you have requested an invite link to the Bondi appeals server. As our systems have found that you are a verified Bondi staff member, the link has been provided below."
          )
          .addField("Link:", "https://discordapp.com/invite/sZdqxY3")
          .setColor(0x59e68e);
        message.author.send(embed);
      }
    }
  }
});

bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.content.startsWith(prefix + "announce")) {
      if (message.member.roles.find("name", "Super Rank")) {
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
            message.author.send("Title of the announcement:");
            collector.on("collect", msg => {
              let announcetitle = msg.content;
              message.author.send("Description of the announcement:");
              const collector1 = new Discord.MessageCollector(
                channel,
                m => m.author.id == message.author.id,
                { maxMatches: 1 }
              );
              collector1.on("collect", msg1 => {
                let announcedescription = msg1.content;
                let channel = message.guild.channels.find(
                  c => c.name === "public-notifications"
                );
                let embed = new Discord.RichEmbed()
                  .setTitle(announcetitle)
                  .setColor(0x59e68e)
                  .setThumbnail(bot.user.avatarURL)
                  .setDescription(announcedescription);
                channel.send("@everyone");
                channel.send(embed);
                message.author.send(
                  `The notification is now being sent in public notifications.`
                );
              });
            });
          });
        }
      }
    }
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
  if (message.content.startsWith(prefix + "updatelb")) {
    if (message.member.roles.find(r => r.name === "Bot Developer")) {
      let messageArray = message.content.split(" ");
      let args = messageArray.slice(1);
      let username = args[0];
      lbamount = username;
      message.channel.send(lbamount);
      message.channel.send(username);
    }
  }
});

const activityEmbed = new Discord.RichEmbed();
bot.on("message", message => {
  let messageArray = message.content.split(" ");
  let args = messageArray.slice(1);
  if (message.content.startsWith(prefix + "leaderboard")) {
    if (message.member.roles.find(r => r.name === "Bot Developer")) {
      if (activityEmbed.fields > 24) {
        message.channel.send("Too many fields needed");
      } else {
        ActivityDB.find({ activity: { $gt: lbamount } }, (err, activity) => {
          //console.log(activity);
          activity.forEach(activity => {
            activityEmbed.setTitle("Leaderboard");
            activityEmbed.addField(activity.username, activity.activity);
            activityEmbed.setColor(0x59e68e);
          });
          message.channel.send(activityEmbed);
        }).sort({ activity: -1 });
      }
    }
  }
});

bot.on("message", message => {
  let messageArray = message.content.split(" ");
  let name = messageArray.slice(1).join(" ");
  if (message.content.startsWith(prefix + "makerole")) {
    if (message.member.roles.find(r => r.name === "Bot Developer")) {
      message.guild.createRole({ name: name, permissions: ["READ_MESSAGES"] });
      message.channel.send(`Created Role!`);
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
});


//////////////////////////////////////////////////////////////////////////////////

//activity system

bot.on("message", message => {
  if (message.channel.id === "685978624624689203") {
    let ActivityToAddVar = message.content;
    var ActivityToAdd = parseInt(ActivityToAddVar, 10);
    dmuseractivity(message.author.username, message.content);
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
          activityEmbed.setColor(0x59e68e);
          activityEmbed.setTimestamp();
          activityEmbed.setThumbnail(
            "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6"
          );
          activityEmbed.setAuthor("Bondi Beach Roleplay");
          bot.channels.get(`685978560359694394`).send(activityEmbed);
          console.log("Saved");
        } else {
          activity.activity = activity.activity++ + ActivityToAdd;
          activity.save().catch(err => console.log(err));
          let activityEmbed = new Discord.RichEmbed();
          activityEmbed.setTitle("Activity logged");
          activityEmbed.addField("Username", message.author.username, true);
          activityEmbed.addField("Amount added", ActivityToAdd, true);
          activityEmbed.addField("Total", `${activity.activity} minutes`, true);
          activityEmbed.setColor(0x59e68e);
          activityEmbed.setTimestamp();
          activityEmbed.setThumbnail(
            "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6"
          );
          activityEmbed.setAuthor("Bondi Beach Roleplay");
          bot.channels.get(`685978560359694394`).send(activityEmbed);
          console.log("Saved");
        }
      }
    );
  }
});




bot.on("message", message => {
  if (message.channel.id === "680530108607496196") {
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
  if (message.channel.id === "673113353803137054") {
    const newChatlog = new ChatlogDB({
      username: message.author.username,
      content: message.content
    });
    newChatlog.save();
  }
});

bot.on("message", message => {
  if (message.channel.id === "616508092594782218") {
    const newCommand = new CommandDB({
      username: message.author.username,
      content: message.content
    });
    newCommand.save();
  }
});

// bot.on("message", message => {
//   if (message.channel.id === "616508092594782218") {
//     if (message.author.username === "officersmith23") {
//       bot.users.get("339694791543619584").send("Officersmith is in game.");

//     }
//   }
// });

bot.on("message", message => {
  if (message.channel.id === "616508092594782218") {
    if (
      message.content.includes("kick all") ||
      message.content.includes("ban all") ||
      message.content.includes(
        "ref all" ||
        message.content.includes("pban all") ||
        message.content.includes("res all") ||
        message.content.includes("give all") ||
        message.content.includes("btools") ||
        message.content.includes("speed")
      )
    ) {
      let channel = message.guild.channels.find(
        c => c.name === "sr-discussion"
      );
      channel.send(
        `Possible AA attack @here ${message.author.username} used the command **${message.content}**`
      );
    }
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
            return message.author.send(embed).then(message.author.send(embed2));
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
  let messageArray = message.content.split(" ");
  let args = messageArray.slice(1);
  if (message.content.startsWith(prefix + "info")) {
    let username = args[0];
    if (message.member.roles.find("name", "Executive")) {
      ActivityDB.findOne({ username: username }, (err, activity) => {
        if (err) console.log(err);
        let embed = new Discord.RichEmbed()
          .setTitle("Activity")
          .setDescription(`Activity under user ${username}`)
          .setColor(0x59e68e)
          .setThumbnail(
            "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6"
          )
          .setTimestamp();
        if (!activity) {
          embed.addField("Minutes", "0", true);
          embed.addField("Hours", "0", true);
          embed.addField("Activity Warnings", "0");
          embed.addField("Staff Warnings");
          embed.addField("Sessions Hosted", "0");
          return message.author.send(embed);
        } else {
          embed.addField("Minutes", activity.activity, true);
          embed.addField("Hours", activity.activity / 60, true);
          embed.addField("Activity Warnings", activity.warnings);
          embed.addField("Staff Warnings");
          embed.addField("Sessions Hosted", activity.sessions);

          return message.author.send(embed);
        }
      });
    }
  }
});

bot.on("message", message => {
  let messageArray = message.content.split(" ");
  let args = messageArray.slice(1);
  if (message.content.startsWith(prefix + "channelactivity")) {
    let username = args[0];
    if (message.member.roles.find(r => r.name === "Executive")) {
      ActivityDB.findOne({ username: username }, (err, activity) => {
        if (err) console.log(err);
        let embed = new Discord.RichEmbed()
          .setTitle("Activity")
          .setDescription(`Activity logs for ${username}`)
          .setColor(0x59e68e)
          .setThumbnail(
            "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6"
          )
          .setTimestamp();
        if (!activity) {
          embed.addField("Total Activity", "0", true);
          return message.channel.send(embed);
        } else {
          embed.addField("Total Activity", activity.activity, true);
          embed.addField("Total Warnings", activity.warnings, true);
          return message.channel.send(embed);
        }
      });
    }
  }
});

//api stuff ignore

app.use(express.static("public"));
app.use(express.json());

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
///////////////////////////////////////////////////////////////////

// bot.on("message", async message => {
//   if (message.content.startsWith(prefix + "!verifyhelp")) {
//     let embed = new Discord.RichEmbed();
//     embed.setTitle("**ROBLOX DISCORD VERIFICATION**");
//     embed.setColor("#5b9cc2");
//     embed.setFooter(
//       "Roblox Discord Verification | Verification API created by Vabajaa | Discord Bot created by azlentic"
//     );
//     embed.setTimestamp();
//     embed.setThumbnail(
//       "https://cdn.discordapp.com/attachments/475475163148713994/638237555262750732/Discord-Logo-White.png"
//     );
//     embed.addField("Commands", "!verfiy");

//     message.author.send(embed);
//     return;
//   }

//   let args = message.content.split(" ");
//   if (args[0] == prefix + "bondiverify") {
//     if (
// message.member.roles.find("name", "Middle Rank") ||
// message.member.roles.find("name", "Higher Rank") ||
// message.member.roles.find("name", "Super Rank") ||
// message.member.roles.find("name", "Executive")
//     ) {
//       if (args[1]) {
//         pending(message);
//       } else {
//         message.reply(
//           "Please specify a ROBLOX account \n \nexample: !bondiverify azlentic"
//         );
//       }
//     } else {
// let embed = new Discord.RichEmbed()
//   .setColor(0x59e68e)
//   .setTitle("Error")
//   .addField(
//     "Missing Permissions",
//     "You must be a middle rank or higher to use this command."
//   );
// message.channel.send(embed);
//     }
//   }
// });

async function accessSpreadsheet() {
  const doc = new GoogleSpreadsheet(
    "184QdhaUAGU3LJPGE3aSIqpCl-d2oogjlWvBNmrtpqeg"
  );
  await promisify(doc.useServiceAccountAuth)(creds);
  const info = await promisify(doc.getInfo)();
  const sheet = info.worksheets[0];
  const sheet2 = info.worksheets[1];
  const sheet3 = info.worksheets[2];

  // const rows = await promisify(sheet.getRows)({
  //     offset: 1,
  //     query: `username = azlentic`
  // });

  // bot.on('message', msg => {
  //     if (msg.content == '!info') {
  //         async function info(sheet) {
  //             const rows = await promisify(sheet.getRows)({
  //                 offset: 1,
  //                 query: `username = ${msg.guild.member.username}`
  //             });
  //             console.log(rows)
  //             msg.channel.send(rows[0].username)
  //             for (var row of rows) {
  //                 msg.channel.send(row.activity + "\n");
  //                 console.log(row)

  //             }

  //         }

  //         info(sheet)

  //     }
  // });

  //   bot.on("message", msg => {
  //     if (msg.guild !== null && msg.member !== null) {
  //       if (msg.content == "!myactivity") {
  //         var counts = 0;
  //         async function info(sheet) {
  //           const rows = await promisify(sheet.getRows)({
  //             offset: 1,
  //             query: `username = ${msg.member.displayName}`
  //           });
  //           var exampleEmbed = new Discord.RichEmbed();
  //           var totalactivity = 0;
  //           exampleEmbed.addField("Username:", rows[0].username, false);
  //           for (var row of rows) {
  //             totalactivity = totalactivity + parseInt(row.activity);
  //             exampleEmbed.setTitle(msg.author.username);
  //             exampleEmbed.setColor("#0D3AEE");
  //             exampleEmbed.setURL("");
  //             exampleEmbed.setAuthor(
  //               "Bondi Beach Roleplay",
  //               "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6",
  //               "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e"
  //             );
  //             exampleEmbed.setDescription(`Logs for ${msg.author}`);
  //             exampleEmbed.setImage(
  //               "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6"
  //             );
  //             exampleEmbed.setTimestamp();
  //           }
  //           exampleEmbed.addField(`total activity: `, totalactivity, false);
  //           msg.author.send(exampleEmbed);
  //           // console.log(rows)
  //           // msg.channel.send(rows[0].username)
  //           // for (var row of rows) {
  //           //     msg.channel.send(row.activity + "\n");
  //           //     console.log(row)

  //           // }
  //         }

  //         info(sheet);
  //       }
  //     }
  //   });

  //   bot.on("message", msg => {
  //     if (msg.channel.id === "639576517612929024") {
  //       const row = {
  //         username: msg.author.username,
  //         activity: msg.content
  //       };

  //       promisify(sheet.addRow)(row);
  //     }
  //   });
  //   bot.on("message", msg => {
  //     if (msg.channel.id === "639576882140020764") {
  //       const row = {
  //         Inactivity: msg.content
  //       };

  //       promisify(sheet2.addRow)(row);
  //     }
  //   });

  //   // rows.forEach(row => {
  //   //     Activity(row);
  //   // });

  //   // bot.on('message', msg => {
  //   //     if (msg.content == '!info') {
  //   //         const rows = promisify(sheet.getRows)({
  //   //             offset: 1,
  //   //             query: `username = ${msg.author.username}`
  //   //         });
  //   //         rows.forEach(row => {
  //   //             msg.channel.send(row)
  //   //         });

  //   //     }
  //   // });

  bot.on("message", msg => {
    if (msg.guild !== null && msg.member !== null) {
      if (msg.content === "!activity") {
        var exampleEmbed = new Discord.RichEmbed();
        if (msg.member.roles.find("name", "Executive")) {
          doc.getInfo(function (err, info) {
            const sheet = info.worksheets[0];
            exampleEmbed.setTitle(sheet.title);
            exampleEmbed.setColor("#0D3AEE");
            exampleEmbed.setURL(
              "https://docs.google.com/spreadsheets/d/184QdhaUAGU3LJPGE3aSIqpCl-d2oogjlWvBNmrtpqeg/edit#gid=0"
            );
            exampleEmbed.setAuthor(
              "Bondi Beach Roleplay",
              "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6",
              "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e"
            );
            exampleEmbed.setDescription("Activity logs sheet info.");
            exampleEmbed.addField("Row Count:", sheet.rowCount, true);
            exampleEmbed.addField("Column count:", sheet.colCount, true);
            exampleEmbed.setImage(
              "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6"
            );
            exampleEmbed.setTimestamp();

            msg.channel.send(exampleEmbed);
          });
        } else {
          exampleEmbed.setColor("#0D3AEE");
          exampleEmbed.setTitle("Unauthorised action");
          exampleEmbed.setAuthor(
            "Bondi Beach Roleplay",
            "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6",
            "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e"
          );
          exampleEmbed.setDescription(
            "You are not authorised to use this command, please speak to a member of the corporate team if you think this is a mistake."
          );
          exampleEmbed.setTimestamp();

          msg.channel.send(exampleEmbed);
        }
      }
    }
  });

  bot.on("message", msg => {
    if (msg.guild !== null && msg.member !== null) {
      if (msg.content === "!inactivity") {
        var exampleEmbed = new Discord.RichEmbed();
        if (msg.member.roles.find("name", "Executive")) {
          doc.getInfo(function (err, info) {
            const sheet = info.worksheets[1];
            exampleEmbed.setTitle(sheet.title);
            exampleEmbed.setColor("#0D3AEE");
            exampleEmbed.setURL(
              "https://docs.google.com/spreadsheets/d/184QdhaUAGU3LJPGE3aSIqpCl-d2oogjlWvBNmrtpqeg/edit#gid=1371951793"
            );
            exampleEmbed.setAuthor(
              "Bondi Beach Roleplay",
              "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6",
              "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e"
            );
            exampleEmbed.setDescription("Inactivity Notice info.");
            exampleEmbed.addField("Row Count:", sheet.rowCount, true);
            exampleEmbed.addField("Column count:", sheet.colCount, true);
            exampleEmbed.setImage(
              "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6"
            );
            exampleEmbed.setTimestamp();

            msg.channel.send(exampleEmbed);
          });
        } else {
          exampleEmbed.setTitle("Unauthorised action");
          exampleEmbed.setColor("#0D3AEE");
          exampleEmbed.setAuthor(
            "Bondi Beach Roleplay",
            "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6",
            "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e"
          );
          exampleEmbed.setDescription(
            "You are not authorised to use this command, please speak to a member of the corporate team if you think this is a mistake."
          );
          exampleEmbed.setTimestamp();

          msg.channel.send(exampleEmbed);
        }
      }
    }
  });

  bot.on("message", message => {
    if (message.guild !== null && message.member !== null) {
      if (message.member.roles.find(r => r.name === "Executive")) {
        let args = message.content.substring(prefix.length).split(" ");
        switch (args[0]) {
          case "addcp":
            const filter = m => m.author.id === message.author.id;
            message.channel.send("What is the username of the CP?");
            message.channel
              .awaitMessages(filter, {
                max: 1,
                time: 200000
              })
              .then(collected => {
                if (collected.first().content === "cancel") {
                  return message.channel.send("Cancelled prompt.");
                }
                let thawgbwie = collected.first().content;

                var TotalNum = StartingNum++ + 1;

                let rank = collected.first().content;
                const row = {
                  username: thawgbwie,
                  rank: "Chairperson",
                  totals: `=VLOOKUP(A${TotalNum},Totals!A:B,2,FALSE)`,
                  totalsessionstrainings: `=VLOOKUP(A${TotalNum},TotalSessions!G:H,2,FALSE)`,
                  quota: `=if(lte(C${TotalNum},H${TotalNum}),FALSE,TRUE)`,
                  inactivity: "No",
                  warnings: "0",
                  notouch: "29"
                };

                promisify(sheet3.addRow)(row);
                message.channel.send("CP added!");
                message.channel.send(TotalNum);
              });
        }
      }
    }
  });

  bot.on("message", msg => {
    if (msg.channel.id === "639576993670627338") {
      const exampleEmbed = new Discord.RichEmbed();
      if (msg.member.roles.find("name", "Executive")) {
        var counts = 0;
        async function info(sheet) {
          const rows = await promisify(sheet.getRows)({
            offset: 1,
            query: `username = ${msg.content}`
          });
          var totalactivity = 0;
          exampleEmbed.addField("Username:", rows[0].username, false);
          for (var row of rows) {
            totalactivity = totalactivity + parseInt(row.activity);
            exampleEmbed.setColor(0x59e68e);
            exampleEmbed.setTitle(msg.content);
            exampleEmbed.setURL("");
            exampleEmbed.setAuthor(
              "Bondi Beach Roleplay",
              "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6",
              "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e"
            );
            exampleEmbed.setDescription(
              `Logs for ${msg.content}, requested by ${msg.author}`
            );
            exampleEmbed.addField(
              `Activity log ${(counts = counts + 1)} `,
              row.activity,
              false
            );
            exampleEmbed.setImage(
              "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6"
            );
            exampleEmbed.setTimestamp();
          }
          exampleEmbed.addField(`total activity: `, totalactivity, false);
          bot.channels.get(`639577026038202369`).send(exampleEmbed);
        }

        info(sheet);
      } else {
        const exampleEmbed = new Discord.RichEmbed();
        exampleEmbed.setColor(0x59e68e);
        exampleEmbed.setTitle("Unauthorised action");
        exampleEmbed.setAuthor(
          "Bondi Beach Roleplay",
          "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6",
          "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e"
        );
        exampleEmbed.setDescription(
          "You are not authorised to use this command, please speak to a member of the corporate team if you think this is a mistake."
        );
        exampleEmbed.setTimestamp();

        bot.channels.get(`639577026038202369`).send(exampleEmbed);
      }
    }
  });
}

bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.content.startsWith(prefix + "suggest")) {
      message.channel.send("Check your direct messages for more information.");
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
            "What is the title of your suggestion? Describe it in less than 10 words."
          );
          collector.on("collect", msg => {
            let titlesuggestion = msg.content;
            message.author.send(
              "Send a brief description of your suggestion. How can it benefit the community?"
            );
            const collector1 = new Discord.MessageCollector(
              channel,
              m => m.author.id == message.author.id,
              { maxMatches: 1 }
            );
            collector1.on("collect", msg1 => {
              let suggestiondescription = msg1.content;
              let channel = message.guild.channels.find(
                c => c.name === "❁suggestions"
              );
              let embed = new Discord.RichEmbed()
                .setTitle(titlesuggestion)
                .setColor(0x59e68e)
                .setThumbnail(bot.user.avatarURL)
                .addField("Description:", suggestiondescription)
                .addField("Suggested By:", message.author.username);
              channel.send(embed).then(async embedMessage => {
                await embedMessage.react("👍");
                await embedMessage.react("👎");
                message.author.send(
                  `Thanks! Your suggestion has been posted in the suggestions channel.`
                );
              });
            });
          });
        });
      }
    }
  }
});

bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    const msg = message.content.toLowerCase();
    if (message.author.bot) return;

    const mention = message.mentions.users.first();
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);
    if (msg.startsWith(prefix + "demotion")) {
      let reason = args.slice(1).join(" ");
      if (message.member.roles.find(r => r.name === "Executive")) {
        if (mention == null) {
          return;
        }
        message.delete();
        const embed = new Discord.RichEmbed()
          .setTitle("DEMOTION NOTICE")
          .setColor(0xe86b5a)
          .addField(
            `Greetings!`,
            `We regret to inform you on behalf of the Bondi Executives of your removal from the staff team. We have found you in violation of several code of conducts. If you have any questions, please do not hesitate to contact an Executive.\n\n`
          )
          .addField("REASON", `${reason}`)
          .addField("DEMOTED BY", `${message.author.username}`)
          .setTimestamp();
        mention.send(embed);
      }
    }
  }
});

bot.on("message", message => {
  let messageArray = message.content.split(" ");
  let args = messageArray.slice(1);
  let username = args[0];
  let reason = args.slice(1).join(" ");
  if ((message.channel.id === "695714871559585834"))  {
    if (message.member.roles.find(r => r.name == "Bot Developer")) {
      //message.channel.send("Activity added!");
      let ActivityToAddVar = 0;
      var ActivityToAdd = parseInt(ActivityToAddVar, 10);
      ActivityDB.findOne({ username: message.content }, (err, activity) => {
        if (err) console.log(err);
        if (!activity) {
          const newActivity = new ActivityDB({
            username: message.content,
            activity: 0,
            warnings: 0
          });
          newActivity.save();
          let activityEmbed = new Discord.RichEmbed();
          activityEmbed.setTitle("Activity logged");
          activityEmbed.addField("Username", username, true);
          activityEmbed.addField("Amount added", ActivityToAdd, true);
          activityEmbed.setColor(0x59e68e);
          activityEmbed.setTimestamp();
          activityEmbed.setThumbnail(
            "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6"
          );
          activityEmbed.setAuthor("Bondi Beach Roleplay");
          bot.channels.get(`685978560359694394`).send(activityEmbed);
          console.log("Saved");
        } else {
          activity.activity = activity.activity++ + ActivityToAdd;
          activity.save().catch(err => console.log(err));
          let activityEmbed = new Discord.RichEmbed();
          activityEmbed.setTitle("Activity logged");
          activityEmbed.addField("Username", message.content, true);
          activityEmbed.addField("Amount added", ActivityToAdd, true);
          activityEmbed.addField("Total", `${activity.activity} minutes`, true);
          activityEmbed.setColor(0x59e68e);
          activityEmbed.setTimestamp();
          activityEmbed.setThumbnail(
            "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6"
          );
          activityEmbed.setAuthor("Bondi Beach Roleplay");
          bot.channels.get(`685978560359694394`).send(activityEmbed);
          console.log("Saved");
        }
      });
    }
  }
});
bot.on("message", message => {
  let messageArray = message.content.split(" ");
  let args = messageArray.slice(1);
  let username = args[0];
  let reason = args.slice(1).join(" ");
  if (message.content.startsWith(prefix + "addactivity"))  {
    if (message.member.roles.find(r => r.name == "Bot Developer")) {
      message.channel.send("Activity added!");
      let ActivityToAddVar = reason;
      var ActivityToAdd = parseInt(ActivityToAddVar, 10);
      ActivityDB.findOne({ username: username }, (err, activity) => {
        if (err) console.log(err);
        if (!activity) {
          const newActivity = new ActivityDB({
            username: username,
            activity: ActivityToAdd,
            warnings: 0
          });
          newActivity.save();
          let activityEmbed = new Discord.RichEmbed();
          activityEmbed.setTitle("Activity logged");
          activityEmbed.addField("Username", username, true);
          activityEmbed.addField("Amount added", ActivityToAdd, true);
          activityEmbed.setColor(0x59e68e);
          activityEmbed.setTimestamp();
          activityEmbed.setThumbnail(
            "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6"
          );
          activityEmbed.setAuthor("Bondi Beach Roleplay");
          bot.channels.get(`685978560359694394`).send(activityEmbed);
          console.log("Saved");
        } else {
          activity.activity = activity.activity++ + ActivityToAdd;
          activity.save().catch(err => console.log(err));
          let activityEmbed = new Discord.RichEmbed();
          activityEmbed.setTitle("Activity logged");
          activityEmbed.addField("Username", username, true);
          activityEmbed.addField("Amount added", ActivityToAdd, true);
          activityEmbed.addField("Total", `${activity.activity} minutes`, true);
          activityEmbed.setColor(0x59e68e);
          activityEmbed.setTimestamp();
          activityEmbed.setThumbnail(
            "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6"
          );
          activityEmbed.setAuthor("Bondi Beach Roleplay");
          bot.channels.get(`685978560359694394`).send(activityEmbed);
          console.log("Saved");
        }
      });
    }
  }
});

var help = fs.readFileSync("./names.txt").toString().split("\n");;



bot.on("message", function (message) {
  if(message.content.startsWith(prefix + "names")){
    help.forEach(data => {
      bot.channels.get(`695714871559585834`).send(data);
      bot.channels.get(`685978795576262747`).send("Activity logged for" + data);
      message.channel.send("saved")
      console.log(data)
    })
  }
});


bot.on("message", message => {
  let messageArray = message.content.split(" ");
  let args = messageArray.slice(1);
  let username = args[0];
  let reason = args.slice(1).join(" ");
  if (message.content.startsWith(prefix + "minusactivity")) {
    if (message.member.roles.find(r => r.name == "Bot Developer")) {
      message.channel.send("Activity minused!");
      let ActivityToAddVar = reason;
      var ActivityToAdd = parseInt(ActivityToAddVar, 10);
      ActivityDB.findOne({ username: username }, (err, activity) => {
        if (err) console.log(err);
        if (!activity) {
          const newActivity = new ActivityDB({
            username: username,
            activity: 0,
            warnings: 0
          });
          newActivity.save();
          let activityEmbed = new Discord.RichEmbed();
          activityEmbed.setTitle("Activity logged");
          activityEmbed.addField("Username", username, true);
          activityEmbed.addField("Amount minused", ActivityToAdd, true);
          activityEmbed.setColor(0x59e68e);
          activityEmbed.setTimestamp();
          activityEmbed.setThumbnail(
            "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6"
          );
          activityEmbed.setAuthor("Bondi Beach Roleplay");
          bot.channels.get(`660981859601088543`).send(activityEmbed);
          console.log("Saved");
        } else {
          activity.activity = activity.activity-- - ActivityToAdd;
          activity.save().catch(err => console.log(err));
          let activityEmbed = new Discord.RichEmbed();
          activityEmbed.setTitle("Activity logged");
          activityEmbed.addField("Username", username, true);
          activityEmbed.addField("Amount minused", ActivityToAdd, true);
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
      });
    }
  }
});

bot.on("message", message => {
  if (message.content.startsWith(prefix + "info")) {
    if (message.member.roles.find(r => r.name === "Executive")) {
      let messageArray = message.content.split(" ");
      let args = messageArray.slice(1);
      let username = args[0];
      const members = message.guild.members;
      const member = members.find(member => member.displayName === username);

      let embed = new Discord.RichEmbed()
        .setTitle("User info")
        .setColor(0x59e68e)
        .addField("Username", member)
        .setThumbnail(member.user.avatarURL)
        .addField("Rank", member.highestRole.name)
        .addField("ID", member.user.id)
        .addField("Discriminator", member.user.discriminator)
        .addField("Bot", member.user.bot)
        .addField("Server muted", member.serverMute)
        .addField("Server deafened", member.serverDeaf);
      message.author.send(embed);
    }
  }
});



//functions

function Activity(sheet) {
  console.log(`Username: ${sheet.username}`);
  console.log(`Activity: ${sheet.activity}`);
  console.log(`===================`);
}

function dmuseractivity(username, activity) {
  const data = require("./data/verified.json");
  const result = data.find(({ robloxUsername }) => robloxUsername === username);
  let date_ob = new Date();
  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // current seconds
  let seconds = date_ob.getSeconds();
  process.env.TZ = "Europe/Amsterdam";
  let embed = new Discord.RichEmbed()
    .setTitle("**Activity Added**")
    .addField("Minutes", activity)
    .addField("Hours", activity / 60)
    .setColor(0x59e68e)
    .setThumbnail(bot.user.displayAvatarURL)
    .setTimestamp()

  try {
    bot.users.get(result.discord).send(embed);
  } catch (error) {
    console.log(error);
  }
}

// function pending(message) {
//   let args = message.content.split(" ");

//   if (args[1] && message && message.author.id) {
//     let table = {
//       robloxUsername: args[1],
//       discord: message.author.id,
//       time: Date.now()
//     };

//     try {
//       let data = JSON.parse(fs.readFileSync(`./data/pending.json`));
//       let canRun = true;

//       data.forEach(user => {
//         if (user.discord == message.author.id) {
//           canRun = false;
//         }
//       });

//       if (canRun) {
//         data.push(table);

//         fs.writeFileSync("./data/pending.json", JSON.stringify(data), []);

//         message.reply(
//           "Please join this roblox game to verify \n \n" + gameLink
//         );
//       } else {
//         message.reply(
//           "You cannot verify while you already have a pending account."
//         );
//       }
//     } catch (er) {
//       console.log(er);
//       message.reply("There's been an error while attempting to verify");
//     }
//   }
// }

// let uuid = require("uuid");

// // const siteKey = uuid();

// app.get("/", function (req, res) {
//   res.send("sorry but no");
// });

// app.get(`/ping`, function (req, res) {
//   res.send("ok");
// });

// app.get("/", (request, response) => {
//   response.sendStatus(200);
// });

// app.post(`/api/verify`, async function (req, res) {
//   let opt = req.body;

//   console.log(opt);

//   if (opt.key && opt.user && opt.id) {
//     if (opt.key == siteKey) {
//       try {
//         const pendingData = JSON.parse(fs.readFileSync(`./data/pending.json`));

//         const searchPending = new Promise(async (resolve, reject) => {
//           pendingData.forEach((user, index, array) => {
//             if (user.robloxUsername == opt.user) {
//               const pendingObject = user;
//               pendingData.splice(index, 1);
//               fs.writeFileSync(
//                 "./data/pending.json",
//                 JSON.stringify(pendingData),
//                 []
//               );
//               resolve(user);
//               return;
//             }
//             if (array.size == index) {
//               resolve();
//             }
//           });
//         });

//         searchPending.then(user => {
//           if (user) {
//             let verifiedData = JSON.parse(
//               fs.readFileSync(`./data/verified.json`)
//             );

//             verifiedData.push({
//               robloxUsername: user.robloxUsername,
//               roblox: user.roblox,
//               discord: user.discord
//             });

//             fs.writeFileSync(
//               "./data/verified.json",
//               JSON.stringify(verifiedData),
//               []
//             );

//             res.json({});
//           } else {
//             res.json({ erorr: true });
//           }
//         });
//       } catch (er) {
//         console.log(er);
//         res.json({ error: true });
//       }
//     } else {
//     }
//   } else {
//     res.json({ error: true });
//   }
// });

// app.post(`/api/check`, function (req, res) {
//   let opt = req.body;

//   console.log(opt);

//   if (opt.key && opt.user) {
//     if (opt.key == siteKey) {
//       try {
//         const pendingData = JSON.parse(fs.readFileSync(`./data/pending.json`));
//         const verifiedData = JSON.parse(
//           fs.readFileSync(`./data/verified.json`)
//         );

//         let verified = false;
//         let pending = false;

//         pendingData.forEach(user => {
//           if (user.robloxUsername == opt.user) {
//             pending = true;
//           }
//         });

//         verifiedData.forEach(user => {
//           if (user.robloxUsername == opt.user) {
//             verified = true;
//           }
//         });

//         res.json({
//           verified: verified,
//           pending: pending
//         });
//       } catch (er) {
//         console.log(er);
//         res.json({ error: true });
//       }
//     } else {
//       console.log("mismatched site keys");
//       res.json({ error: true });
//     }
//   } else {
//     console.log("no user/thingy");
//     res.json({ error: true });
//   }
// });

// app.post(`/api/getkey`, function (req, res) {
//   if (!req.body.key) {
//     res.json({ error: true });
//     return;
//   }

//   if (req.body.key == customKey) {
//     res.json({ key: siteKey });
//   } else {
//     res.json({ error: "Mismatch" });
//   }
// });

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
      }
    }
  }
});



///////////////////////////////////////////////////

bot.on("ready", () => {
  console.log("Bot Enabled");
  bot.user.setActivity("Bondi Rescue Roleplay");
});

const staffwarn = require("./commands/staffwarn");


bot.on("message", message => {
  if (message.content.toLowerCase().startsWith("!issuewarning")) {
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);
    let reason = args.slice(1).join(" ");
    let username = args[0];
    let member = message.guild.members.find(
      member => member.displayName == username
    );
    staffwarn.staffwarn(member, reason, message.member.displayName);
    message.channel.send("Warning logged.");
    const newWarning = new WarningsDB({
      username: message.member.displayName,
      userwarned: member.displayName,
      reason: reason
    });
    const report = new Discord.RichEmbed()
      .setTitle("User Warned")
      .setColor(0xe86b5a)
      .addField("Username", `${member}`)
      .addField("Reason", `${reason}`)
      .addField("Issued By", `${message.member.displayName}`)
    message.guild.channels.find(c => c.name === "warning-logs").send(report);
  }
});

function getusernamebyuserid(userid) {
  var roblox_payload_data = {
    method: "GET",
    url: "https://api.roblox.com/users/" + userid
  };

  let request = require("request");

  request(roblox_payload_data, function (er, res, rbxbody) {
    return rbxbody;
  });
}

bot.on("message", message => {
  if (message.content === prefix + "logs") {
    let roblox_payload_data =
      "https://groups.roblox.com/v1/groups/5033680/audit-log?actionType=ChangeRank&sortOrder=Asc&limit=50";
    message.channel.send(roblox_payload_data);
  }
});

bot.on("message", message => {
  if (message.content.startsWith(prefix + "user")) {
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);
    let username = args[2];
    function getusernamebyuserid(username) {
      var roblox_payload_data = {
        method: "GET",
        url: "https://api.roblox.com/users/" + username
      };

      let request = require("request");

      request(roblox_payload_data, function (er, res, rbxbody) {
        return rbxbody;
        message.channel.send(rbxbody);
      });
    }
  }
});

// bot.on("message", message => {
//   if (message.guild !== null && message.member !== null) {
//     if (message.content.startsWith(prefix + "awards")) {
//       if (message.member.roles.find("name", "Verified ✔")) {
//         message.delete();
//         const entry = require('./commands/entry')
//         entry.entry(message.channel, message.guild, message.author, bot, message.member.displayName, message.member.highestRole.name)
//       }
//     }
//   }
// });

bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.content.startsWith(prefix + "demolog")) {
      if (message.member.roles.find("name", "Super Rank") || message.member.roles.find("name", "Higher Rank") ) {
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
      }
    }
  }
});
bot.on("message", message => {
  if (message.guild !== null && message.member !== null) {
    if (message.content.startsWith(prefix + "inactivitynotice")) {
      if (
        message.member.roles.find("name", "Middle Rank") ||
        message.member.roles.find("name", "Higher Rank") ||
        message.member.roles.find("name", "Super Rank") ||
        message.member.roles.find("name", "Executive")
      ) {
        const inactivitynotice = require("./commands/inactivitynotice");
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
        const endnotice = require("./commands/endnotice");
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
        embed.setColor("#9900FF");
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
    if (message.content.startsWith(prefix + "viewnotice")) {
      let messageArray = message.content.split(" ");
      let args = messageArray.slice(1);
      let username = args[0];
      if (message.member.roles.find("name", "Bot Developer")) {
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
            activityEmbed.setColor(0x59e68e);
            activityEmbed.setTimestamp();
            activityEmbed.setThumbnail(
              "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6"
            );
            activityEmbed.setAuthor("Bondi Beach Roleplay");
          }
          message.channel.send(activityEmbed);
        });
      } else {
        embed.setColor("#9900FF");
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
    if (message.content.startsWith(prefix + "viewlogs")) {
      let messageArray = message.content.split(" ");
      let args = messageArray.slice(1);
      let username = args[0];
      if (message.member.roles.find("name", "Super Rank")) {
        CommandDB.find({ username: username }, (err, activity) => {
          console.log(activity);
          let activityEmbed = new Discord.RichEmbed()
            .setTitle("Logs for " + username)
            .setColor(0x59e68e)
            .setTimestamp()
            .setThumbnail(
              "https://t2.rbxcdn.com/8e7fd992c56ba944c74c7572304bc4e6"
            );
          activity.forEach(activity => {
            activityEmbed.addField(activity.username, activity.content);
          });
          message.channel.send(activityEmbed);
        }).limit(25);
        embed.setColor("#9900FF");
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

// bot.on('guildMemberUpdate', (oldMember, newMember) => {
//   let role = newMember.guild.roles.get('606704073701589014')
//   let premium = newMember.guild.roles.get('651320090180059136')
//   let channel = bot.guilds.get('603041320885551135').channels.get('603047463691091971')
//   if (oldMember.roles.size < newMember.roles.size) {
//     if (!newMember.roles.has(role)) {
//       newMember.addRole(premium)
//     }
//   }
// })

bot.on("message", message => {
  let messageArray = message.content.split(" ");
  let args = messageArray.slice(1);
  if (message.content.startsWith(prefix + "hard")) {
    if (message.member.roles.find(r => r.name === "Bot Developer")) {
      let channel = message.guild.channels.find(
        c => c.name === "bondi-bot-logs"
      );
      awardDB.find({}, (err, activity) => {
        console.log(activity);
        for (var activity of activity) {
          let activityEmbed = new Discord.RichEmbed()
            .setTitle(activity.hardestworking)
            .setColor(0x59e68e);
          message.channel.send(activityEmbed);
        }
      });
    }
  }
});

bot.on("message", message => {
  if (message.content.startsWith(prefix + "claim")) {
    if (message.member.roles.find(r => r.name === "Support")) {
      let channel = message.channel;
      let role = message.guild.roles.find(r => r.name === "Support");
      let role2 = message.guild.roles.find(r => r.name === "@everyone");
      channel.overwritePermissions(role.id, {
        SEND_MESSAGES: false
      });
      channel.overwritePermissions(role.id, {
        READ_MESSAGES: false
      });
      channel.overwritePermissions(message.author.id, {
        SEND_MESSAGES: true
      });
      channel.overwritePermissions(message.author.id, {
        READ_MESSAGES: true
      });
      let embed = new Discord.RichEmbed()
        .setTitle("Claimed")
        .setDescription(
          "This ticket has been claimed by: " + message.member.displayName
        )
        .setColor(0x59e68e);
      message.delete();
      message.channel.send(embed);
    } else {
      embed.setColor(0x59e68e);
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
});

bot.on("message", message => {
  if (message.content.startsWith(prefix + "passed")) {
    if (message.member.roles.find(r => r.name === "Bot Developer")) {
      const mention = message.mentions.members.first();
      let role = message.guild.roles.find(r => r.name === "passed training");
      let role2 = message.guild.roles.find(r => r.name === "Sessions");
      mention.addRole(role);
      mention.addRole(role2);
      message.channel.send("Roles added!");
    }
  }
});





bot.on("message", message => {
  const username = message.author.username
    try {
  const member = message.guild.members.find(member => member.displayName === username);
        const embed = new Discord.RichEmbed();
  if(message.channel.id === "702658943662555166"){
    if(!message.content){
      console.log("No message")
    } else {
      if(message.content == "Good Length"){
        embed.setTitle("APPLICATION STATUS CHANGED");
        embed.setDescription(`Greetings ${username},\n\nYour intern application status has changed, this means that it has moved onto another stage of the marking process. Thank you for your patience while we continue to read applications! You will receive your results 1-3 days after the official closing of the applications.\n\nThis message is automated.`);
        embed.addField("Previous status:", "Pending");
        embed.addField("Current status: ", "Good Length");
     
        embed.setColor(0x59e68e);
        member.send(embed);
      }
      if(message.content === "Good Grammar"){
        embed.setTitle("APPLICATION STATUS CHANGED");
        embed.setDescription(`Greetings ${username},\n\nYour intern application status has changed, this means that it has moved onto another stage of the marking process. Thank you for your patience while we continue to read applications! You will receive your results 1-3 days after the official closing of the applications.\n\nThis message is automated.`);
        embed.addField("Previous status:", "Good Length");
        embed.addField("Current status: ", "Good Grammar");
        
        embed.setColor(0x59e68e);
        member.send(embed);
      }
      if(message.content === "Good Vocabulary"){
        embed.setTitle("APPLICATION STATUS CHANGED");
        embed.setDescription(`Greetings ${username},\n\nYour intern application status has changed, this means that it has moved onto the final stage of the marking process. Thank you for your patience while we continue to read applications! You will receive your results 1-3 days after the official closing of the applications.\n\nThis message is automated.`);
        embed.addField("Previous status:", "Good Grammar");
        embed.addField("Current status: ", "Good Vocabulary");
        embed.setColor(0x59e68e);
        member.send(embed);
         }
          if(message.content === "Pending"){
        embed.setTitle("APPLICATION SUBMITTED")
        embed.setDescription(`Greetings ${username},\n\nYou have successfully submitted your **INTERN APPLICATION** for review! You may have to wait up to 3 days before the results are released.\n\nThis message is automated.`)
        embed.addField("Current status: ", "Pending");
        embed.setColor(0x59e68e);
        member.send(embed);
         }
    }
  }
}
catch(error) {
  console.error(error);
  // expected output: ReferenceError: nonExistentFunction is not defined
  // Note - error messages will vary depending on browser
}

});
