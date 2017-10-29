const Discord = require("discord.js");


const client = new Discord.Client();

const config = require("./config.json");

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {

  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});


client.on("message", async message => {
  const swearWords = ["darn", "shucks", "frak", "shite"];
  if( swearWords.some(word => message.content.includes(word)) ) {
    message.reply("Oh no you said a bad word!!!");
  }
  if(message.author.bot) return;

  if(message.content.indexOf(config.prefix) !== 0) return;


  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();


  if(command === "say") {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{});
    message.channel.send(sayMessage);
  }

  if(command === "kick") {
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, je hebt helaas geen permission voor dit");

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Je moet wel iemand uit de server mentionen!");
    if(!member.kickable)
      return message.reply("Ik kan deze gebruiker niet bannen. Heeft  hij een hogere rol? en heb ik kick permission?");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Je moet wel een reden invoeren voor de kick!");

    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} Ik kon deze persoon niet bannen omdat: ${error}`));
    message.reply(`${member.user.tag} is gekickt door ${message.author.tag} met als reden: ${reason}`);

  }

  if(command === "ban") {
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Sorry, Je hebt helaas geen permission voor dit!");

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Je moet wel iemand uit de server mentionen!");
    if(!member.bannable)
      return message.reply("Ik kan deze gebruiker niet bannen. Heeft hij een hogere rank dan mij? en heb ik ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Je moet een reden geven voor de ban!");

    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} Ik kan deze persoon niet bannen omdat: ${error}`));
    message.reply(`${member.user.tag} is geband door ${message.author.tag} met als reden: ${reason}`);
  }
  if(command === "help") {
      if (args[0] === "moderation") {
        message.reply("Moderation help:")
      } else { message.channel.send({embed: {
          color: 0xFF0202,
          author: {
            name: client.user.username,
            icon_url: client.user.avatarURL
          },
          fields: [{
              name: "!help",
              value: "Krijg dit bericht"
            },
            {
              name: "!help moderation",
              value: "Krijg alle moderation commands"
            },
            {
              name: "!help fun",
              value: "Krijg alle fun commands"
            },
            {
              name: "!help music",
              value: "Krijg alle music help",
            },
            {
              name: "!help ranks",
              value: "krijg alle rank commands"
            }
          ],
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: " DanielvdSpoel"
          }
        }
      });}

    }
  if(command === "ping") {
    const Discord = require('discord.js');
    let embed = new Discord.RichEmbed()

    .setColor(0xFF0202)
    .addField(':ping_pong: Pong!', `Took: (**${Date.now() - message.createdTimestamp}**) ms\n1000 ms = 1 second`)
    message.channel.send({embed});
  }
  if(command === "hosting") {
     let role = message.guild.roles.find("name", "hosting");
     message.guild.member(message.author).addRole(role).catch(console.error);
       return message.reply("Je hebt nu de role Hosting!");
   }
  if(command === "userinfo") {
    var user = message.mentions.member.first()
    const status = {
      online: "Online",
      idle: "Idle",
      dnd: "Do Not Disturb",
      offline: "Offline/Invisible"
    };
    var embed2 = new Discord.RichEmbed()
      .setColor(0xFF0202)
      .addField("Full Username", `${message.author.username}#${message.author.discriminator}`)
      if(!user) message.channel.send(embed2);
  }
  if(command === "purge") {

    const deleteCount = parseInt(args[0], 10);

    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
  if(command === "order") {
      return message.reply("I have sent you a PM");
  }
});
client.on('guildMemberAdd', member => {
  console.log(`${member.user.tag} has joined the ${member.guild.name} server`);
  var welcomeChannel = member.guild.channels.find('name', 'member-log')
  if (welcomeChannel != null) {
  const embed = new Discord.RichEmbed()
    .setColor(0x15FF00)
    .setTimestamp()
    .setDescription(`Welcome ${member.user} to the ${member.guild.name}!!\n${dommerd} and enjoy your time here`)
    welcomeChannel.send({embed})
} else {
return
};
});
client.on("guildMemberAdd", member => {
  member.createDM();
  member.send("Welkom op de DanielvdSpoel Discord.");
  member.send("Om het voor iedereen duidelijk te houden hebben we de Discord gesplitst in een Nederlands en Engels deel. Graag zou ik willen weten in welke taal je alles wilt lezen:");
  member.send("");
  member.send("Typ 1 voor Engels");
  member.send("Typ 2 voor Nederlands");

});
client.login(config.token);
