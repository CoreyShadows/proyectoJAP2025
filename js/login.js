document.querySelector("form").addEventListener("submit", function(e){
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const contraseña = document.getElementById("password").value;

    if (nombre === "" || contraseña === "") {
        alert("Por favor, complete todos los campos.");
    } else {
        localStorage.setItem("usuarioLogueado", nombre);
        window.location.href = "index.html"; 
    }
})

document.addEventListener("DOMContentLoaded", () => {
    const parrafo_nombre = document.getElementById("nombre_usuario")
    const usuario = localStorage.getItem("usuarioLogueado");
    if (usuario) {
        parrafo_nombre.innerHTML = usuario;
    }
});

