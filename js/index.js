document.addEventListener("DOMContentLoaded", function() {
    const usuario = localStorage.getItem("usuarioLogueado");

    if (!usuario) {
        // No hay sesión → al login
        window.location.href = "login.html";
    }
});

document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});