const Discord = require("discord.js");
const client = new Discord.Client();
const weather = require("weather-js");
const config = require("./config.json");
const { Users, CurrencyShop } = require("./dbObjects");
const { Op } = require("sequelize");
const currency = new Discord.Collection();
const moment = require("moment");
const PREFIX = config.prefix;
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
  const channel = member.channels.find(
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

client.on("ready", async () => {
  const storedBalances = await Users.findAll();
  storedBalances.forEach(b => currency.set(b.user_id, b));
  client.user.setActivity(
    `${client.guilds.size.toLocaleString("en")} servers`,
    { type: "WATCHING" }
  );
  console.log(`Bot:     Ready and logged in as ${client.user.tag}`);
});

client.on("message", async message => {
  if (message.author.bot) return;
  currency.add(message.author.id, 1);

  if (!message.content.startsWith(PREFIX)) return;
  const input = message.content.slice(PREFIX.length).trim();
  if (!input.length) return;
  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  const member = message.member;
  const annoucments = client.channels.find(
    ch => ch.name === "annoucments"
  );
  if (message.author.bot) return;

  if (command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.

    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);

    // Ooooh nice, combined conditions. <3
    if (!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply(
        "Please provide a number between 2 and 100 for the number of messages to delete"
      );

    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({ limit: deleteCount });
    message.channel
      .bulkDelete(fetched)
      .catch(error =>
        message.reply(`Couldn't delete messages because of: ${error}`)
      );
  } else if (message.content === "?group") {
    message.channel.send(
      "Here is the group: https://web.roblox.com/groups/4158226/Apple-Community/"
    );
  } else if (message.content === "?ban") {
    if (member.roles.some(role => role.name === "AC Admins")) {
      let member = message.mentions.members.first();
      if (!member)
        return message.reply("Please mention a valid member of this server");
      if (!member.bannable)
        return message.reply(
          "I cannot ban this user! Do they have a higher role? Do I have ban permissions?"
        );

      let reason = args.slice(1).join(" ");
      if (!reason) reason = "No reason provided";

      await member
        .ban(reason)
        .catch(error =>
          message.reply(
            `Sorry ${message.author} I couldn't ban because of : ${error}`
          )
        );
      message.reply(
        `${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`
      );
    } else {
      return message.channel.send(
        "Oops! You don't have the correct roles to run the command."
      );
    }
  } else if (message.content === "?annoucments") {
    message.channel.send({
      embed: {
        color: 3447003,
        title: "Annnoucments",
        description: `Very cool stuff`,
        footer: {
          text: "© 2019 Apple Community"
        }
      }
    });
  } else if (message.content === "?kick") {
    if (member.roles.some(role => role.name === "AC Mods", "AC Admins")) {
      let member = message.mentions.members.first();
      if (!member)
        return message.reply({
          embed: {
            color: 3447003,
            title: "Error",
            description: `Please mention a valid member of this server`,
            footer: {
              text: "© 2019 Apple Community"
            }
          }
        });

      if (!member.bannable)
        return message.reply({
          embed: {
            color: 3447003,
            title: "Error",
            description:
              "I cannot kick this user! Do they have a higher role? Do I have kick permissions?",
            footer: {
              text: "© 2019 Apple Community"
            }
          }
        });

      let reason = args.slice(1).join(" ");
      if (!reason) reason = "No reason provided";

      await member.kick(reason).catch(error =>
        message.reply({
          embed: {
            color: 3447003,
            title: "Error",
            description: `Sorry ${message.author}, I wasn't able to kick because ${error}`,
            footer: {
              text: "© 2019 Apple Community"
            }
          }
        })
      );
      message.reply(
        `${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`
      );
    } else {
      return message.channel.send(
        "Oops! You don't have the correct roles to run the command."
      );
    }
  } else if (message.content === "?ping") {
    try {
      const msg = await message.channel.send("🏓 Ping!");
      msg.edit(
        `🏓 Pong! (Roundtrip took: ${msg.createdTimestamp -
          message.createdTimestamp}ms. 💙: ${Math.round(client.ping)}ms.)`
      );
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
    const duration = moment.format(" D [days], H [hrs], m [mins], s [secs]");
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
    if (member.roles.some(role => role.name === "AC Mods", "AC Admins")) {
      let reason = args.slice(1).join(" ");
      let user = message.mentions.users.first();
      let modlog = client.channels.find("name", "logs");
      if (!modlog) return message.reply("I cannot find a mod-log channel");
      if (reason.length < 1)
        return message.reply("You must supply a reason for the warning.");
      if (message.mentions.users.size < 1)
        return message
          .reply("You must mention someone to warn them.")
          .catch(console.error);
      const WarnEmbed = new Discord.RichEmbed()
        .setColor(0x00ae86)
        .setTimestamp()
        .addField("Action:", "Warning")
        .addField("User:", `${user.username}#${user.discriminator}`)
        .addField(
          "Modrator:",
          `${message.author.username}#${message.author.discriminator}`
        );
      return client.channels.get(modlog.id).sendEmbed(WarnEmbed);
    } else {
      message.reply("Oops! Incorrect permissions");
    }
  } else if (message.content === "?rp") {
    if (member.roles.some(role => role.name === "AC Mods", "AC Admins")) {
      annoucments.send("@everyone ITS RP TIME! Head on down to the store");
    } else {
      message.reply("Oops! Incorrect permissions");
    }
  } else if (command == "mandatoryrp") {
    if (member.roles.some(role => role.name === "AC Mods", "AC Admins")) {
      annoucments.send(
        "@everyone ATTENTION! MANDATORY RP! Head on down to the store right now"
      );
    } else {
      message.reply("Oops! Incorrect permissions");
    }
  } else if (message.content === "?meeting") {
    if (member.roles.some(role => role.name === "AC Mods", "AC Admins")) {
      annoucments.send(
        "@everyone ATTENTION! MEETING! Head on down to the store right now"
      );
    } else {
      message.reply("Oops! Incorrect permissions");
    }
  } else if (command === "balance") {
    // [gamma]
    const target = message.mentions.users.first() || message.author;
    return message.channel.send(
      `${target.tag} has ${currency.getBalance(target.id)}💰`
    );
  } else if (command === "inventory") {
    // [delta]
    const target = message.mentions.users.first() || message.author;
    const user = await Users.findOne({ where: { user_id: target.id } });
    const items = await user.getItems();

    if (!items.length)
      return message.channel.send(`${target.tag} has nothing!`);
    return message.channel.send(
      `${target.tag} currently has ${items
        .map(i => `${i.amount} ${i.item.name}`)
        .join(", ")}`
    );
  } else if (command === "say") {
    let text = args.join(" ");
    message.delete();
    message.channel.send(text);
  } else if (command === "transfer") {
    // [epsilon]
    const item = await CurrencyShop.findOne({
      where: { name: { [Op.like]: args } }
    });
    if (!item) return message.channel.send(`That item doesn't exist.`);
    if (item.cost > currency.getBalance(message.author.id)) {
      return message.channel.send(
        `You currently have ${currency.getBalance(
          message.author.id
        )}, but the ${item.name} costs ${item.cost}!`
      );
    }

    const user = await Users.findOne({ where: { user_id: message.author.id } });
    currency.add(message.author.id, -item.cost);
    await user.addItem(item);

    message.channel.send(`You've bought: ${item.name}.`);
  } else if (command === "buy") {
    // [zeta]
    const items = await CurrencyShop.findAll();
    return message.channel.send(
      items.map(item => `${item.name}: ${item.cost}💰`).join("\n"),
      { code: true }
    );
  } else if (command === "shop") {
    // [theta]
  } else if (command === "leaderboard") {
    // [lambda]
  } else if (command === "status") {
  }
  // New ticket command
  if (command == "new") {
    const reason = message.content
      .split(" ")
      .slice(1)
      .join(" ");
    if (!message.guild.roles.exists("name", "AC Mods"))
      return message.channel.send(
        `This server doesn't have a \`Support Staff\` role made, so the ticket won't be opened.\nIf you are an administrator, make one with that name exactly and give it to users that should be able to see tickets.`
      );
    if (message.guild.channels.exists("name", "ticket-" + message.author.id))
      return message.channel.send(`You already have a ticket open.`);
    message.guild
      .createChannel(`ticket-${message.author.id}`, "text")
      .then(c => {
        let role = message.guild.roles.find("name", "AC Mods");
        let role2 = message.guild.roles.find("name", "@everyone");
        c.overwritePermissions(role, {
          SEND_MESSAGES: true,
          READ_MESSAGES: true
        });
        c.overwritePermissions(role2, {
          SEND_MESSAGES: false,
          READ_MESSAGES: false
        });
        c.overwritePermissions(message.author, {
          SEND_MESSAGES: true,
          READ_MESSAGES: true
        });
        message.channel.send(
          `:white_check_mark: Your ticket has been created, #${c.name}.`
        );
        const embed = new Discord.RichEmbed()
          .setColor(0xcf40fa)
          .addField(
            `Hey ${message.author.username}!`,
            `Please try explain why you opened this ticket with as much detail as possible. Our **Support Staff** will be here soon to help.`
          )
          .setTimestamp();
        c.send({
          embed: embed
        });
      })
      .catch(console.error); // Send errors to console
  }

  // Close ticket command
  if (command == "close") {
    if (!message.channel.name.startsWith(`ticket-`))
      return message.channel.send(
        `You can't use the close command outside of a ticket channel.`
      );
    // Confirm delete - with timeout (Not command)
    message.channel
      .send(
        `Are you sure? Once confirmed, you cannot reverse this action!\nTo confirm, type \`?confirm\`. This will time out in 10 seconds and be cancelled.`
      )
      .then(m => {
        message.channel
          .awaitMessages(response => response.content === "?confirm", {
            max: 1,
            time: 10000,
            errors: ["time"]
          })
          .then(collected => {
            message.channel.delete();
          })
          .catch(() => {
            m.edit("Ticket close timed out, the ticket was not closed.").then(
              m2 => {
                m2.delete();
              },
              3000
            );
          });
      });
  }
});

client.login(process.env.TOKEN1);
