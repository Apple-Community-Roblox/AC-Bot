exports.run = async (client, message, args) => {
  if(message.author.id != "203104843479515136") return message.channel.send("You're the bot the owner!")

    try {
        await message.channel.send("Bot is shutting down...")
        process.exit()
    } catch(e) {
        message.channel.send(`ERROR: ${e.message}`)
    }
};
