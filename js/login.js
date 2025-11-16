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
        window.location.href = "index.html"; 
    }
});

let darkmode = localStorage.getItem("darkmode");
const themeSwitch = document.getElementById("theme-switch");


const enableDarkMode = () => {
    document.body.classList.add("darkmode");
    localStorage.setItem("darkmode", "active");
    darkmode = "active";
}

const disableDarkMode = () => {
    document.body.classList.remove("darkmode");
    localStorage.setItem("darkmode", "inactive");
    darkmode = "inactive";
}

if (darkmode === "active") {
    enableDarkMode();
}

if (themeSwitch) {
    themeSwitch.addEventListener("click", () => {
        darkmode = localStorage.getItem("darkmode");
        darkmode !== "active" ? enableDarkMode() : disableDarkMode();
    });
}