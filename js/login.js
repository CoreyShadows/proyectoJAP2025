document.querySelector("form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const usuario = document.getElementById("nombre").value.trim();
    const password = document.getElementById("password").value;

    if (usuario === "" || password === "") {
        alert("Por favor, complete todos los campos.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ usuario, password })
        });

        const data = await response.json();

        alert(data.message);

        if (data.token) {
            localStorage.setItem("token", data.token);
        } else {
            localStorage.removeItem("token");
        }

        localStorage.setItem("usuarioLogueado", usuario);

        window.location.href = "index.html";

    } catch (error) {
        alert("No se pudo conectar con el servidor");
    }
});


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



