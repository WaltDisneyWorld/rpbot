const Discord = require("discord.js");
const Config = require('../settings.json');
const RoleConfig = require('../roleSettings.json');
const categoryId = Config.TicketCaterogry;

module.exports = class development {
    constructor(){
            this.name = 'OpenTicket.js • Main Command',
            this.alias = ['ticket'],
            this.usage = '!newticket'
    }
    async run(Client,message,args) {
    var userName = message.author.username;
    var userDiscriminator = message.author.discriminator;
    var bool = false;
    
      message.guild.channels.forEach((channel) => {
        if (channel.name == userName.toLowerCase() + "-" + userDiscriminator) {
            message.channel.send("You already made a ticket!");
            bool = true;
        }
    });
    if (bool == true) return;
    var embedCreateTicket = new Discord.RichEmbed()
        .setTitle("Ticket being made for: " + message.author.username)
        .setDescription(`You are getting pinged to the channel.`)
        .setColor(Config.Color)
        .setFooter(Config.Footer)
        .setTimestamp();
     message.channel.send(embedCreateTicket);
  message.guild.createChannel(userName + "-" + userDiscriminator, "text").then((createdChan) => {
 
        createdChan.setParent(categoryId).then((settedParent) => {
 
            // Zet perms voor iedereen
            settedParent.overwritePermissions(message.guild.roles.find('name', "@everyone"), { "READ_MESSAGES": false });
            settedParent.overwritePermissions(message.guild.roles.find('id', `${RoleConfig.CustomerServiceID}`), { 
              "SEND_MESSAGES": true, READ_MESSAGES: true,
            });
            settedParent.overwritePermissions(message.author, {
 
                "READ_MESSAGES": true, "SEND_MESSAGES": true,
                "ATTACH_FILES": true, "CONNECT": true,
                "CREATE_INSTANT_INVITE": false, "ADD_REACTIONS": true

            });
            var EmbedLog = new Discord.RichEmbed()
            .setTitle(`Ticket has been created for ${message.author}`)
            .setColor(Config.Color)
            .setDescription("Ticket Created")
            .setFooter(Config.Footer)
        var logChannel = message.guild.channels.find("id", Config.LogsID);
       if (!logChannel) return message.channel.send("❌ Cannot find log channel");
      logChannel.send(EmbedLog)

            var embedParent = new Discord.RichEmbed()
        .setTitle("Hey! " + message.author.username.toString())
        .setColor(Config.Color)
        .setDescription(`Thank you for making a ticket, our Support staff are here to help and will respond shortly.`)
        .setFooter(Config.Footer)
        .setTimestamp();
 
            settedParent.send(embedParent);
            settedParent.send(`${message.author}`)
        }).catch(err => {
            message.channel.send("Oww! Error..");
        });
 
    }).catch(err => {
        message.channel.send("Oww! Error..");
    });
 
}
}
        

 

