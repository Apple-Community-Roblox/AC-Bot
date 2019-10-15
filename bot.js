const Discord = require('discord.js');
const client = new Discord.Client();
const weather = require('weather-js');
const config = require('./config.json');
let prefix = config.prefix;

Reflect.defineProperty(currency, 'add', {
	value: async function add(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});

client.on('ready', () => {
  const storedBalances = await Users.findAll();
  storedBalances.forEach(b => currency.set(b.user_id, b));
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
  const annoucments = message.guild.channels.find(`name`, "annoucments");
  if(message.author.bot) return;

  if (message.content === "?group") {
    message.channel.send('Here is the group: https://web.roblox.com/groups/4158226/Apple-Community/')
  } else if (message.content === "?ban") {
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
  } else if (message.content === "?warn") {
      if (member.roles.some(role => role.name === 'AC Mods', 'AC Admins')) {
        let reason = args.slice(1).join(' ');
        let user = message.mentions.users.first();
        let modlog = client.channels.find('name', 'logs');
        if (!modlog) return message.reply('I cannot find a mod-log channel');
        if (reason.length < 1) return message.reply('You must supply a reason for the warning.');
        if (message.mentions.users.size < 1) return message.reply('You must mention someone to warn them.').catch(console.error);
        const WarnEmbed = new Discord.RichEmbed()
        .setColor(0x00AE86)
        .setTimestamp()
        .addField('Action:', 'Warning')
        .addField('User:', `${user.username}#${user.discriminator}`)
        .addField('Modrator:', `${message.author.username}#${message.author.discriminator}`);
        return client.channels.get(modlog.id).sendEmbed(WarnEmbed)
      } else {
        message.reply('Oops! Incorrect permissions');
      }
  } else if (message.content === "?rp") {
    if (member.roles.some(role => role.name === 'AC Mods', 'AC Admins')) {
      annoucments.send('@everyone ITS RP TIME! Head on down to the store')
    } else {
      message.reply('Oops! Incorrect permissions');
    }
  } else if (message.content === "?mandatoryrp") {
    if (member.roles.some(role => role.name === 'AC Mods', 'AC Admins')) {
      annoucments.send('@everyone ATTENTION! MANDATORY RP! Head on down to the store right now')
    } else {
      message.reply('Oops! Incorrect permissions');
    }
  } else if (message.content === "?meeting") {
    if (member.roles.some(role => role.name === 'AC Mods', 'AC Admins')) {
      annoucments.send('@everyone ATTENTION! MEETING! Head on down to the store right now')
    } else {
      message.reply('Oops! Incorrect permissions');
    }
  } else if (command === 'balance') {
		// [gamma]
    const target = message.mentions.users.first() || message.author;
    return message.channel.send(`${target.tag} has ${currency.getBalance(target.id)}💰`);
	} else if (command === 'inventory') {
		// [delta]
		const target = message.mentions.users.first() || message.author;
		const user = await Users.findOne({ where: { user_id: target.id } });
		const items = await user.getItems();

		if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
		return message.channel.send(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);
	} else if (command === 'transfer') {
		// [epsilon]
	} else if (command === 'buy') {
		// [zeta]
	} else if (command === 'shop') {
		// [theta]
	} else if (command === 'leaderboard') {
		// [lambda]
	}
});

client.login(process.env.token)
