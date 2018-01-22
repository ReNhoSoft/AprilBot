import { Message } from "discord.js";

export class AprilBot
{
static HELP_MSG = "Hi there! I'm April, of the Jellyfish Pirates, here to help keep track of your Steam lobby urls.\n\n"
                + "Here's a list of what I'll do for you:\n`April list` will lists all lobbies.\n`April close` will close your lobby.\n"
                + "`April close` <insert number here> will close the lobby with the corresponding number.\n\n"
                + "If you'd like to add a lobby to the list, just go to your Steam profile and right-click \"join game\""
                + " to copy the link for your lobby's address. I won't list duplicates and only have a memory of five lobbies. So be mindful!\n" 
                + "If there's an issue, message renhosoft#1325! \nhttp://bit.ly/2DnXPPe";

    static NO_LOBBIES_MSG = 'There\'s no lobbies to be found! At your Steam profile, right-click "join game" to copy the link for your lobby\'s'
                        + ' address... and don\'t forget the onions! http://bit.ly/2DnXPPe';
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

    ShowHelp(message : Message, user : string)
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