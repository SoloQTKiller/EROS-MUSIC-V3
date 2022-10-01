const Discord = require("discord.js");

module.exports = {
  name: "queue",
  description: "Exibe as próximas músicas e a atual.",
  execute(message) {

    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.reply("> **Não existe nenhuma musica na playlist.**").catch(console.error);

    let text = "";
    let remaining = 0;

    serverQueue.songs.forEach((song, position) => {
      let toAdd = (position + 1) + ". " + song.title + "\n";
      if ((text + toAdd).length > 800) {
        remaining += 1;
      } else {
        text += toAdd;
      }
    });

    text += "**E outras " + remaining + " músicas**";

    let playlistEmbed = new Discord.MessageEmbed()
      .setTitle(`📃 **| Lista de Reprodução**`)
      .setDescription(`Tocando agora: **${serverQueue.songs[0].title}**`)
      .setColor("9F72C7")
      .addField("**Próximas Músicas:**", text)
    return message.channel.send(playlistEmbed).catch(console.error);
  }
};
