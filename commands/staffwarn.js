let Discord = require('discord.js')

const staffwarn = (member, reason, warnedby) => {
          const embed = new Discord.RichEmbed()
            .setTitle("WARNING NOTICE")
            .setColor("#9900FF")
            .addField(
              `Greetings, ${member.displayName}.`,
              `We regret to inform you that you’ve been warned. This may have been for violating our Code of Conducts. Continuing with this behaviour may lead to major consequences. If you have any questions regarding your warning, do not hesitate to contact an Executive.`
            )
            .addField("REASON", `${reason}`)
            .addField("ISSUED BY", `${warnedby}`)
            .setTimestamp();
  member.send(embed)
}

exports.staffwarn = staffwarn;