document.addEventListener("DOMContentLoaded", () => {
    const usuario = localStorage.getItem("usuarioLogueado");
    if (!usuario) {
        window.location.href = "login.html";
    } else {
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
window.addEventListener("load", () => {
  const loader = document.getElementById("loaderhome");
  const nav = document.getElementById("navbarhome");
  const main = document.getElementById("main-contenthome");
  const footer = document.getElementById("footerhome");

  loader.style.display = "none"; 
  nav.style.display = "block";
  main.style.display = "block";
  footer.style.display = "block";
});