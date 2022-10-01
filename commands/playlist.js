const Discord = require("discord.js");
const config = require("../config.json");
const { play } = require("../include/play");
const YouTubeAPI = require("simple-youtube-api");
const { YOUTUBE_API_KEY, SIZE_OF_PLAYLIST } = require("../config.json");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);


const prefix = config.PREFIX;

module.exports = {
  name: "playlist",
  description: "Toca uma playlist completa do YouTube",
  async execute(message, args, client) {

    const { channel } = message.member.voice;
    if (!args.length)
      return message.reply(`> **Uso: ${prefix}playlist <Link da Playlist | Nome da Playlist>**`).catch(console.error);
    if (!channel) return message.reply("> **Você precisa estar em um canal de voz para executar esse comando.**").catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);

    if (!permissions.has("CONNECT"))
      return message.reply("> **Eu não tenho permissão para conectar neste canal de voz.**");
    if (!permissions.has("SPEAK"))
      return message.reply("> **Eu não tenho permissão para falar neste canal de voz.**");

    const search = args.join(" ");
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const url = args[0];
    const urlValid = pattern.test(args[0]);

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

    let song = null;
    let playlist = null;
    let videos = [];

    if (urlValid) {
      try {
        playlist = await youtube.getPlaylist(url, { part: "snippet" });
        videos = await playlist.getVideos(SIZE_OF_PLAYLIST || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
        playlist = results[0];
        videos = await playlist.getVideos(SIZE_OF_PLAYLIST || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
      }
    }

    videos.forEach(video => {
      song = {
        title: video.title,
        url: video.url,
        duration: video.durationSeconds
      };

      if (serverQueue) {
        serverQueue.songs.push(song);
        message.channel
          .send(`> ${song.title} foi adicionada a lista de reprodução.`)
          .catch(console.error).then(x => x.delete({ timeout: 15000 }))
          .catch(console.error);
      } else {
        queueConstruct.songs.push(song);
      }
    });

    let text = "";
    let remaining = 0;

    queueConstruct.songs.forEach((song, position) => {
      let toAdd = "`" + (position + 1) + "º` " + song.title + "\n";
      if ((text + toAdd).length > 800) {
        remaining += 1;
      } else {
        text += toAdd;
      }
    });

    text += "**E outras " + remaining + " músicas**";

    message.channel
      .send(`Playlist adicionada: ${playlist.title}`)
      .catch(console.error);

    if (!serverQueue) message.client.queue.set(message.guild.id, queueConstruct);

    if (!serverQueue) {
      try {
        const connection = await channel.join();
        queueConstruct.connection = connection;
        play(queueConstruct.songs[0], message, client);
      } catch (error) {
        console.error(`Could not join voice channel: ${error}`);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(`> **Não consegui entrar no canal: ${error}.**`).catch(console.error);
      }
    }
  }
};
