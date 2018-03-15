import { IBot } from '../../IBot'
import { Message, TextChannel, User } from "discord.js";
import { LobbyEntry } from "./lobbyEntry";
import { IBotModule } from '../IBotModule'
import { CommandManager } from '../../commands/cmdManager'
import { CommandType } from '../../commands/commandType';
var random = require("random-js")();


class CommandDefinitions {
    //Commands
    static HELP = 'april help, janus help';
    static LIST = 'april list,april lobbies,april lobby,april where dem bois,janus list, janus lobbies, janus lobby, janus where dem bois';
    static ADDLOBBY = 'steam://joinlobby/';
    static CLOSELOBBY = 'april close,april remove,janus close,janus remove';
    static QUESTION = 'april question, april i have a question,april answer,janus question';
    static ADDLOBBYCODE = '!add '
}

class LobbyMessages {
    //Messages
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
    static HEADER_MESSAGE = "There's a problem with update 2.1 and steam links are not working, nor joining through steam friends.\n"
                            +"As a temporary solution, you can add your lobby code by typing: !add code";
}

export class SteamLobbyModule implements IBotModule {
    bot : IBot;
    user : User;
    lobbies : Array<LobbyEntry> = [];
    psnLobbies : Array<LobbyEntry> = [];
    lobbyListChannel : TextChannel;
    commandManager:CommandManager;

    constructor(bot: IBot) {
        this.bot = bot;
        this.lobbyListChannel = bot.client.channels.get(process.env.LOBBY_CHANNEL_ID) as TextChannel;
        this.commandManager = new CommandManager();
        this.commandManager.AddCommand("question", CommandDefinitions.QUESTION.split(","), CommandType.StartsWith, this.AskQuestion, this);
        this.commandManager.AddCommand("help", CommandDefinitions.HELP.split(","), CommandType.StartsWith, this.ShowHelp, this);
        this.commandManager.AddCommand("list", CommandDefinitions.LIST.split(","), CommandType.StartsWith, this.ListLobbies, this);
        this.commandManager.AddCommand("addlobby", CommandDefinitions.ADDLOBBY.split(","), CommandType.Contains, this.AddLobby, this);
        this.commandManager.AddCommand("addpsnlobbycode", CommandDefinitions.ADDLOBBYCODE.split(","), CommandType.StartsWith, this.AddPSNLobbyCode, this);
        this.commandManager.AddCommand("addsteamlobbycode", CommandDefinitions.ADDLOBBYCODE.split(","), CommandType.StartsWith, this.AddSteamLobbyCode, this);
        this.commandManager.AddCommand("closelobby", CommandDefinitions.CLOSELOBBY.split(","), CommandType.StartsWith, this.CloseLobby, this);
    }

    ExecuteTextCommand(message:Message):void {
        if(message.channel.id != process.env.STEAM_CHANNEL_ID && message.channel.id != process.env.PSN_CHANNEL_ID){
            return;
        }
        this.commandManager.ExecuteCommand(message);
    }


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
            message.channel.send(LobbyMessages.LOBBY_ALREADY_EXISTS_MSG);
            return;
        }

        //Add lobby to the collection
        this.lobbies.unshift(new LobbyEntry(user, lobby, Date.now()));
        message.channel.send(LobbyMessages.LOBBY_ADDED_MSG);

        this.UpdateLobby()
    }

    AddLobbyCode(message : Message, user : User, lobbies:Array<LobbyEntry>)
    {
        var lobby = message.content.split(' ')[1];

        //Ignore if the message is comming from the bot itself
        if(user == this.user)
        {
            return;
        }

        //If lobby has already been added, send error message and ignore it
        if(lobbies.find((x) => { return x.message === lobby })) {
            message.channel.send(LobbyMessages.LOBBY_ALREADY_EXISTS_MSG);
            return;
        }

        //Add lobby to the collection
        lobbies.unshift(new LobbyEntry(user, lobby, Date.now()));
        message.channel.send(LobbyMessages.LOBBY_ADDED_MSG);

        this.UpdateLobby()
    }

    AddSteamLobbyCode(message : Message, user : User)
    {
        if(message.channel.id == process.env.STEAM_CHANNEL_ID)
        {
            this.AddLobbyCode(message, user, this.lobbies);
        }
    }

    AddPSNLobbyCode(message : Message, user : User)
    {
        if(message.channel.id == process.env.PSN_CHANNEL_ID) {
            this.AddLobbyCode(message, user, this.psnLobbies);
        }
    }

    CloseLobby(message : Message, user : User)
    {
        //Fail early
        let lobbyIndex = this.GetLobbyIndex(message.content);
        let userLobbyIndex = this.GetUserLobbyIndex(user);
        if(isNaN(lobbyIndex) && userLobbyIndex < 0) {
            message.channel.send(LobbyMessages.LOBBY_NOT_SPECIFIED_MSG);
            return;
        }
        
        if(!isNaN(lobbyIndex) && lobbyIndex >= 0 && lobbyIndex < this.lobbies.length)
        {
            this.RemoveLobby(lobbyIndex);
        }
        else if(userLobbyIndex >= 0) {
            this.RemoveLobby(userLobbyIndex);
        }
        
        message.channel.send(LobbyMessages.LOBBY_CLOSED_MSG);
        this.UpdateLobby();
    }

    ListLobbies(message : Message, user : User)
    {
        message.channel.send( "You can get an always up to date list of the lobbies in " 
                                + this.lobbyListChannel 
                                + "\nType April Help for a list of my commands.");
    }

    ShowHelp(message : Message, user : User)
    {
        message.author.send(LobbyMessages.HELP_MSG);
    }
    
    AskQuestion(message:Message, user : User)
    {
        message.channel.send(random.pick(LobbyMessages.QUESTION_RESPONSES));
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
                this.lobbyListChannel.send(LobbyMessages.HEADER_MESSAGE);
                this.lobbyListChannel.send("** ------------ STEAM LOBBIES ----------- **");
                this.lobbies.forEach(lobbyDetails => {
                    this.lobbyListChannel.send( (this.lobbies.indexOf(lobbyDetails) + 1) + ")", {embed: {
                        author: {
                            name: `${lobbyDetails.user.username}`,
                            icon_url: lobbyDetails.user.avatarURL ? lobbyDetails.user.avatarURL : undefined,
                            timestamp: lobbyDetails.time 
                        },
                        description: lobbyDetails.message + '\n @ ' + lobbyDetails.GetTimeInCST() + 'CST'
                        }});    
                });
                this.lobbyListChannel.send("\n** ----------- PSN LOBBIES ----------- **");
                this.psnLobbies.forEach(lobbyDetails => {
                    this.lobbyListChannel.send( (this.psnLobbies.indexOf(lobbyDetails) + 1) + ")", {embed: {
                        author: {
                            name: `${lobbyDetails.user.username}`,
                            icon_url: lobbyDetails.user.avatarURL ? lobbyDetails.user.avatarURL : undefined,
                            timestamp: lobbyDetails.time 
                        },
                        description: lobbyDetails.message + '\n @ ' + lobbyDetails.GetTimeInCST() + 'CST'
                        }});    
                });
            }).then( () => {
                if(this.lobbies.length == 0) {
                    this.lobbyListChannel.send(LobbyMessages.NO_LOBBIES_MSG);
                }
            })                     
            .catch(console.error);
     }
}