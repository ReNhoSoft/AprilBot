import { Message, User, Client } from "discord.js";
import { IBot } from "../IBot"
import { IBotModule } from "../botModules/IBotModule";
import { SteamLobbyModule } from "../botModules/steamlobbies/steamLobbyModule";
import { FrameDataModule } from "../botModules/frameData/frameDataModule";
var random = require("random-js")();

export class AprilBot implements IBot
{
    user : User;
    client: Client;
    modules:IBotModule[] = [];

    constructor(client:Client, user : User) {
        this.user = user;
        this.client = client;
        this.modules.push(new SteamLobbyModule(this));
        this.modules.push(new FrameDataModule(this))
    };

    ExecuteTextCommand(message:Message):void {
        this.modules.forEach((botModule:IBotModule) => {
            botModule.ExecuteTextCommand(message);
        });
    }
}