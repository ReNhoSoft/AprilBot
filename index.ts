import { Client } from "discord.js";
import { AprilBot } from "./aprilbot";
import { config } from "dotenv";
import { CommandManager } from './commands/cmdManager'

//Initialize env variables
config();

//Initialize constants
const client = new Client();
const token = process.env.BOT_TOKEN;
const LobbyListMessages = [ "april where dem bois" , "april lobby?", "april lobbies" ]


let  manager : CommandManager;

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  let botName = client.user.username + '#' + client.user.discriminator;
  manager = new CommandManager(botName);
  console.log('I am ready!');
});


// Create an event listener for messages
client.on('message', message => {
  manager.ExecuteCommand(message);
});

// Log our bot in
client.login(token);