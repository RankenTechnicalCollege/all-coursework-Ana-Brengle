"use strict";
/*
Generics let you create reusable code that can work with any data type, while still keeping type safety.

Think of generics as a flexbox:
- You decide what type goes inside it (string, number, object, etc.)
-TypeScript remembers that type
-And TypeScript makes sure you only use it correctly

*/
Object.defineProperty(exports, "__esModule", { value: true });
const score = [];
const names = [];
function identityOne(val) {
    return val;
}
function identityTwo(val) {
    return val;
}
//people usually don't write generics this way
// function identityThree<Type>(val: Type): Type {
//     return val;
// }
//identityThree("Ana")
//better way to write generics
function identityFour(val) {
    return val;
}
function anotherFunction(valOne, valTwo) {
    return { valOne, valTwo };
}
anotherFunction(3, { connection: "myConnection", username: "admin", password: "root" });
class Sellable {
    cart = [];
    addToCart(product) {
        this.cart.push(product);
    }
}
//# sourceMappingURL=myGenerics.js.map