export class Move {
    name:string;
    moveProperties:MoveProperty[];
    notes:string;

    GetProperty(name:string):MoveProperty {
        for(let prop of this.moveProperties) {
            if(prop.name.toLowerCase() === name) {
                return prop;
            }
            return null;
        }
    }
}

export interface MoveProperty {
    name:string;
    value:string;
}