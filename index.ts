import { Client, TextChannel } from "discord.js";
import { AprilBot } from "./april/aprilbot";
import { config } from "dotenv";
import { CommandManager } from './commands/cmdManager'

//Initialize env variables
config();

//Initialize constants
const client = new Client();
const token = process.env.BOT_TOKEN;

let  manager : CommandManager;

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  let lobbyChannel = client.channels.get(process.env.LOBBY_CHANNEL_ID) as TextChannel;
  manager = new CommandManager(client.user, lobbyChannel);
  console.log('I am ready!');
});


// Create an event listener for messages
client.on('message', message => {
  manager.ExecuteCommand(message);
});

client.on('error', message => {
  console.log(message);
})

// Log our bot in
client.login(token);