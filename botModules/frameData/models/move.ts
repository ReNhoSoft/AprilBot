export interface Move {
    name:string;
    moveProperties:MoveProperty[];
    notes:string;
}

export interface MoveProperty {
    name:string;
    value:string;
}