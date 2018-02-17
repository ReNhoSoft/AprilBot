import { Message, TextChannel, User } from "discord.js";
var random = require("random-js")();

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
    static LOBBY_NOT_SPECIFIED_MSG = 'Please specify a lobby to close';
    static CANNOT_FIND_LOBBY_TO_CLOSE_MSG = 'That lobby was not found, so it couldn\'t be closed.';
    static LOBBY_ADDED_MSG = 'Lobby has been added';
    static LOBBY_CLOSED_MSG = 'Lobby has been closed';
    static QUESTION_RESPONSES = ["Can't predict right now", 'Outlook not so good', 'Don\'t count on it', 'My sources say no', 
                                 'It is certain', 'Absolutely', 'Signs point to yes', 'It is decidedly so', 'You are in grave danger'];

    user : User;
    lobbies : Array<LobbyEntry>;
    lobbyListChannel : TextChannel;

    constructor(user : User, channel:TextChannel) {
        this.user = user;
        this.lobbies = [];
        this.lobbyListChannel = channel;
     };

    AddLobby(message : Message, user : User)
    {
        var lobby = message.content;

        //Ignore if the message is comming from the bot itself
        if(user == this.user)
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

        this.UpdateLobby()
    }

    CloseLobby(message : Message, user : User)
    {
        //Fail early
        let lobbyIndex = this.GetLobbyIndex(message.content);
        let userLobbyIndex = this.GetUserLobbyIndex(user);
        if(isNaN(lobbyIndex) && userLobbyIndex < 0) {
            message.channel.send(AprilBot.LOBBY_NOT_SPECIFIED_MSG);
            return;
        }
        
        if(!isNaN(lobbyIndex) && lobbyIndex >= 0 && lobbyIndex < this.lobbies.length)
        {
            this.RemoveLobby(lobbyIndex);
        }
        else if(userLobbyIndex >= 0) {
            this.RemoveLobby(userLobbyIndex);
        }
        
        message.channel.send(AprilBot.LOBBY_CLOSED_MSG);
    }

    ListLobbies(message : Message, user : User)
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

    ShowHelp(message : Message, user : User)
    {
        message.author.send(AprilBot.HELP_MSG);
    }
    
    AskQuestion(message:Message, user : User)
    {
        message.channel.send(random.pick(AprilBot.QUESTION_RESPONSES));
    }

    private RemoveLobby(index:number)
    {
        this.lobbies.splice(index, 1);
    }

    private GetLobbyIndex(content : string) : number
    {
        let lobbyIndex = Number.parseInt(content.substring(12));
        return lobbyIndex - 1;
    }

    private GetUserLobbyIndex(user: User) : number
    {
        let lobby = this.lobbies.find((x) => { return x.user === user })
        if(lobby != null)
            return this.lobbies.indexOf(lobby);
        
        return -1;
    }

    private UpdateLobby() :void
    {
        
        this.lobbyListChannel.fetchMessages({ limit: 10 })
            .then(messages => { 
                messages.array().forEach(element => {
                    element.delete();
                });
            }).then(() => {
                this.lobbies.forEach(lobbyDetails => {
                    this.lobbyListChannel.send("", {embed: {
                        author: {
                            name: `${lobbyDetails.user.username}`,
                            icon_url: lobbyDetails.user.avatarURL ? lobbyDetails.user.avatarURL : undefined,
                            timestamp: lobbyDetails.time 
                        },
                        description: lobbyDetails.message + '\n' + lobbyDetails.GetTimeString()
                        }});    
                });
                
            })                     
            .catch(console.error);
     }
}

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