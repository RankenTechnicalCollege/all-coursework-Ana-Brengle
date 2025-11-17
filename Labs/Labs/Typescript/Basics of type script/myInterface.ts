interface User {
    readonly dbId: number;
    email: string;
    userId: number;
    googleId?: string;
    //startTrial: () => string;
    startTrial(): string
    getCoupon(couponname: string, value: number): number;
}

interface User{
    githubToken: string;

}

interface Admin extends User {
    role: 'admin' | 'ta' | 'learner';
}

const ana: Admin = { dbId: 22, email:"a@b.com", 
userId: 3344,
githubToken: "ghjkl456",
role: "admin",
startTrial: () => {
    return "trial started";
}, 
getCoupon: (name: 'jojo10', off: 10) => {
    return 10;
},
}
ana.email = "a@b.com";
//dbId: 3344; can't do that because dbId is readonly
export {};