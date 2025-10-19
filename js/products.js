document.addEventListener("DOMContentLoaded", () => {
  const parrafo_nombre = document.getElementById("nombre_usuario");
  const usuario = localStorage.getItem("usuarioLogueado");
  if (!usuario) {
    window.location.href = "login.html";
  } else {
    parrafo_nombre.innerHTML = usuario;
  }

  const spinner = document.getElementById("spinner-wrapper");
  spinner.style.display = "block"; // Mostrar spinner

  const container = document.querySelector(".row.Main-1");
  if (!container) {
    console.error("No se encontró el contenedor .row");
    return;
  }

  const catID = localStorage.getItem("catID");

  if (!catID) {
    spinner.style.display = "none";
    container.innerHTML = "<p class='text-danger'>No se seleccionó ninguna categoría.</p>";
    return;
  }

  const url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

  let productsArray = [];

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Error al cargar el JSON");
      return response.json();
    })
    .then(data => {
      spinner.style.display = "none"; 
      productsArray = data.products;

      showProductsList(productsArray);

      const searchInput = document.querySelector('#Search-bar input[type="text"]');
      searchInput.addEventListener('input', function () {
        const searchText = this.value.toLowerCase();

        const filtered = productsArray.filter(product =>
          product.name.toLowerCase().includes(searchText) ||
          product.description.toLowerCase().includes(searchText)
        );

        showProductsList(filtered);
      });
    })
    .catch(error => {
      spinner.style.display = "none"; 
      console.error("Error:", error);
      container.innerHTML = "<p class='text-danger'>No se pudo cargar la lista de productos.</p>";
    });
});

function setProductID(productid) {
  localStorage.setItem("productID", productid);
  window.location = "product-info.html";
}

function showProductsList(products) {
  const container = document.querySelector(".row.Main-1");
  container.innerHTML = ""; // limpiar resultados previos

}
document.addEventListener("DOMContentLoaded", () => {
  const parrafo_nombre = document.getElementById("nombre_usuario");
  const usuario = localStorage.getItem("usuarioLogueado");
  if (!usuario) {
    window.location.href = "login.html";
  } else {
    parrafo_nombre.innerHTML = usuario;
  }

  const spinner = document.getElementById("spinner-wrapper");
  const container = document.querySelector(".row.Main-1");

  if (!container) {
    console.error("No se encontró el contenedor .row");
    return;
  }

  const catID = localStorage.getItem("catID");

  if (!catID) {
    spinner.style.display = "none";
    container.innerHTML = "<p class='text-danger'>No se seleccionó ninguna categoría.</p>";
    return;
  }

  const url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

  let productsArray = [];

  // Mostrar el spinner mientras se cargan los productos
  spinner.style.display = "block";

  // Realizar el fetch de los productos
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Error al cargar el JSON");
      return response.json();
    })
    .then(data => {
      productsArray = data.products;
      showProductsList(productsArray); // Mostrar los productos
      spinner.style.display = "none"; // Ocultar el spinner después de cargar los productos
    })
    .catch(error => {
      spinner.style.display = "none"; // También ocultamos el spinner si hay un error
      console.error("Error:", error);
      container.innerHTML = "<p class='text-danger'>No se pudo cargar la lista de productos.</p>";
    });

  // Filtro de búsqueda en tiempo real
  const searchInput = document.querySelector('#Search-bar input[type="text"]');
  searchInput.addEventListener('input', function () {
    const searchText = this.value.toLowerCase();
    const filtered = productsArray.filter(product =>
      product.name.toLowerCase().includes(searchText) ||
      product.description.toLowerCase().includes(searchText)
    );
    showProductsList(filtered);
  });

  // Ordenar productos por precio ascendente
  document.getElementById("sortAsc").addEventListener("click", function () {
    const sortedByPriceAsc = [...productsArray].sort((a, b) => a.cost - b.cost);
    showProductsList(sortedByPriceAsc);
  });

  // Ordenar productos por precio descendente
  document.getElementById("sortDesc").addEventListener("click", function () {
    const sortedByPriceDesc = [...productsArray].sort((a, b) => b.cost - a.cost);
    showProductsList(sortedByPriceDesc);
  });

  // Ordenar productos por relevancia (basado en cantidad de artículos vendidos)
  document.getElementById("sortRel").addEventListener("click", function () {
    const sortedByRelevance = [...productsArray].sort((a, b) => {
      // Si ambos productos tienen el mismo número de ventas, no se hace ningún cambio
      if (a.soldCount === b.soldCount) {
        return 0; // Si son iguales, no cambiamos el orden
      }
      // Ordenar de mayor a menor, los productos con más ventas van primero
      return b.soldCount - a.soldCount; // b.soldCount > a.soldCount para ordenar de mayor a menor
    });

    showProductsList(sortedByRelevance);
  });

  // Filtro de productos por precio (mínimo y máximo)
  document.getElementById('filterBtn').addEventListener('click', function () {
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0; // Si no se coloca un valor, se toma 0
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity; // Si no se coloca un valor, se toma Infinity

    // Filtrar productos por el rango de precio
    const filteredProducts = productsArray.filter(product =>
      product.cost >= minPrice && product.cost <= maxPrice
    );

    // Mostrar productos filtrados
    showProductsList(filteredProducts);
  });

  // Limpiar filtros
  document.getElementById('clearBtn').addEventListener('click', function () {
    document.getElementById('minPrice').value = '';  // Limpiar campo de precio mínimo
    document.getElementById('maxPrice').value = '';  // Limpiar campo de precio máximo
    showProductsList(productsArray);  // Mostrar todos los productos
  });
});

// Función para mostrar los productos
function showProductsList(products) {
  const container = document.querySelector(".row.Main-1");
  container.innerHTML = ""; // Limpiar resultados previos

  products.forEach(product => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

    col.innerHTML = `
      <div onclick="setProductID(${product.id})" class="card h-100 shadow-sm">
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.description}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <span class="fw-bold">${product.cost} ${product.currency}</span>
            <button class="btn btn-primary">Agregar</button>
          </div>
        </div>
      </div>
    `;

    container.appendChild(col);
  });
}


// modo oscuro modo claro
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