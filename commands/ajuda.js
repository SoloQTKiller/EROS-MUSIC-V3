const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ajuda",
  description: "Lista completa de comandos.",
  execute(message, client) {
    let commands = message.client.commands.array();
    
    let helpEmbed = new MessageEmbed()
    .setTitle("Menu de Ajuda")
    .setDescription("Veja como me usar com a lista de comandos abaixo:")
    .setColor("#9F72C7")
    commands.forEach(cmd => {
      helpEmbed.addField(
        `${message.client.prefix}${cmd.name}`,
        `${cmd.description}`
        , true);
    });

    helpEmbed.setTimestamp();

    return message.channel.send(helpEmbed);
  }
};
