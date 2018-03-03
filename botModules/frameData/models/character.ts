import { Move } from "./Move";

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

    moves:Move[]
}

export enum Weightclass {
    Light,
    Medium,
    Heavy,
    SuperHeavy
}