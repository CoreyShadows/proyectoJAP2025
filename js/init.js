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
    const usuario = localStorage.getItem("usuarioLogueado");
    if (!usuario) {
        window.location.href = "login.html";
    } else {
    }
});


  // Función de logout
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
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

function updateCartBadge() {
  const cartBadge = document.getElementById('cart-badge');
  const productos = JSON.parse(localStorage.getItem('productosCarrito')) || [];
  const totalItems = productos.reduce((s, p) => s + (p.cantidad || 0), 0);
  if (cartBadge) {
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'inline-block' : 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  
  // Actualiza el nombre de usuario para que se vea en el haeder
  const parrafo_nombre = document.getElementById("nombre_usuario");
  const usuario = localStorage.getItem("usuarioLogueado");
  if (usuario) {
    parrafo_nombre.innerHTML = usuario;
  }
  
  // Asegura que cualquier elemento con clase .cart-link lleve a cart.html
  document.querySelectorAll('.cart-link').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      // si es <a href="..."> ya navegará; esto no rompe esa funcionalidad
      if (el.tagName.toLowerCase() === 'a') return;
      window.location.href = 'cart.html';
    });
  });
});
