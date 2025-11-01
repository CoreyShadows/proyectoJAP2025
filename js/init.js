const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

// --- Menú del usuario ---
document.addEventListener("DOMContentLoaded", () => {
  // Verificar si hay un usuario guardado
  const userEmail = localStorage.getItem("usuarioLogueado");

  // Si no hay usuario logueado, redirigir al login
  if (!userEmail && !window.location.href.includes("login.html")) {
    window.location = "login.html";
  }

  // Insertar el menú del usuario en la barra de navegación
  const nav = document.querySelector(".navbar-nav");
  if (nav && userEmail) {
    const userMenu = document.createElement("li");
    userMenu.classList.add("nav-item", "dropdown");

    userMenu.innerHTML = `
      <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
        data-bs-toggle="dropdown" aria-expanded="false">
        ${userEmail}
      </a>
      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
        <li><a class="dropdown-item" href="my-profile.html">Mi perfil</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#" id="logout">Cerrar sesión</a></li>
      </ul>
    `;
    nav.appendChild(userMenu);
  }

  // Función de logout
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogueado");
      window.location = "login.html";
    });
  }

    // Selecciona íconos o elementos que representen el carrito.
    const posiblesCarritos = document.querySelectorAll('.cart-link, .fa-bag-shopping, #cart-badge');

    posiblesCarritos.forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', (e) => {
            // Evita interferir si ya es un <a> con otro comportamiento
            if (el.tagName.toLowerCase() === 'a' && el.getAttribute('href')) return;
            window.location.href = 'cart.html';
        });
    });
});

function updateCartBadge() {
  const cartBadge = document.getElementById('cart-badge');
  if (cartBadge) {
    const productos = JSON.parse(localStorage.getItem('productosCarrito')) || [];
    const totalItems = productos.reduce((sum, product) => sum + product.cantidad, 0);
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
  }
}

// Llamar a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', updateCartBadge);
