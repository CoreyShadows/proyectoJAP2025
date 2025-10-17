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

let darkmode = localStorage.getItem("darkmode");
const themeSwitch = document.getElementById("theme-switch");

// enable dark mode
const enableDarkMode = () => {
    document.body.classList.add("darkmode");
    localStorage.setItem("darkmode", "active");
    darkmode = "active";
}

// disable dark mode
const disableDarkMode = () => {
    document.body.classList.remove("darkmode");
    localStorage.setItem("darkmode", "inactive");
    darkmode = "inactive";
}

// apply saved preference on load
if (darkmode === "active") {
    enableDarkMode();
}

// add click handler only if the element exists
if (themeSwitch) {
    themeSwitch.addEventListener("click", () => {
        darkmode = localStorage.getItem("darkmode");
        darkmode !== "active" ? enableDarkMode() : disableDarkMode();
    });
}