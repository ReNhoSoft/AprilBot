const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = 'Mzk2ODQ3MTMxMDk0NDE3NDA5.DTGibA.VmJEzymZANi9nCtLhZRUMA33wU4';

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('I am ready!');
});

var lobbies = []; // create an empty array

// Create an event listener for messages
client.on('message', message => {
  
  var user = message.author.username + '#' + message.author.discriminator
  if(message.content.includes("steam://joinlobby/"))
  {
      var lobby = message.content;
      if(lobbies.find((x) => { return x.message === lobby })) {
        message.channel.send('Lobby has already been added');
        return;
      }

      lobbies.push({
          user: user,
          message: lobby,
          time: Date.now()
      })

  } else if(message.content.toLowerCase().includes("april close")) {
    lobby = lobbies.find((x) => { return x.user === user }) 
    if(lobby == null) {
        return;
    }
    lobbies.splice(lobbies.indexOf(lobby), 1);

  } else if(message.content.toLowerCase().startsWith("april list")) {
    if(lobbies.length == 0)
    {
        message.channel.send("", { file:"https://images-ext-2.discordapp.net/external/NPEjCbqnymKKuxHOVa6g7j_cTnaaWbD4HwnyDL95SpA/%3Fwidth%3D351%26height%3D702/https/images-ext-1.discordapp.net/external/OuszsoPjHEUjZkrTU1ke8OISRzSCe1UKBpKQ_toGQl8/https/cdn.discordapp.com/attachments/190284932520607745/332614998235021312/player_lobbies.png"})      
    } else {
      lobbies.forEach(lobby => {
          message.channel.send(lobby.user + ' ' + lobby.message)
      });
    }
    
  } else if(message.content.toLowerCase().startsWith("april help")) {
      message.channel.send("", { file:"https://images-ext-2.discordapp.net/external/NPEjCbqnymKKuxHOVa6g7j_cTnaaWbD4HwnyDL95SpA/%3Fwidth%3D351%26height%3D702/https/images-ext-1.discordapp.net/external/OuszsoPjHEUjZkrTU1ke8OISRzSCe1UKBpKQ_toGQl8/https/cdn.discordapp.com/attachments/190284932520607745/332614998235021312/player_lobbies.png"})
  }
});

// Log our bot in
client.login(token);