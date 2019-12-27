exports.run = (client, message, member) => {
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
  
  const annoucments = client.channels.find(ch => ch.name === "annoucments");

  annoucments.send(
    "@everyone **ATTENTION! MANDATORY RP!** Head on down to the store **now**"
  );
};
