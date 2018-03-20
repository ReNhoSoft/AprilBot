import { User } from "discord.js";
import * as moment from 'moment';

export class LobbyEntry {
    user : User;
    message : string;
    time : number;
    type:LobbyType;

    constructor(user : User, message : string, time : number, type: LobbyType)
    {
        this.user = user;
        this.message = message;
        this.time = time;
        this.type = type;
    }

    ToMessage() : string {
        return this.user.username + ' ' + this.message + ' ' + this.GetTimeString();
    }

    GetTimeString() : string
    {
        let timestamp = Math.floor((Date.now() - this.time)/1000);
        let hours   = Math.floor(timestamp / 3600);
        let minutes = Math.floor((timestamp - (hours * 3600)) / 60);
        let seconds = timestamp - (hours * 3600) - (minutes * 60);
        let time = '';

        if(hours > 0) 
        {
            time += hours + 'h ';
        }
        if (minutes > 0) 
        {
            time += minutes + 'm ';
        }
        if (seconds > 0) 
        {
            time += seconds + 's ';
        }
        return time + 'ago';
    }

    GetTimeInCST() :string
    {
        return moment(this.time).format('HH:mm:ss');
    }

    GetLobbyTypeString() :string 
    {
        switch(this.type) {
            case LobbyType.PsnCode: 
                return "**PSN LOBBY**";
            case LobbyType.SteamLink: 
                return "**STEAM LOBBY**";
        }
        return "";
    }
}

export enum LobbyType {
    PsnCode,
    SteamLink
}