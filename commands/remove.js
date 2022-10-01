const Discord = require("discord.js");

module.exports = {
  name: "remove",
  description: "Remove uma música da lista de reprodução",
  async execute(message, args) {
    if (!args.length) return message.reply(`> **Uso: ${prefix}remove <Numero da música>**`);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send("⏹ | Não existe nenhuma musica em andamento").catch(console.error);

    const song = serverQueue.songs.splice(args[0] - 1, 1);
    serverQueue.textChannel.send(`${song[0].title}`);
  }
};
