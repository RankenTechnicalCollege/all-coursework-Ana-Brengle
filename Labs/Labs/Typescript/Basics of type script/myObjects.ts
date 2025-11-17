// const User = {
//     name: "Apple",
//     email: "apple@example.com",
//     isActive: true
// }

// function createUser({name: string, isPaid: boolean}){}

// let newUser = {name: "ana", isPaid: false, email: "a@e.com"} 
// createUser(newUser)

// function createCourse():{name: string, price: number}{
//     return{name:"reactjs", price: 399}
// }


type User = {
    readonly _id: string
    name: string
    email: string
    isActive: boolean
    creditcardDetails?: number
}

let myUser: User ={
    _id: "1234",
    name: "a",
    email: "a@e.com",
    isActive: false

}

type cardNumber = {
  cardNumber: string;
}

type cardDate = {
  cardDate: string;
}

type cardDetails = cardNumber & cardDate & {
  cvv: number
}
myUser.email="a@e.com"
//myUser._id= "abc"

export {}