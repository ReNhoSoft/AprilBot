import { CommandType } from './commandType'
import { Message, User } from 'discord.js';
import { AprilBot } from '../april/aprilbot';
import { IBotModule } from '../botModules/IBotModule';

export class Command {

    constructor(name:string, aliases:string[], type:CommandType, callback:BotCallback,  botModule : IBotModule) 
    { 
        this.name = name;
        this.alisases = aliases;
        this.type = type;
        this.callback = callback;
        this.botModule = botModule;
    }

    name : string;
    alisases : string [];
    type : CommandType;
    callback: BotCallback;
    botModule : IBotModule;

    ProcessCommand(message: Message, user: User) : void {
        if(this.ValidateCommand(message.content.toLowerCase()))
            this.callback.apply(this.botModule, [message, user]);
    }

    ValidateCommand(command : string):boolean {
        for(let i = 0; i < this.alisases.length; i++)
        {
            let alias = this.alisases[i];
            switch(this.type) {
                case CommandType.StartsWith: {
                    if(command.startsWith(alias))
                        return true;
                    break;
                }
                case CommandType.Equals: {
                    if(command == alias)
                        return true;
                    break;
                }
                case CommandType.Contains: {
                    if(command.includes(alias))
                        return true;
                    break;
                }
            }
        
        }
        return false;
    }
   
}

export interface BotCallback {
    (message:Message, user:User):void;
}