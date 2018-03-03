import { Character } from './models/character'
import { MoveProperty } from "./models/Move";
import * as fs from 'fs'

export class FrameDataModule {

    
    constructor() {
        let contents = fs.readFile("data/ggFrameData.json","utf8", (err:Error, contents:string) => {
            let test = <Character>JSON.parse(contents);
        });
    }
    
}