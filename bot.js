const Discord = require('discord.js');
const client = new Discord.Client();
const weather = require('weather-js');
const config = require('./config.json');
let prefix = config.prefix;

client.on('ready', () => {
  client.user.setActivity(`?help | ${client.guilds.size} Servers | Apple Community`);
  console.log('READY! Connected to Discord')
});

client.music = require('discord.js-musicbot-addon')

client.music.start(client, {
  // Set the api key used for YouTube.
  youtubeKey: "AIzaSyA1q-iSZRfeaWODW9vreAMxHYtQ9XGlisU",

  // The PLAY command Object.
  play: {
    // Usage text for the help command.
    usage: "play some tunes",
    // Whether or not to exclude the command from the help command.
    exclude: false  
  },

  pause: {
    // Usage text for help command
    usage: "?pause",
    exclude: false
  },

  search: {
    // Usage text for help command
    usage: "?search",
    exclude: false
  },

  loop: {
    // Usage text for help command
    usage: "?loop",
    exclude: false
  },

  volume: {
    // Usage text for help command
    usage: "?volume",
    exclude: false
  },

  queue: {
    // Usage text for help command
    usage: "?queue",
    exclude: false
  },

  shuffle: {
    // Usage text for help command
    usage: "?shuffle",
    exclude: false
  },

  clear: {
    // Usage text for help command
    usage: "?clear",
    exclude: false
  },

  resume: {
    // Usage text for help command
    usage: "?resume",
    exclude: false
  },

  // Make it so anyone in the voice channel can skip the
  // currently playing song.
  anyoneCanSkip: true,

  // Make it so the owner (you) bypass permissions for music.
  ownerOverMember: true,
  ownerID: "yourDiscordId",

  // The cooldown Object.
  cooldown: {
    // This disables the cooldown. Not recommended.
    enabled: false
  }
});

client.on('message', async (message) => {
  if(message.author.bot) return;

  if (message.content === "?group") {
    message.channel.send('Here is the group: https://web.roblox.com/groups/4158226/Apple-Community/')
  }

  if (message.content === "?ban") {
    if (member.roles.some(role => role.name === 'AC Admins')) {
      let member = message.mentions.members.first();
      if(!member)
        return message.reply("Please mention a valid member of this server");
      if(!member.bannable) 
        return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

      let reason = args.slice(1).join(' ');
      if(!reason) reason = "No reason provided";
    
      await member.ban(reason)
        .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
      message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
    } else {
      return message.channel.send("Oops! You don't have the correct roles to run the command.")
    }
  } else if (message.content === "?kick") {
    if (member.roles.some(role => role.name === 'AC Mods', 'AC Admins')) {
      let member = message.mentions.members.first();
      if(!member)
        return message.reply("Please mention a valid member of this server");
      if(!member.bannable) 
        return message.reply("I cannot kcik this user! Do they have a higher role? Do I have ban permissions?");

      let reason = args.slice(1).join(' ');
      if(!reason) reason = "No reason provided";
    
      await member.kick(reason)
        .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
      message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
    } else {
      return message.channel.send("Oops! You don't have the correct roles to run the command.")
    }
  } else if (message.content === "?ping") {
    try {
      const msg = await message.channel.send("🏓 Ping!");
      msg.edit(`🏓 Pong! (Roundtrip took: ${msg.createdTimestamp - message.createdTimestamp}ms. 💙: ${Math.round(client.ping)}ms.)`);
    } catch (e) {
      console.log(e);
    }
  } else if (message.content === "?weather") {
    weather.find({ search: args.join(" "), degreeType: "F" }, function(
      err,
      result
    ) {
      if (err) message.channel.send(err);

      var current = result[0].current;
      var location = result[0].location;

      const weatherEmbed = new Discord.RichEmbed()
        .setDescription(`**${current.skytext}**`)
        .setAuthor(`Weather for ${current.observationpoint}`)
        .setThumbnail(current.imageURL)
        .setColor(0x00ae86)
        .addField("Timezone", `UTC${location.timezone}`, true)
        .addField("Degree Type", location.degreetype, true)
        .addField("Tempature", `${current.temperature} Degrees`, true)
        .addField("Feels Like", `${current.feelslike} Degrees`, true)
        .addField("Winds", current.winddisplay, true)
        .addField("Humidity", `${current.humidity}%`, true);
      message.channel.send(weatherEmbed);
    });
  } else if (message.content === "?stats") {
    // eslint-disable-line no-unused-vars
    const duration = moment
      .duration(this.client.uptime)
      .format(" D [days], H [hrs], m [mins], s [secs]");
    message.channel.send(
      `= STATISTICS =
  • Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
    2
  )} MB
  • Uptime     :: ${duration}
  • Users      :: ${client.users.size.toLocaleString()}
  • Servers    :: ${client.guilds.size.toLocaleString()}
  • Channels   :: ${client.channels.size.toLocaleString()}
  • Discord.js :: v${version}
  • Node       :: ${process.version}`,
      { code: "asciidoc" }
    );
  }
});

client.login(process.env.token)