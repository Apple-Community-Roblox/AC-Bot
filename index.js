const Discord = require('discord.js');
const hook = new Discord.WebhookClient('620389825656258601', 'XA3A2llD89lp_m4WdKMX6MYkMaoimMEZKtiItEM7EltdKizkM8dnW53ra6w1X7VmE2X4');
const client = new Discord.Client();
const bot = new Discord.Client()
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
client.on('message', message => {
  // Ignore messages that aren't from a guild
  if (!message.guild) return;

  // If the message content starts with "!kick"
  if (message.content.startsWith('?kick')) {
    // Assuming we mention someone in the message, this will return the user
    // Read more about mentions over at https://discord.js.org/#/docs/main/stable/class/MessageMentions
    const user = message.mentions.users.first();
    // If we have a user mentioned
    if (user) {
      // Now we get the member from the user
      const member = message.guild.member(user);
      // If the member is in the guild
      if (member) {
        /**
         * Kick the member
         * Make sure you run this on a member, not a user!
         * There are big differences between a user and a member
         */
        member.kick('Optional reason that will display in the audit logs').then(() => {
          // We let the message author know we were able to kick the person
          hook.send(`${message.author} has kicked ${user.tag} from the server :O`)
          message.reply(`Successfully kicked ${user.tag}`);
        }).catch(err => {
          // An error happened
          // This is generally due to the bot not being able to kick the member,
          // either due to missing permissions or role hierarchy
          message.reply('I was unable to kick the member');
          // Log the error
          console.error(err);
        });
      } else {
        // The mentioned user isn't in this guild
        message.reply('That user isn\'t in this guild!');
      }
    // Otherwise, if no user was mentioned
    } else {
      message.reply('You didn\'t mention the user to kick!');
    }
  }
});

client.on('message', message => {
  // Ignore messages that aren't from a guild
  if (!message.guild) return;

  // if the message content starts with "!ban"
  if (message.content.startsWith('?ban')) {
    // Assuming we mention someone in the message, this will return the user
    // Read more about mentions over at https://discord.js.org/#/docs/main/stable/class/MessageMentions
    const user = message.mentions.users.first();
    // If we have a user mentioned
    if (user) {
      // Now we get the member from the user
      const member = message.guild.member(user);
      // If the member is in the guild
      if (member) {
        /**
         * Ban the member
         * Make sure you run this on a member, not a user!
         * There are big differences between a user and a member
         * Read more about what ban options there are over at
         * https://discord.js.org/#/docs/main/stable/class/GuildMember?scrollTo=ban
         */
        member.ban({
          reason: 'They were bad!',
        }).then(() => {
          // We let the message author know we were able to ban the person
          hook.send(`${message.author} has banned ${user.tag} from the server :O`)
          message.reply(`Successfully banned ${user.tag}`);
        }).catch(err => {
          // An error happened
          // This is generally due to the bot not being able to ban the member,
          // either due to missing permissions or role hierarchy
          message.reply('I was unable to ban the member');
          // Log the error
          console.error(err);
        });
      } else {
        // The mentioned user isn't in this guild
        message.reply('That user isn\'t in this guild!');
      }
    } else {
    // Otherwise, if no user was mentioned
      message.reply('You didn\'t mention the user to ban!');
    }
  }
});

client.on('message', msg => {
  if (msg.content === '?ping') {
    msg.reply('Pong!');
  } else if (msg.content === '?beep') {
    msg.reply('Boop')
  } else if (msg.content === '?hello'){
    msg.reply(`Hi, ${msg.author}`)
  } else if (msg.content === `?server`) {
    msg.channel.send(`Server name: ${msg.guild.name}\nTotal members: ${msg.guild.memberCount}`);
  } else if (msg.content === `?user-info`) {
    msg.channel.send(`Your username: ${msg.author.username}\nYour ID: ${msg.author.id}`);
  } else if (msg.content === `?md1`) {
    channel.bulkDelete(1)
    .then(messages => msg.reply(`Bulk deleted ${messages.size} messages`))
    .catch(console.error);
  } else if (msg.content === `?md2`) {
    channel.bulkDelete2
    .then(messages => msg.reply(`Bulk deleted ${messages.size} messages`))
    .catch(console.error);
  } else if (msg.content === `?md1000`) {
    channel.bulkDelete(1000)
    .then(messages => msg.reply(`Bulk deleted ${messages.size} messages`))
    .catch(console.error);
  } else if (msg.content === `?invite`) {
    // Create an invite to a channel
    channel.createInvite()
    .then(invite => msg.reply(`Created an invite with a code of ${invite.code}`))
    .catch(console.error);
  } else if (msg.content === `?test`) {
    msg.reply('Test, test, 1, 2, 3')
  }
});

client.on('message', msg => {
  if (msg.content === `?rp`) {
    const channel = member.guild.channels.find(ch => ch.name === 'annoucments');
    if (!channel) return;
    channel.send(`${everyone} **ITS RP TIME!**/n/nHead on down to the store so we can start the rp!`)
  }
});
 
client.on('message', msg => {
  if (msg.content === `?mandatoryrp`) {
    const channel = member.guild.channels.find(ch => ch.name === 'annoucments');
    if (!channel) return;
    channel.send(`${everyone} **MANDATORY RP!**/n/nHead on down to the store right now! Not joining could lead to demotion.`)
  }
});
      
client.login(process.env.token)
