"use strict";
// people don't usually write classes this way in TS, but it's possible
// class User{ 
//     public email: string;
//     name: string;
//     private readonly city: string = ""
//     constructor(email:string, name: string){
//         this.email = email;
//         this.name = name;
//     }
// }
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    email;
    name;
    //protected means only this class and subclasses can access it 
    _courseCount = 1;
    city = "";
    constructor(email, name) {
        this.email = email;
        this.name = name;
    }
    deleteToken() {
        console.log("Token deleted");
    }
    get getAppleEmail() {
        return `apple${this.email}`;
    }
    get courseCount() {
        return this._courseCount;
    }
    set courseCount(courseNum) {
        if (courseNum <= 1) {
            throw new Error("Course count should be more than 1");
        }
        this._courseCount = courseNum;
    }
}
class SubUser extends User {
    isFamily = true;
    changeCourseCount() {
        this._courseCount = 4;
    }
}
const ana = new User("a@b.com", "Ana");
//ana.city = "Seattle";
//# sourceMappingURL=index.js.map