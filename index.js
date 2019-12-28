const prefix = "!"; //discord bot prefix
const Discord = require("discord.js");
const bot = new Discord.Client();
const robloxranking = require("robloxrankingservice");
const gamekey = "-CkfniAak-Ip-6FbK6G4eA";
const express = require("express");
const app = express();

app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);

bot.on("ready", () => { 
  console.log("Bot Enabled");
  bot.user.setActivity("Twirlz Parlor");
});

bot.login(process.env.DISCORD_TOKEN);



