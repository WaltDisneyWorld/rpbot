const Discord = require("discord.js");
const Config = require('../settings.json');
const RoleConfig = require('../roleconfig.json');
const Roles = require('../roleSettings.json');
const categoryId = Config.TicketCaterogry;
 
module.exports = class development {
    constructor(){
            this.name = 'CloseTicket.js • Main Command',
            this.alias = ['close'],
            this.usage = '!close'
    }
    async run(Client,message,args) {
            if (!message.member.roles.some(r => [Roles.SenoirRankID,Roles.AdminstratorID,Roles.HighRankID].includes(r.id)))  return message.channel.send("❌ You do not have permissions to use this command. Please contact a staff member.");
    if (message.channel.parentID == categoryId) {
        message.channel.delete();
    } else {
        message.channel.send("❌ Please do this in the ticket channel.");
    }
 
    var embedCloseTicket = new Discord.RichEmbed()
        .setTitle(`Your ticket has been closed! Thanks for using our service.`)
        .setColor(Config.Color)
        .setDescription("The ticket has been closed")
        .setFooter(Config.Footer)
    var EmbedLog = new Discord.RichEmbed()
            .setTitle(`Command logged`)
            .setColor(Config.Color)
            .setDescription(`${message.author} has used ` + "`-close`" + ` in ${message.channel}`)
            .setFooter(Config.Footer)
        var logChannel = message.guild.channels.find("id", Config.LogsID);
       if (!logChannel) return message.channel.send("❌ Cannot find log channel");
      
   var logChannel = message.guild.channels.find("id", Config.TicketLogsC);
   if (!logChannel) return message.channel.send("❌ Cannot find log channel");
 
    message.author.send(embedCloseTicket);
    }
}


 

