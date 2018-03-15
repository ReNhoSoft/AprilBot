import { User, Client } from "discord.js";

export interface IBot {
    user : User;
    client: Client;
}