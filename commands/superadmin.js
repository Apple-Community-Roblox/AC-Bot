const { RichEmbed } = require("discord.js");
const { redlight } = require("/app/colours.json");

exports.run = async (message, args, {  user }) => {
  // check if the command caller has permission to use the command
  if (!message.member.hasPermission("MANAGE_ROLES") || !message.guild.owner)
    return message.channel.send(
      "You dont have permission to use this command."
    );

  if (!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"]))
    return message.channel.send("I don't have permission to add roles!");

  let body = await this.client.trello.get.lists(process.env.trelloToken, user.current);
  if (!args.join(" ").match(/\s\|\s/, "|")) {
    message.channel.send(`Format is invalid!`);
    return;
  }
  let c = args
    .join(" ")
    .replace(/\s\|\s/, "|")
    .split("|");
  let cargs = c.reverse()[0].split(" ");
  let listName = c.slice(c.length - 1).join(" ");
  let query = await this.client.util.query(
    message,
    body,
    listName,
    "name",
    item => `${item.name} (${item.cards.length} Cards)`,
    "Type the number of the list you want to create a card in."
  );
  if (query.quit) return;
  let result = query.result;
  if (result !== null) {
    let createdCard = await this.client.trello.add.card(
      user.trelloToken,
      result.id,
      cargs.join(" ")
    );
    message.reply(
      `Created card "${cargs.join(" ")}" \`(${
        createdCard.shortLink
      })\` in list "${result.name}".`
    );
  } else message.reply(`No list by the name of "${listName}" was found!`);

  //send an embed to the modlogs channel
  let embed = new RichEmbed()
    .setColor(redlight)
    .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
    .addField("Moderation:", "Superadmin")
    .addField("Username:", cargs)
    .addField("Moderator:", message.author.username)
    .addField("Date:", message.createdAt.toLocaleString());
  let sChannel = message.guild.channels.find(c => c.name === "logs");
  sChannel.send(embed);
};
