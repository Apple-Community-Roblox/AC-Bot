exports.run = (client, message, member) => {
    const annoucments = client.channels.find(
        ch => ch.name === "annoucments"
      );
    if (member.roles.some(role => role.name === "AC Mods", "AC Admins")) {
        annoucments.send("@everyone ITS RP TIME! Head on down to the store");
      } else {
        message.reply("Oops! Incorrect permissions");
      }
}