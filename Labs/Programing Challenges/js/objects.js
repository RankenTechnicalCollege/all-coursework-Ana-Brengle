const person = {
    name: "Jane Doe",
    email: "jane.doe@gmail.com",
    pet: "oscar",
    isOnline: false,
    bio: function(){
        return `${this.name} email is ${this.email} her pets name is ${this.pet}.`;
    }
}

addEventListener('load', function(){
    document.getElementById('output').innerText = person.bio()
}); 

document.getElementById("btnUser").addEventListener("change", function(e) {
    person.name = e.target.value;
    document.getElementById('output').innerText = person.bio();
});

document.getElementById('btnUser').addEventListener('click', function() {
    const newName = prompt('Enter New Name:');
    if (newName) {
        person.name = newName;
        document.getElementById("output").innerText = `You have entered the name: ${newName}\n\nUpdated bio: ${person.bio()}`;
    }
});