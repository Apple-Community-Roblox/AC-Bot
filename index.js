const Discord = require("discord.js");
const BotkitDiscord = require('botkit-discord');
const config = {
    token: process.env.TOKEN1 // Discord bot token
}
const music = require("discord.js-musicbot-addon");
const rbx = require("noblox.js");
const client = new Discord.Client();
const fs = require('fs');
const Enmap = require("enmap");
const { ErelaClient, Utils } = require('erela.js')
const weather = require("weather-js")
const { nodes } = require('/app/config.json')
const { Users, CurrencyShop } = require("./dbObjects");
const { Op } = require("sequelize");
const ytdl = require("ytdl-core");
const currency = new Discord.Collection();
const moment = require("moment");
const PREFIX = config.prefix; 
const queue = new Map();
const version = "11.5.1";

require("./server")(client); //This line execute the /express/server.js file

Reflect.defineProperty(currency, "add", {
  value: async function add(id, amount) {
    const user = currency.get(id);
    if (user) {
      user.balance += Number(amount);
      return user.save();
    }
    const newUser = await Users.create({ user_id: id, balance: amount });
    currency.set(id, newUser);
    return newUser;
  }
});

Reflect.defineProperty(currency, "getBalance", {
  value: function getBalance(id) {
    const user = currency.get(id);
    return user ? user.balance : 0;
  }
});

client.on("guildMemberAdd", async member => {
  // Send the message to a designated channel on a server:
  const channel = client.channels.find(
    ch => ch.name === "welcome-and-system-messages"
  );
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send({
    embed: {
      color: 3447003,
      title: "Welcome!",
      description: `Say hello to, ${member}`,
      footer: {
        text: "© 2019 Apple Community"
      }
    }
  });
});

music.start(client, {
  youtubeKey: "AIzaSyA1q-iSZRfeaWODW9vreAMxHYtQ9XGlisU",
  botPrefix: "?"
})

client.on('error', (err) => console.error(err));

client.on("ready", async () => {
  const storedBalances = await Users.findAll();
  storedBalances.forEach(b => currency.set(b.user_id, b));
  client.user.setActivity(
    `${client.guilds.size.toLocaleString("en")} servers`,
    { type: "WATCHING" }
  );
  console.log(`Bot:     Ready and logged in as ${client.user.tag}`);
});

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    // Load the command file itself
    let props = require(`./commands/${file}`);
    // Get just the command name from the file name
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    // Here we simply store the whole thing in the command Enmap. We're not running it right now.
    client.commands.set(commandName, props);
  });
});

client.login(config.token)