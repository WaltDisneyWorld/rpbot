let Discord = require('discord.js')
const DemotionDB = require("../demotions.js");
const WarningsDB = require("../warnings.js");   

const infractions = (channel, username) => {
  DemotionDB.find({ userdemoted: username }, (err, punishments) => {
          console.log(punishments);
          for (var punishments of punishments) {
            let activityEmbed = new Discord.RichEmbed()
              .setTitle("Demotion log")
              .addField("User demoted by", punishments.username)
              .addField("Old to new rank", punishments.oldnewrank)
              .addField("Reason", punishments.reason)
              .addField("Proof", punishments.proof)
              .setColor("#5b9cc2");
            channel.send(activityEmbed);
          }
        });
        WarningsDB.find({ userwarned: username }, (err, punishments) => {
          console.log(punishments);
          for (var punishments of punishments) {
            let activityEmbed = new Discord.RichEmbed()
              .setTitle("Warning log")
              .addField("User warned by", punishments.username)
              .addField("Reason", punishments.reason)
              .setColor("#5b9cc2");
            channel.send(activityEmbed);
          }
        });
}

exports.infractions = infractions;