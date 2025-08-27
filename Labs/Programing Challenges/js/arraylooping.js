const famous = ["ApeLincoln", "TheNotoriousP.I.G", "Brieonce"];

let searchName = "";
let found = true;

for(let i = 0; i < famous.length; i++) {
    
    if(famous[i].toLowerCase == userName){
        document.getElementById("btnUsername").addEventListener("click", function(){
            document.getElementById("showResult").innerHTML = `You Entered ${userName}`
        });    
        return found;
    }
    
}