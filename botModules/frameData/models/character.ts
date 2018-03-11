import { Move, MoveProperty } from "./Move";

export class Character {
    name:string;
    weightClass:Weightclass;

    defenseModifier: number;
    guts: number;
    stunResistance: number;
    jumpStartup:number;
    backdash:number;
    backdashInvincibility:number;
    faceDownWakeup:number;
    faceUpWakeup:number;

    moves:Move[];

    GetMove(name:string):Move {
        for(let move of this.moves) {
            if(move.name.toLowerCase() === name)
                return move;
        }
        return null;
    }
}

export enum Weightclass {
    Light,
    Medium,
    Heavy,
    SuperHeavy
}