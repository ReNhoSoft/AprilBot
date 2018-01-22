import { CommandType } from './commandType'
import { Message } from 'discord.js';

export class Command {

    constructor(name:string, aliases:string[], type:CommandType, callback:BotCallback) 
    { 
        this.name = name;
        this.alisases = aliases;
        this.type = type;
        this.callback = callback;
    }

    name : string;
    alisases : string [];
    type : CommandType;
    callback: BotCallback;

    ProcessCommand(message: Message, user: string) : void {
        if(this.ValidateCommand(message.content))
            this.callback(message, user);
    }

    ValidateCommand(command : string):boolean {
        this.alisases.forEach(alias => {
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
        });

        return false;
    }
}

export interface BotCallback {
    (message:Message, user:string):void;
}