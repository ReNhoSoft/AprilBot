import { Command } from './command'
import { CommandType } from './commandType'
import { AprilBot } from '../aprilbot'
import { Message } from 'discord.js';

export class CommandDefinitions {
    static HELP = 'april help, janus help';
    static LIST = 'april list,april lobbies,april lobby,april where dem bois,janus list, janus lobbies, janus lobby, janus where dem bois';
    static ADDLOBBY = 'steam://joinlobby/';
    static CLOSELOBBY = 'april close,april remove,janus close,janus remove'
    static QUESTION = 'april question, april i have a question,april answer,janus question'
}

export class CommandManager
{
    
    commands : Command[];
    aprilbot : AprilBot;

    constructor(botName:string) 
    { 
        this.aprilbot = new AprilBot(botName);
        this.commands = [];
        this.commands.push(new Command("question", CommandDefinitions.QUESTION.split(","), CommandType.StartsWith, this.aprilbot.AskQuestion, this.aprilbot));
        this.commands.push(new Command("help", CommandDefinitions.HELP.split(","), CommandType.StartsWith, this.aprilbot.ShowHelp, this.aprilbot));
        this.commands.push(new Command("list", CommandDefinitions.LIST.split(","), CommandType.StartsWith, this.aprilbot.ListLobbies, this.aprilbot));
        this.commands.push(new Command("addlobby", CommandDefinitions.ADDLOBBY.split(","), CommandType.Contains, this.aprilbot.AddLobby, this.aprilbot));
        this.commands.push(new Command("closelobby", CommandDefinitions.CLOSELOBBY.split(","), CommandType.StartsWith, this.aprilbot.CloseLobby, this.aprilbot));
    };

    ExecuteCommand(message: Message)
    {
        if(message.channel.id != process.env.ALLOWED_CHANNEL_ID){
            return;
          }
        
          var user = message.author.username + '#' + message.author.discriminator
          this.commands.forEach(command => {
              command.ProcessCommand(message, user);
          })
    }
}