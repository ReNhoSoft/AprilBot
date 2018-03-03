import { Command, BotCallback } from './command'
import { CommandType } from './commandType'
import { AprilBot } from '../april/aprilbot'
import { Message, Client, TextChannel, User } from 'discord.js';
import { IBotModule } from '../botModules/IBotModule'

export class CommandManager
{
    
    commands : Command[];

    constructor() 
    { 
        this.commands = [];
    };

    ExecuteCommand(message: Message)
    {
        if(message.channel.id != process.env.STEAM_CHANNEL_ID){
            return;
          }
          this.commands.forEach(command => {
              command.ProcessCommand(message, message.author);
          })
    }

    AddCommand(name:string, aliases:string[], commandType:CommandType, callback:BotCallback, module:IBotModule) {
        this.commands.push(new Command(name, aliases, commandType, callback, module));
    }
}