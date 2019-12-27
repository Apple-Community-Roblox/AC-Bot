exports.run = (client, message, [mention, ...reason]) => {
  const modRole = message.guild.roles.find(role => role.name === "AC Mods");
  if (!modRole) return console.log("The Mods role does not exist");

  if (!message.member.roles.has(modRole.id))
    return message.reply({
        embed: {
          color: 3447003,
          title: "Error",
          description: `You can't use that command`,
          footer: {
            text: "© 2019 Apple Community"
          }
        }
      });

  if (message.mentions.members.size === 0)
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

  if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("");
  
  const kickMember = message.mentions.members.first();

  kickMember.kick(reason.join(" ")).then(member => {
    message.reply({
        embed: {
          color: 3447003,
          title: "Success",
          description: `${member.user.username} was succesfully kicked.`,
          footer: {
            text: "© 2019 Apple Community"
          }
        }
    });
  });
};