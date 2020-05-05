const Discord = require("discord.js")
const roblox = require("noblox.js")
var randomWords = require('random-words');
const fs = require("fs");
const verifiedDB = require("../verified.js");
const search = (channel, guild, author, user, member, highestRole, username) => {
    if (!username) {
        channel.send("Please specify a ROBLOX account \n \nexample: !naverify azlentic")
    } else {
        verifiedDB.findOne({ robloxUser: member.displayName }, (err, information) => {
            console.log(information)
            if (!information) {
                //channel.send("Check your direct messages for more information.")
                var phrase = randomWords({ exactly: 8, join: ' ' });
                var channel = null;
                if (channel == null) {
                    author.createDM().then(chan => {
                        channel = chan;

                        const collector = new Discord.MessageCollector(
                            channel,
                            m => m.author.id == author.id,
                            { maxMatches: 1 }
                        );
                        let embed = new Discord.RichEmbed()
                            .setTitle("Verification")
                            .setColor("#5b9cc2")
                            .addField("Please put this in your status or blurb **on your roblox account** and say **done** when completed", phrase)
                            .setFooter("Say **cancel** to cancel.");
                        author.send(embed);
                        console.log(phrase)
                        collector.on("collect", msg => {
                            if (msg.content.toLowerCase() === "cancel") {
                                author.send("Cancelled Prompt.");
                            } else {
                                let done = msg.content;
                                if (done === "done") {
                                    roblox.getIdFromUsername(username).then(id => { // gets user id for the specific part of the embed
                                        if (id) {
                                            roblox.getPlayerInfo(parseInt(id)).then(function (info) {
                                                let date = new Date(info.joinDate) // states join date
                                                if (info.blurb === phrase || info.status === phrase) {
                                                    author.send("Verified!")
                                                    const newVerify = new verifiedDB({
                                                        robloxUser: username,
                                                        robloxID: id,
                                                        discordID: author.id
                                                    });
                                                    newVerify.save();
                                                    let role = guild.roles.find(n => n.name === "Verified Staff")
                                                    member.addRole(role)
                                                } else {
                                                    author.send("Failed")
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        });
                    })
                }
            } else {
                let embed = new Discord.RichEmbed()
                .setTitle("Verified")   
                .setDescription("You are already verified on our system, your verified role will be given to you now if you did not have it before.")
                .setColor("#5b9cc2")
                .setTimestamp();
                author.send(embed)
                let role = guild.roles.find(n => n.name === "Verified Staff")
                member.addRole(role)
            }
        })


    }
}
//   if (username) {
//     roblox.getIdFromUsername(username).then(id => { // gets user id for the specific part of the embed
//       if (id) {
//         roblox.getPlayerInfo(parseInt(id)).then(function (info) {
//           let date = new Date(info.joinDate) // states join date
//           let dateInfo = user.extractDate(date)
//           // var facts = ["Your facts", "...", "..."];
//           // var fact = Math.floor(Math.random() * facts.length);
//           // let embed = new discord.RichEmbed() // starts a new embed


//           //   .setColor("#f9ae00") // sets the color of the embed
//           //   .setURL(`https://roblox.com/users/${id}/profile`) // base link, changed by the variables 'id'
//           //   .setTimestamp()
//           //   .setThumbnail(`https://www.roblox.com/bust-thumbnail/image?userId=${id}&width=420&height=420&format=png`) // gets the roblox profile picture

//           //   .addField("Username", info.username || 'Unresolvable', true) // everything in the embed is undefined, therefore can be changed by the variables
//           //   .addField("User ID", id || 'Unresolvable', true)
//           //   .addField("Blurb", info.blurb || 'Nothing', true)
//           //   .addField("Status", info.status || 'Nothing', true)
//           //   .addField("Account Age", `${info.age} days old` || 'Unresolvable')
//           //   .addField("Register Date", `${dateInfo.month}/${dateInfo.day}/${dateInfo.year}` || 'Unresolvable')
//           //   .addField("User Link", `https://roblox.com/users/${id}/profile`)
//           //channel.send("Check your direct messages for more information.");

//           if (channel == null) {
//             author.createDM().then(chan => {
//               channel = chan;

//               const collector = new Discord.MessageCollector(
//                 channel,
//                 m => m.author.id == author.id,
//                 { maxMatches: 1 }
//               );
//               author.send("Please put this in your status and say **done** when completed " + phrase);
//               console.log(phrase)
//               collector.on("collect", msg => {
//                 if (msg.content.toLowerCase() === "cancel") {
//                   author.send("Cancelled Prompt.");
//                 } else {
//                   let done = msg.content;
//                   if (done === "done") {
//                     if (info.blurb === phrase) {
//                       author.send("Verified!")
//                       author.send(info.blurb)
//                     } else {
//                       author.send("Failed")
//                       author.send(info.blurb)
//                     }
//                   }

//                 }
//               })
//             })
//           }

//         });
//       }

//     }).catch(function (err) {
//       channel.send("Sorry, that user doesn't seem to exist, double check your spelling and try again!") // catching error
//     });
//   } else {
//     channel.send("Please provide a valid username, e.g. !search ROBLOX'.")
//   }
// }
exports.search = search;
