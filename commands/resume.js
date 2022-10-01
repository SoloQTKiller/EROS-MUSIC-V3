const Discord = require("discord.js");

module.exports = {
  name: "resume",
  description: "Volta a reproduzir uma música pausada",
  execute(message) {
    
    const serverQueue = message.client.queue.get(message.guild.id);

    if (!message.member.voice.channel)
      return message.reply("> **Você precisa estar em um canal de voz para executar esse comando.**").catch(console.error);

    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      return serverQueue.textChannel.send("▶ | A Música voltou a ser reproduzida").catch(console.error);
    }
    return message.reply("⏸ | Não existe nenhuma musica em andamento").catch(console.error);
  }
};
