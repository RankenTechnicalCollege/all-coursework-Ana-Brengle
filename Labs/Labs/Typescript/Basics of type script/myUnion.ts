let score: number | string = 33;

score = 44;
score = "55";

type User = {
    name: string;
    id: number;
}
type Admin = {
    username: string;
    id: number;
}

let ana: User | Admin = {name: "ana", id: 3344};

ana = {username: "abc", id: 3344};

// function getDbId(id: number | string) {
//     console.log(`DB id is: ${id}`);
// }
getDbId(3);
getDbId("4");

function getDbId(id: number | string) {
    if(typeof id === "string") {
        id.toLowerCase();
    } 
}

// arrays
const data: number[] = [1,2,3];
const data2: string[] = ['1','2','3'];
const data3: (string | number)[] = ['1','2',3];

let pi: 3.14 = 3.14;
//pi = 3.145;
//can't so that because pi is of type 3.14

let seatAllotment: "aisle" | "middle" | "window";
seatAllotment = "aisle";
//seatAllotment = "crew"; // can't do that because it's not in the defined set