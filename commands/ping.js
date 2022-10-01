const Discord = require("discord.js");

module.exports = {
  name: "ping",
  description: "Use para poder ver qual o meu ping.",
  execute(message, args, client) {

    const msg = message.channel.send("Ping?").then(async (msge) => {
      msge.edit(`Pong! Minha latência é de ${msge.createdTimestamp - message.createdTimestamp}ms. A latência da minha API é de ${client.ws.ping}ms`);
      });
    
  }
};
