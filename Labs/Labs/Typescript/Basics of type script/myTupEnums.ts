//const user: ( string | number)[] = [1, "ab"];

let tUser: [string, number, boolean]

tUser = ['ana', 123, true];
// tUser = [123, 'ana', true];
// can't do that because types are in the wrong order

let rgb: [number, number, number] = [255, 0, 255];

type User = [number, string];
const newUser: User =[112, "example@google.com"];

newUser[1]="hc.com"

export{}