const Discord = require('discord.js');
const hook = new Discord.WebhookClient('620389825656258601', 'XA3A2llD89lp_m4WdKMX6MYkMaoimMEZKtiItEM7EltdKizkM8dnW53ra6w1X7VmE2X4');
const client = new Discord.Client();
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
      client.on('ready', () => {
        client.user.setActivity('?beep | Apple Community', { type: 'PLAYING' })
        .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
        .catch(console.error);
        client.on('debug', console.log);
        client.on('error', console.error);
      });
      client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
      const channel = member.guild.channels.find(ch => ch.name === 'welcome-and-system-message');
      hook.send(`${member} has joined the server :D`);
  // Do nothing if the channel wasn't found on this server
      if (!channel) return;
  // Send the message, mentioning the member
      channel.send(`Welcome to Apple Community, ${member}`);
      });
      // Create an event listener for new guild members
      client.on('guildMemberRemove', member => {
  // Send the message to a designated channel on a server:
      const channel = member.guild.channels.find(ch => ch.name === 'welcome-and-system-message');
      hook.send(`${member} has left the server :C`);
  // Do nothing if the channel wasn't found on this server
      if (!channel) return;
  // Send the message, mentioning the member
      channel.send(`Bye, ${member}`);
      });
// We also need to make sure we're attaching the config to the CLIENT so it's accessible everywhere!
client.config = config;

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
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, props);
  });
});
      
client.login(process.env.token)
