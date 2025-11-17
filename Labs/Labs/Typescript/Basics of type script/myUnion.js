var score = 33;
score = 44;
score = "55";
var ana = { name: "ana", id: 3344 };
ana = { username: "abc", id: 3344 };
// function getDbId(id: number | string) {
//     console.log(`DB id is: ${id}`);
// }
getDbId(3);
getDbId("4");
function getDbId(id) {
    if (typeof id === "string") {
        id.toLowerCase();
    }
}
// arrays
var data = [1, 2, 3];
var data2 = ['1', '2', '3'];
var data3 = ['1', '2', 3];
var pi = 3.14;
//pi = 3.145;
//can't so that because pi is of type 3.14
var seatAllotment;
seatAllotment = "aisle";
//seatAllotment = "crew"; // can't do that because it's not in the defined set
