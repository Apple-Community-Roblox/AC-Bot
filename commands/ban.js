exports.run = (client, message, [mention, ...reason]) => {
    const adminRole = message.guild.roles.find(role => role.name === "AC Admin");
    if (!adminRole)
      return console.log("The AC Admins role does not exist");
  
    if (!message.member.roles.has(adminRole.id))
      return message.reply("You can't use this command.");
  
    if (message.mentions.members.size === 0)
      return message.reply("Please mention a user to kick");
  
    if (!message.guild.me.hasPermission("BAN_MEMBERS"))
      return message.reply("");
  
    const banMember = message.mentions.members.first();
  
    banMember.ban(reason.join(" ")).then(member => {
      message.reply(`${member.user.username} was succesfully kicked.`);
    });
  };