import { MoveProperty, Move } from "./models/Move";
import { Character } from './models/character'
import { String, StringBuilder } from 'typescript-string-operations';

export class Transforms {
    static MoveDataToMessage(char:Character, move:Move):string {
        let result =  String.Format('Char: {0}| Move: {1}\nStartup:{2} | Active: {3} | Recovery: {4}\n'
                        + 'Frame adv.: {5} | IB adv: {6} | Level: {7}\n'
                        + 'Guard:{8} | Tension: {9} | RISC: {10} | Prorate: {11} | Invul: {12} | Damage: {13} | Notes: {14}'
                        ,char.name, move.name, move.GetProperty( "Startup"), move.GetProperty("Active"), move.GetProperty("Recovery"));
        return result;
    }
}

// Char: May | Move: f.S
// Startup: 12f | Active: 3f | Recovery: 20f
// Frame adv.: -9 | IB adv: -12 | Level: 2
// Guard: Mid | Tension: 264 | RISC: -7 / +10 | Prorate: - | Invul: - | Damage: 33 | Notes: -