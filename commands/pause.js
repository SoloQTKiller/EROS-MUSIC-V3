const Discord = require("discord.js");

module.exports = {
  name: "pause",
  description: "Pausa a musica que está tocando.",
  execute(message) {
    
    if (!message.member.voice.channel)
      return message.channel.send("> **Você precisa estar em um canal de voz para executar esse comando.**").catch(console.error);

    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause(true);
      return serverQueue.textChannel.send("⏸ | Música pausada").catch(console.error);
    }
    return message.channel.send("⏸ | Não existe nenhuma musica em andamento").catch(console.error);
  }
};
