const color = require('colors');
const { join } = require("path");
const { readdirSync } = require("fs");
const discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { TOKEN, PREFIX } = require("./config.json");
const client = new discord.Client({ disableEveryone: true, disabledEvents: ["TYPING_START"] });


client.login(TOKEN);
client.commands = new discord.Collection();
client.prefix = PREFIX;
client.queue = new Map();

client.on("ready", () => {
  console.log("Iniciado!".green);
  console.log(`Autenticado como: ${client.user.username}`.green);
  client.user.setPresence({ status: 'online' })
  console.log(`Servidores: ${client.guilds.cache.size} \nUsuários: ${client.users.cache.size}.`.green);

  const status = [
    "K!help",
    `${client.guilds.cache.size} servidores.`,
    `${client.users.cache.size} usuários.`,
    "música de qualidade.",
    "estou pronto para ouvir seus comandos.",
    "K!help",
    "dúvidas? use e!help."
  ];

  setInterval(() => {
    const index = Math.floor(Math.random() * (status.length - 1) + 1); 
    client.user.setActivity(`${status[index]}`, { url: 'https://twitch.tv/soloqtkiller', type: 'STREAMING' });
    //client.user.setActivity({ game: { name: status[index], url: 'https://www.twitch.tv/soloqtkiller', type: 1 } });
  }, 60000); 

});
client.on("warn", info => console.log(info));
client.on("error", console.error);

const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.guild) return;

  if (message.content.startsWith(PREFIX)) {
    const args = message.content
      .slice(PREFIX.length)
      .trim()
      .split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
      client.commands.get(command).execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply("Algum erro aconteceu ao executar esse comando.").catch(console.error);
    }
  }
});

client.on("guildCreate", async guild => {

  let newguild = new MessageEmbed()
    .setTitle("Entrei em um novo servidor")
    .setColor("#00ff3c")
    .addField(" Nome: ", `\`\`\`${guild.name}\`\`\``, true)
    .addField(" ID: ", `\`\`\`${guild.id}\`\`\``, true)
	  .addField("󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀", "󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀", true)
    .addField(" Dono: ", `\`\`\`${guild.owner.user.tag}\`\`\``, true)
    .addField(" Dono ID: ", `\`\`\`${guild.owner.user.id}\`\`\``, true)
	  .addField("󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀", "󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀", true)
    .addField(" Membros: ", `\`\`\`${guild.memberCount}\`\`\``, false)


  client.channels.cache.get('709835917950451823').send(newguild);

});

client.on("guildDelete", async guild => {

  let newguild = new MessageEmbed()
    .setTitle("Sai de em um servidor")
    .setColor("#ff1500")
    .addField(" Nome: ", `\`\`\`${guild.name}\`\`\``, true)
    .addField(" ID: ", `\`\`\`${guild.id}\`\`\``, true)
	  .addField("󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀", "󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀", true)
    .addField(" Dono: ", `\`\`\`${guild.owner.user.tag}\`\`\``, true)
    .addField(" Dono ID: ", `\`\`\`${guild.owner.user.id}\`\`\``, true)
	  .addField("󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀", "󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀󠀀", true)
    .addField(" Membros: ", `\`\`\`${guild.memberCount}\`\`\``, false)


  client.channels.cache.get('709835932035055677').send(newguild);

});