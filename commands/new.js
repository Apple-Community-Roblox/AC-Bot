exports.run = (client, message, args) => {
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