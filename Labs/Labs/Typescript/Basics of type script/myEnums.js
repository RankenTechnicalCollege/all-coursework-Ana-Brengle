// const AISLE = 0;
// const MIDDLE =1;
// const WINDOW = 2;
// if(seat === 0) {
// }
var SeatChoice;
(function (SeatChoice) {
    SeatChoice[SeatChoice["AISLE"] = 0] = "AISLE";
    SeatChoice[SeatChoice["MIDDLE"] = 1] = "MIDDLE";
    SeatChoice[SeatChoice["WINDOW"] = 2] = "WINDOW";
    SeatChoice[SeatChoice["FOURTH"] = 3] = "FOURTH";
})(SeatChoice || (SeatChoice = {}));
var abSeat = SeatChoice.AISLE;
