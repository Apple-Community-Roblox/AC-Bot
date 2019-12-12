exports.run = (client, message, [mention, ...reason]) => {
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
}