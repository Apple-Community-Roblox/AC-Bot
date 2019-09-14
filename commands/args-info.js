module.exports = {
	name: 'user-info',
	description: 'Tells you user info',
	execute(client,message, args) {
		if (!args.length) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        }
        
        message.channel.send(`Command name: ${command}\nArguments: ${args}`);
	},
};