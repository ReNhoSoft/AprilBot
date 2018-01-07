import { Client } from "discord.js";
import { AprilBot } from "./aprilbot"


// Create an instance of a Discord client
const client = new Client();

let aprilbot : AprilBot;
// The token of your bot - https://discordapp.com/developers/applications/me
const token = 'Mzk2ODQ3MTMxMDk0NDE3NDA5.DTGibA.VmJEzymZANi9nCtLhZRUMA33wU4';

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  
  let botName = client.user.username + '#' + client.user.discriminator;
  aprilbot = new AprilBot(botName);
  console.log('I am ready!');
});


// Create an event listener for messages
client.on('message', message => {
  if(message.channel.id != '399674427329085442'){
    return;
  }

  var user = message.author.username + '#' + message.author.discriminator
  if(message.content.includes("steam://joinlobby/"))
  {
    aprilbot.AddLobby(message, user);

  } else if(message.content.toLowerCase().includes("april close")) {
    aprilbot.CloseLobby(message, user);

  } else if(message.content.toLowerCase().startsWith("april list")) {
    aprilbot.ListLobbies(message, user);
    
  } else if(message.content.toLowerCase().startsWith("april help")) {
    aprilbot.ShowHelp(message);
  }
});

// Log our bot in
client.login(token);