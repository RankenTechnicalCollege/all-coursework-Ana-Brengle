/*
Generics let you create reusable code that can work with any data type, while still keeping type safety.

Think of generics as a flexbox:
- You decide what type goes inside it (string, number, object, etc.)
-TypeScript remembers that type
-And TypeScript makes sure you only use it correctly

*/

const score: Array<number> = [];
const names: Array<string> = [] 

function identityOne(val: boolean | number): boolean | number {
    return val;
}

function identityTwo(val:any): any {
    return val;
}

//people usually don't write generics this way
// function identityThree<Type>(val: Type): Type {
//     return val;
// }

//identityThree("Ana")
//better way to write generics
function identityFour<T>(val: T): T {
    return val;
}

interface Bottle {
    brand: string;
    type: number;
}

//identityFour<Bottle>({})

// function getSearchProducts<T>(products: T[]): T  {
//     //do some database operations
//     const myIndex = 3;
//     return products[myIndex];
// }

// const getMoreSearchProducts = <T>(products: T[]): T=> {
//     //do some database operations
//     const myIndex = 4;
//     return products[myIndex];
// }

interface Database {
    connection: string, 
    username: string,
    password: string
}

function anotherFunction<T, U extends Database>(valOne:T, valTwo:U):object {
    return {valOne, valTwo};
}
anotherFunction(3, {connection: "myConnection", username: "admin", password: "root"});

interface Quiz {
    name: string,
    type: string
}
interface Course {
  name: string,
  author: string,
  subject: string
}

class Sellable<T> {
  public cart: T[] = []

  addToCart(product: T) {
    this.cart.push(product)
  }
}