import { Message } from "discord.js";

export interface IBotModule {
    ExecuteTextCommand(message:Message):void;
}