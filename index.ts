import { Client } from "discord.js";
import { AprilBot } from "./april/aprilbot";
import { config } from "dotenv";

//Initialize env variables
config();

//Initialize constants
const client = new Client();
const token = process.env.BOT_TOKEN;

let aprilBot:AprilBot;

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  aprilBot = new AprilBot(client, client.user);
  console.log('I am ready!');
});


// Create an event listener for messages
client.on('message', message => {
  aprilBot.ExecuteTextCommand(message);
});

client.on('error', message => {
  console.log(message);
})

// Log our bot in
client.login(token);

