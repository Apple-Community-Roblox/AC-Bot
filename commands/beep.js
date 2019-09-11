export function run(client, message, args) {
    message.channel.send("Boop!").catch(console.error);
}