const client = window.client = new Discord.Client();
      client.on('ready', () => {
        console.log('[CLIENT] Ready!');
      });
      client.on('debug', console.log);
      client.on('error', console.error);
      client.ws.on('close', (event) => console.log('[CLIENT] Disconnect!', event));
      client.on('message', (message) => {
        console.log(message.author.username, message.author.id, message.content);
      });
      
client.login(proccess.env.toker)