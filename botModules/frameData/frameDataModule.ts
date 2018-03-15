import { CommandManager } from '../../commands/cmdManager'
import { Character } from './models/character'
import { MoveProperty, Move } from "./models/Move";
import { IBotModule } from '../IBotModule'
import * as fs from 'fs'
import { Message } from 'discord.js';
import { IBot } from '../../IBot';
import { Transforms } from './transforms'

export class FrameDataModule implements IBotModule{

    data:Character[];
    commandManager:CommandManager;
    bot: IBot;
    constructor(bot:IBot) {
        this.bot = bot;
        let contents = fs.readFile("data/ggFrameData.json","utf8", (err:Error, contents:string) => {
            if(err)
                console.log(err);

            let temp = <Character[]>JSON.parse(contents);
            this.data = [];
            Object.assign(this.data,temp);
            console.log(JSON.stringify(this.data));
        });
        this.commandManager = new CommandManager();


    }

    ExecuteTextCommand(message: Message):void {
        return;
        // if(message.content.toLowerCase().startsWith(".fd")){
        //     let content = message.content.toLowerCase();
        //     let cmdValues = content.split(" ");
        //     let char = this.FindCharacter(cmdValues[1]);
        //     let move:Move;
        //     if(char)
        //         move = char.GetMove(cmdValues[2])
        //     if(move)
        //         console.log(Transforms.MoveDataToMessage(char, move));
        // }
    }

    FindCharacter(name:string):Character {
        for(let character of this.data) {
            if(character.name.toLowerCase() === name)
                return character;
        }
        return null;
    }
}