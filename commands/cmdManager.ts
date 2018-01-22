import { Command } from './command'
import { CommandType } from './commandType'
import { AprilBot } from '../aprilbot'

export class CommandDefinitions {
    static HELP = 'april help, janus help';
    static LIST = 'april list,april lobbies,april lobby,april where dem bois';
    static ADDLOBBY = 'steam://joinlobby/';
    static CLOSELOBBY = 'april close,april remove'
}

export class CommandManager
{
    constructor(botName:string) 
    { 
        this.aprilbot = new AprilBot(botName);
        this.commands.push(new Command("help", CommandDefinitions.HELP.split(","), CommandType.StartsWith, this.aprilbot.ShowHelp));

    };

    commands : Command[];
    aprilbot : AprilBot;
}