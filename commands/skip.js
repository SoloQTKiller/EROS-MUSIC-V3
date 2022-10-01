const Discord = require("discord.js");

module.exports = {
  name: "skip",
  description: "Skip the currently playing song",
  async execute(message) {

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!message.member.voice.channel)
      return message.reply("> **Você precisa estar em um canal de voz para executar esse comando.**").catch(console.error);
    if (!serverQueue)
      return message.channel.send("⏹ | Não existe nenhuma musica em andamento").catch(console.error);

    serverQueue.connection.dispatcher.end();
    serverQueue.textChannel.send("⏭ **| Música pulada**").catch(console.error);
  }
};
