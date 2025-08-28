const famous = ["ApeLincoln", "TheNotoriousP.I.G", "Brieonce"];

let searchName = "";

document.getElementById("btnUsername").addEventListener("click", function(){
    searchName = document.getElementById("userName").value;

    for(let i = 0; i < famous.length; i++) {
    
    if(famous[i].toLowerCase() === searchName.toLowerCase()){
        document.getElementById("showResult").innerHTML = `Username ${searchName} found!`  
        break; 
    }
    else {
        document.getElementById("showResult").innerHTML = `Username ${searchName} not found!`
    }
    
}
});

