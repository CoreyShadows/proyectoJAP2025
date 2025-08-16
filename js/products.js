document.addEventListener("DOMContentLoaded", function() {
    const usuario = localStorage.getItem("usuarioLogueado");

    if (!usuario) {
        // No hay sesión → al login
        window.location.href = "login.html";
    }
});