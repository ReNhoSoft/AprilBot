import { Message } from "discord.js";

export class AprilBot
{
    lobbies : Array<ILobbyEntry>;

    constructor() {
        this.lobbies = [];
     };

    AddLobby(message : Message, user : string)
    {
        var lobby = message.content;
        if(this.lobbies.find((x) => { return x.message === lobby })) {
            message.channel.send('Lobby has already been added');
            return;
        }

        this.lobbies.push({
            user: user,
            message: lobby,
            time: Date.now()
        })
    }

    CloseLobby(message : Message, user : string)
    {
        let lobby = this.lobbies.find((x) => { return x.user === user }) 
        if(lobby == null) {
            return;
        }
        this.lobbies.splice(this.lobbies.indexOf(lobby), 1);
    }

    ListLobbies(message : Message, user : string)
    {
        if(this.lobbies.length == 0)
        {
            message.channel.send("", { file:"https://images-ext-2.discordapp.net/external/NPEjCbqnymKKuxHOVa6g7j_cTnaaWbD4HwnyDL95SpA/%3Fwidth%3D351%26height%3D702/https/images-ext-1.discordapp.net/external/OuszsoPjHEUjZkrTU1ke8OISRzSCe1UKBpKQ_toGQl8/https/cdn.discordapp.com/attachments/190284932520607745/332614998235021312/player_lobbies.png"})      
        } else {
            this.lobbies.forEach(lobby => {
                message.channel.send(lobby.user + ' ' + lobby.message)
            });
        }
    }

    ShowHelp(message : Message)
    {
        
    }


}

interface ILobbyEntry {
    user : string;
    message : string;
    time : number;
}