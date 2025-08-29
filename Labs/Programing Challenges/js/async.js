document.getElementById("brewBtn").addEventListener('click', function(){
    document.getElementById("brewStatus").innerText = "loading....."
    setTimeout(() => {
        document.getElementById("brewStatus").innerText = "Coffee is Brewing!"
    }, 3000);
})
document.getElementById("toastBtn").addEventListener('click', function(){
    document.getElementById("toastStatus").innerText = "loading....."
    setTimeout(() => {
        document.getElementById("toastStatus").innerText = "Toast is Done!"
    }, 2000);
})
document.getElementById("juiceBtn").addEventListener('click', function(){
    document.getElementById("juiceStatus").innerText = "loading....."
    setTimeout(() => {
        document.getElementById("juiceStatus").innerText = "Juice is Poured!"
    }, 1000);
})