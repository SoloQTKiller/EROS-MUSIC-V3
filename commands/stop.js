const Discord = require("discord.js");

module.exports = {
  name: "stop",
  description: "Encerra a reprodução de música",
  execute(message) {

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!message.member.voice.channel)
      return message.reply("> **Você precisa estar em um canal de voz para executar esse comando.**").catch(console.error).then(x => x.delete({ timeout: 8000 }))
    if (!serverQueue) return message.reply("⏹ | Não existe nenhuma musica em andamento").catch(console.error).then(x => x.delete({ timeout: 8000 }))

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    serverQueue.textChannel.send("> **Você encerrou a reprodução da música.**").catch(console.error).then(x => x.delete({ timeout: 8000 }))
  }
};
