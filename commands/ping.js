exports.run = (client, message, args) => {
    async () => {
        try {
            const msg = await message.channel.send("🏓 Ping!");
            msg.edit(
              `🏓 Pong! (Roundtrip took: ${msg.createdTimestamp -
                message.createdTimestamp}ms. 💙: ${Math.round(client.ping)}ms.)`
            );
          } catch (e) {
            console.log(e);
          }
    }
}