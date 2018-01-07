import { Message } from "discord.js";

export class AprilBot
{
static HELP_MSG = "Hello! :cat: I'm April of the Jellyfish Pirates and I'm here to help you find any recently posted lobbies.\n"
    + "Here is a list of my commands:\n"
    + "April list or lobby? - Lists all lobbies\n"
    + "April close / April close n - Closes lobby n, with where n is a number ex; April close 3 would close lobby 3 in the lobby list.\n"
    + "April question - A fortune telling command, use at your own risk my fortunes always come true. ex. April question, will I win EVO?  Like a magic "
    + "8 ball, ask yes or no questions.\n\n"
    + "To add a lobby to the list, just simply post any steam:// style lobby postings, so I'm very easy to use, and I won't list duplicates, and will "
    + "delete the oldest lobbies in the list incase anyone forgets to close theirs.\n"
    + "Note my commands only work in steam-netplay.\n"
    + "If there's any problems or you have suggestions, message Lucky.\n"
    + "Here is instructions on how to create your lobby, just paste the steam link in the channel when you're done and I'll keep track of it and help "
    + "others find your lobby :3 \nhttps://cdn.discordapp.com/attachments/190284932520607745/332614998235021312/player_lobbies.png"

    static NO_LOBBIES_MSG = 'No lobbies up at this time. Be the change you'
        + ' want to see, be the hero we need but do not deserve. Here\'s how '
        + 'to create your own just paste the steam link here and I\'ll track '
        + 'it and help people find your lobby https://i.imgur.com/LvELaC5.png' 
        + '\nType april help for a list of commands';
    static LOBBY_ALREADY_EXISTS_MSG = 'Lobby has already been added';
    static CANNOT_FIND_LOBBY_TO_CLOSE_MSG = 'Please specify a lobby to close';
    static LOBBY_ADDED_MSG = 'Lobby has been added';
    static LOBBY_CLOSED_MSG = 'Lobby has been closed';

    username : string;
    lobbies : Array<LobbyEntry>;

    constructor(username : string) {
        this.username = username;
        this.lobbies = [];
     };

    AddLobby(message : Message, user : string)
    {
        var lobby = message.content;

        //Ignore if the message is comming from the bot itself
        if(user == this.username)
        {
            return;
        }

        //If lobby has already been added, send error message and ignore it
        if(this.lobbies.find((x) => { return x.message === lobby })) {
            message.channel.send(AprilBot.LOBBY_ALREADY_EXISTS_MSG);
            return;
        }

        //Add lobby to the collection
        this.lobbies.unshift(new LobbyEntry(user, lobby, Date.now()));
        message.channel.send(AprilBot.LOBBY_ADDED_MSG);
    }

    CloseLobby(message : Message, user : string)
    {
        let lobbyIndex = this.GetLobbyIndex(message, user);
        if(lobbyIndex < 0 || lobbyIndex >= this.lobbies.length) {
            message.channel.send(AprilBot.CANNOT_FIND_LOBBY_TO_CLOSE_MSG);
            return;
        }
        
        this.lobbies.splice(lobbyIndex, 1);
        message.channel.send(AprilBot.LOBBY_CLOSED_MSG);
    }

    ListLobbies(message : Message, user : string)
    {
        if(this.lobbies.length == 0)
        {
            message.channel.send(AprilBot.NO_LOBBIES_MSG);
            return;
        }
        let finalMessage = "List of lobbies ordered newest to oldest:";
        let count = 1;
        this.lobbies.forEach(lobby => {
            finalMessage += '\n' + count + ') ' + lobby.ToMessage();
            count++;
        });

        finalMessage += '\nType April Help for a list of my commands.'
        message.channel.send(finalMessage);
    }

    ShowHelp(message : Message)
    {
        message.author.send(AprilBot.HELP_MSG);
    }

    private GetLobbyIndex(message : Message, user : string) : number {
        let lobbyIndex : number;
        lobbyIndex = Number.parseInt(message.content.substring(12)) - 1;
        
        if(isNaN(lobbyIndex))
        {
            let lobby = this.lobbies.find((x) => { return x.user === user })
            if(lobby != null) {
                lobbyIndex = this.lobbies.indexOf(lobby);
                return lobbyIndex;
            }
            return -1;
        }
        return lobbyIndex;
    }
}

export class LobbyEntry {
    user : string;
    message : string;
    time : number;

    constructor(user : string, message : string, time : number)
    {
        this.user = user;
        this.message = message;
        this.time = time;
    }

    ToMessage() : string {
        return this.user + ' ' + this.message + ' ' + this.GetTimeString();
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
}