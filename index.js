// Load up the discord.js library
const Discord = require("discord.js");
const Cleverbot = require("cleverbot-node");
// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();
const clbot = new Cleverbot;
clbot.configure({botapi: "CC7u28vR_1YFQlpPD_rFxS6UpOw"});
// Here we load the config.json file that contains our token and our prefix values.
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

  client.on("message", message => {
  if (message.channel.type === "dm") {
    clbot.write(message.content, (response) => {
      message.channel.startTyping();
      setTimeout(() => {
        message.channel.send(response.output).catch(console.error);
        message.channel.stopTyping();
      }, Math.random() * (1 - 3) + 1 * 1000);
    });
  }
});

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setGame(`$help`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setGame(`$help`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`on rarxd`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Let's go with a few common example commands! Feel free to delete or change those.


  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use.
    // To get the "message" itself we join the `args` back into a string with spaces:
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{});
    // And we get the bot to say the thing:
    message.channel.send(sayMessage);
  }

  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit:
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Administrator", "Mods"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable)
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

    // slice(1) removes the first part, which here should be the user mention!
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the kick!");

    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }

  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable)
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the ban!");

    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }

  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.

    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);

    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
});
// 'client.on('message')' commands are triggered when the
// specified message is read in a text channel that the bot is in.

client.on('message', message => {
  if (message.content === '$gay') {
    message.reply('ur mum gay');

  }
});

client.on('message', message => {
  if (message.content === '$help') {
    message.reply('$ping (displays latency)');
    message.reply('$say (usage say [text])');
    message.reply('$purge (deletes message 2 to 100) [ADMIN])');
    message.reply('$ban (usage ban @user [reason]) [ADMIN]');
    message.reply('$kick (usage kick @user [reason]) [ADMIN] [MOD]');
    message.reply('$yare (Yare Yare Daze)');

  }
});

client.on('message', message => {
    if (message.content.startsWith('$dm ') && message.mentions.users.size) {
        var v=message.toString().split(' ').shift().shift().join(' ') // Takes the DM content from the message
        var member=message.mentions.users[0]
        member.send(v)
    }
})

client.on('message', message => {
  if (message.content === '$starwars') {
    message.reply('Luke Skywalker has vanished.');
  message.reply('In his absence, the sinister');
message.reply('FIRST ORDER has risen');
message.reply('from the ashes of the Empire');
message.reply('and will not rest until Skywalker, the last Jedi');
message.reply('has been destroyed.');
message.reply('With the support of the REPUBLIC,');
message.reply('General Leia Organa leads a brave RESISTANCE.');
message.reply('She is desperate to find her');
message.reply('brother Luke and gain his');
message.reply('help in restoring peace and');
message.reply('justice to the galaxy.');
message.reply('Leia has sent her most daring');
message.reply('pilot on a secret mission');
message.reply('to Jakku, where an old ally');
message.reply('has discovered a clue to');
message.reply('Luke’s whereabouts . . . .');
  }
});
client.on('message', message => {
  if (message.content === '$spam') {
    message.reply('@everyone');
  message.reply('@everyone');
    message.reply('@everyone');
    message.reply('@everyone');
    message.reply('@everyone');
    message.reply('@everyone');
    message.reply('@everyone');
    message.reply('@everyone');
    message.reply('@everyone');
    message.reply('@everyone');
    message.reply('@everyone');
    message.reply('@everyone');
    message.reply('@everyone');
    message.reply('@everyone');
    message.reply('@everyone');
  }
});
client.on('message', message => {

  if (!message.guild) return;

  if (message.content === '$yare') {

    if (message.member.voiceChannel) {
      message.member.voiceChannel.join()

        .then(connection => { // Connection is an instance of VoiceConnection
        const dispatcher = connection.playFile('./yareyaredaze.mp3');
          message.reply('yare yare daze');
        
        })

        .catch(console.log);
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
});
client.login("NDE5ODgwNjY1ODMyNDg4OTYx.DX2ubQ.OYH6ZaOuXJi5f44pRhg4P0fJkCQ");
