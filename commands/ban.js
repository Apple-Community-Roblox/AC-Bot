exports.run = (client, message, [mention, ...reason]) => {
  const adminRole = message.guild.roles.find(role => role.name === "AC Mods");
  if (!adminRole) return console.log("The Admins role does not exist");

  if (!message.member.roles.has(adminRole.id))
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

  if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.reply("");
  
  const banMember = message.mentions.members.first();

  banMember.ban(reason.join(" ")).then(member => {
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