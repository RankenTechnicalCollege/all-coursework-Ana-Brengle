
document.getElementById("btnSucker").addEventListener("click", function (){

    let userInput;
    let truthy = "This is truthy";

    userInput = document.getElementById("txtUserInput").value;

    if (userInput.trim() === "") {

        userInput = "NOTHING!!! Enter Something you DONUT!!!"

    } else if (!isNaN(Number(userInput))) {

        userInput = Number(userInput);

    }else if (userInput.toLowerCase() == "true"){

        userInput = true;

    }else if (userInput.toLowerCase() === "false") {

        userInput = false;

    } else if(userInput.toLowerCase() === "null"){

        userInput = null;

    } else if(userInput.toLowerCase() === "undefined"){

        userInput = undefined;

    } else if(userInput.toLowerCase() === "nan"){

        userInput = NaN;

    } else if(userInput.toLowerCase() === "0n"){

        userInput = 0n
    }
     
    if(!userInput){

        truthy = "This a falsy value"
    }

    document.getElementById("outPut").innerText = `You have entered: ${userInput}.\n 
    The type of JavaScript is: ${typeof(userInput)}. ${truthy}`;
});

