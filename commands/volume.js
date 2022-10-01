const Discord = require("discord.js");

module.exports = {
  name: "volume",
  description: "Altera o volume em que a música está sendo reproduzida.",
  execute(message, args) {

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!message.member.voice.channel)
      return message.channel.send("O usuário não esta em canal de voz").catch(console.error).then(x => x.delete({ timeout: 15000 }))
    if (!serverQueue) return message.channel.send("Não existe nenhuma musica em andamento").catch(console.error).then(x => x.delete({ timeout: 8000 }))

    if (!args[0])
      return message.reply(`**Volume atual: \`${serverQueue.volume}\`**`)
      .catch(console.error)
      .then(x => x.delete({ timeout: 8000 }))
    if (isNaN(args[0])) return message.channel.send("> **Use apenas números para alterar o volume**").catch(console.error).then(x => x.delete({ timeout: 8000 }));
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.channel.send("> **O volume só pode ser alterado entre \`0\` e \`100\`**").catch(console.error);

    serverQueue.volume = args[0];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return serverQueue.textChannel.send(`> **Volume alterado para: \`${args[0]}\`**`).catch(console.error).then(x => x.delete({ timeout: 8000 }))
  }
};
