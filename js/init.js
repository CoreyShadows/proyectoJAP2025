const BASE_URL = "http://localhost:3000/api";
const CATEGORIES_URL = `${BASE_URL}/categories`;
const PRODUCTS_URL = `${BASE_URL}/categories-products`;
const PRODUCT_INFO_URL = `${BASE_URL}/products/`;
const PRODUCT_INFO_COMMENTS_URL = `${BASE_URL}/comments/`;
const CART_INFO_URL = `${BASE_URL}/cart`;
const CART_BUY_MODE_URL = BASE_URL;
const EXT_TYPE = "";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

function getJSONData(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching:', url, error);
      return { status: "error", error: error.message };
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
