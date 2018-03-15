import { User } from "discord.js";
import * as moment from 'moment';

export class LobbyEntry {
    user : User;
    message : string;
    time : number;

    constructor(user : User, message : string, time : number)
    {
        this.user = user;
        this.message = message;
        this.time = time;
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
}