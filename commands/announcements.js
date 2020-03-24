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