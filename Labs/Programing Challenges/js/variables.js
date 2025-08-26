const SECRET = 42;

document.getElementById("btnUser").addEventListener("click", function(){

    let userInput;
    let isTrue = "incorrect";

    userInput = document.getElementById("txtUserInput").value;

    if (userInput.trim() === "") {
        userInput = "NOTHING!!! Enter Something you DONUT!!!"
    } else if (!isNaN(Number(userInput))) {
        userInput = Number(userInput);
    }else if (userInput.toLowerCase() == "true"){
        userInput = true;
    }else if (userInput.toLowerCase() === "false") {
        userInput = false;
    }

    if(userInput === SECRET){
        isTrue = "CORRECT A MUNDO";
    }

    document.getElementById("showText").innerText = `You have entered: ${userInput}.\n That is ${isTrue}\n
    The type of JavaScript is: ${typeof(userInput)}`;


   
});