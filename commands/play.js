const ytdl = require("ytdl-core");
const Discord = require("discord.js");
const config = require("../config.json");
const { play } = require("../include/play");
const { YOUTUBE_API_KEY } = require("../config.json");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

const prefix = config.PREFIX;

module.exports = {
  name: "play",
  description: "Toca uma música do YouTube",
  async execute(message, args, client) {

    const { channel } = message.member.voice;

    if (!args.length) return message.reply(`**Uso: ${prefix}play <Link do video | Nome do video>**`).catch(console.error);
    if (!channel) return message.reply("**Você precisa estar em um canal de voz para executar esse comando.**").catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);

    if (!permissions.has("CONNECT")) {
      return message.channel.send("**Eu não tenho permissão para conectar neste canal de voz.**").then(x => x.delete({ timeout: 8000 }))
    }
    if (!permissions.has("SPEAK")) {
      return message.channel.send("**Eu não tenho permissão para falar neste canal de voz.**").then(x => x.delete({ timeout: 8000 }))
    }
    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return message.client.commands.get("playlist").execute(message, args, client);
    }

    const serverQueue = message.client.queue.get(message.guild.id);
    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let songInfo = null;
    let song = null;

    if (urlValid) {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.title,
          url: songInfo.video_url,
          duration: songInfo.length_seconds
        };
      } catch (error) {
        if (error.message.includes("copyright")) {
          return message
            .reply("Esse video não pode ser reproduzido por problemas com Copyright!")
            .catch(console.error);
        } else {
          console.error(error);
        }
      }
    } else {
      try {
        const results = await youtube.searchVideos(search, 1);
        songInfo = await ytdl.getInfo(results[0].url);
        song = {
          title: songInfo.title,
          url: songInfo.video_url,
          duration: songInfo.length_seconds
        };
      } catch (error) {
        console.error(error);
      }
    }

    if (serverQueue) {
      serverQueue.songs.push(song)
      return serverQueue.textChannel
        .send(`${song.title} foi adicionada a lista de reprodução`).then(x => x.delete({ timeout: 25000 }))
        .catch(console.error);
    } else {
      queueConstruct.songs.push(song);
    }

    if (!serverQueue) message.client.queue.set(message.guild.id, queueConstruct);

    if (!serverQueue) {
      try {
        queueConstruct.connection = await channel.join();
        play(queueConstruct.songs[0], message, client);
      } catch (error) {
        console.error(`Could not join voice channel: ${error}`);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(`**Não consegui entrar no canal: ${error}.**`).then(x => x.delete({ timeout: 8000 }))
          .catch(console.error);
      }
    }
  }
};
