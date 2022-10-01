const Discord = require("discord.js");

module.exports = {
  name: "loop",
  description: "Ativa ou desativa a reprodução da mesma música.",
  async execute(message) {

    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send("<:Stop:704808354140389568> | Não existe nenhuma música em andamento.").catch(console.error);

    serverQueue.loop = !serverQueue.loop;
    return serverQueue.textChannel
      .send(`<:Repetir:704808354043920474> **Loop** ${serverQueue.loop ? "**Ativado**" : "**Desativado**"}`)
      .catch(console.error);
  }
};
