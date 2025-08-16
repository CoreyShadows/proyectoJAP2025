document.querySelector("form").addEventListener("submit", function(e){
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const contraseña = document.getElementById("password").value.trim();

    if (nombre === "" || contraseña === "") {
        alert("Por favor, complete todos los campos.");
    } else {
        window.location.href = "index.html"; 
    }
})