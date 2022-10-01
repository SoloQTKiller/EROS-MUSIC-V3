const ytdlDiscord = require("ytdl-core-discord");
const Discord = require('discord.js');

module.exports = {
  async play(song, message, client) {

    const queue = message.client.queue.get(message.guild.id);

    const playEmoji = client.emojis.cache.get("705898663116800001");
    const pauseEmoji = client.emojis.cache.get("705898663611990066");
    const loopEmoji = client.emojis.cache.get("705898664375353466");
    const stopEmoji = client.emojis.cache.get("705898655391154322");
    const playAndPause = client.emojis.cache.get("705898654678122497");
    const skipEmoji = client.emojis.cache.get("705898658142617620");
    const stopRed = client.emojis.cache.get("705899363775545426");

    if (!song) {
      queue.channel.leave();
      message.client.queue.delete(message.guild.id);
      return queue.textChannel.send("> **A lista de reprodução chegou ao fim.**").catch(console.error);
    }

    try {
      var stream = await ytdlDiscord(song.url, { highWaterMark: 1 << 25 });
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message, client);
      }

      if (error.message.includes("copyright")) {
        return message.channel
          .send("Esse video não pode ser reproduzido por problemas com Copyright!")
          .catch(console.error);
      } else {
        console.error(error);
      }
    }

    const dispatcher = queue.connection
      .play(stream, { type: "opus" })
      .on("finish", () => {
        if (queue.loop) {
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message, client);
        } else {
          queue.songs.shift();
          module.exports.play(queue.songs[0], message, client);
        }
      })
      .on("error", err => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message, client);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);

    try {
      var playingMessage = await queue.textChannel.send(`🎶 | Tocando agora: ${song.title}`);
      await playingMessage.react(loopEmoji);
      await playingMessage.react(playAndPause);
      await playingMessage.react(stopEmoji);
      await playingMessage.react(skipEmoji);
    } catch (error) {
      console.error(error);
    }

    const filter = (reaction, user) => user.id == message.author.id;
    const collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on("collect", (reaction, user) => {
      if (!queue) return;

      switch (reaction.emoji.name) {
        case loopEmoji.name:
          queue.loop = !queue.loop;
          queue.textChannel
            .send(`${loopEmoji} **Loop** ${queue.loop ? "**Ativado**" : "**Desativado**"}`)
            .catch(console.error)
            .then(a => a.delete({ timeout: 10000 }));
          reaction.users.remove(user);
          break;
        case playAndPause.name:
          if (!queue.playing) {
            queue.playing = true;
            queue.connection.dispatcher.resume();
            queue.textChannel.send(`${playEmoji} **| Pause removido**`)
              .catch(console.error)
              .then(a => a.delete({ timeout: 10000 }));
              reaction.users.remove(user);
              return;
            }
          if (queue.playing) {
            queue.playing = false;
            queue.connection.dispatcher.pause();
            queue.textChannel.send(`${pauseEmoji} **| Música pausada**`)
              .catch(console.error)
              .then(a => a.delete({ timeout: 10000 }));
              reaction.users.remove(user);
              return;
            }
            reaction.users.remove(user);
          break;
        case stopEmoji.name:
          queue.songs = [];
          queue.textChannel.send(`${stopEmoji} **| Música finalizada**`)
            .catch(console.error)
            .then(a => a.delete({ timeout: 10000 }));
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;
        case skipEmoji.name:
          queue.connection.dispatcher.end();
          queue.textChannel.send(`${skipEmoji} **| Música pulada**`)
            .catch(console.error)
            .then(a => a.delete({ timeout: 10000 }));
          collector.stop();
          break;
        default:
          break;
      }
    });

    collector.on("end", () => {
      if (playingMessage) {
        playingMessage.delete()
      }
    });
  }
};
