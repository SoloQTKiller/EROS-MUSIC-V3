let os = require('os');
const ms = require("ms");
let cpuStat = require("cpu-stat");
const moment = require("moment");
const {version} = require("discord.js");
const { MessageEmbed } = require("discord.js");
const m = require("moment-duration-format");


module.exports = {
  name: "status",
  description: "Use para poder ver minhas informações.",
  execute(message, args, client) {

    let cpuLol;
    cpuStat.usagePercent(function(err, percent, seconds) {
        if (err) {
            return console.log(err);
        }
        const ecpu = `<:CPU:513901259678285824>`;
        const esevers = `<:Servers:513910435381248000>`;
        const echat = `<:chat:513910428833677351>`;
        const ediscord = `<:discord:513889580458573834>`;
        const enode = `<:nodejs:513889572506304523>`;
        const eon = `<:online:513889577748922388>`;
        const eusers = `<:userss:513937957674156035>`;
        const eumem = `<:memoria:511267849109766174>`;
        const euso = `<:chipset:513926194090213377>`;
        const earq = `<:Chip5122:513937954582822923>`;
        const echip = `<:chipset:513910442096328724>`;
        const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        const embedStats = new MessageEmbed()
            .setTitle("***Status do Bot***")
            .setColor("#9F72C7")
            .addField(eumem + " • Memória Usada", `\`\`\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/${(os.totalmem() / 1024 / 1024).toFixed(2)} MB\`\`\``, true)
            .addField(eon + " • Tempo online ", `\`\`\`${duration}\`\`\``, true)
            .addField(eusers + " • Usuários", `\`\`\`${client.users.cache.size}\`\`\``, true)
            .addField(esevers + " • Servidores", `\`\`\`${client.guilds.cache.size}\`\`\``, true)
            .addField(echat + " •  Canais ", `\`\`\`${client.channels.cache.size}\`\`\``, true)
            .addField(ediscord + " • Discord.js", `\`\`\`v${version}\`\`\``, true)
            .addField(enode + " • Node", `\`\`\`${process.version}\`\`\``, true)
            .addField(ecpu + " • CPU", `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``)
            .addField(euso + " • Uso da CPU", `\`\`\`${percent.toFixed(2)}%\`\`\``, true)
            .addField(earq + " • Arquitetura", `\`\`\`${os.arch()}\`\`\``, true)
            .addField(echip + " • Plataforma", `\`\`\`${os.platform()}\`\`\``, true)
        message.channel.send(embedStats)
    });
  }
};
