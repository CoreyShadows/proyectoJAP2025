document.addEventListener("DOMContentLoaded", () => {
  const parrafo_nombre = document.getElementById("nombre_usuario")
  const usuario = localStorage.getItem("usuarioLogueado");
  if (usuario) {
      parrafo_nombre.innerHTML = usuario;
  }

  const spinner = document.getElementById("spinner-wrapper");
  spinner.style.display = "block"; // Mostrar spinner

  const container = document.querySelector("#main");
  if (!container) {
    console.error("No se encontró el contenedor .row");
    return;
  }

  const productID = localStorage.getItem("productID");

  if (!productID) {
    spinner.style.display = "none";
    container.innerHTML = "<p class='text-danger'>No se seleccionó ninguna categoría.</p>";
    return;
  }

  const URL = `https://japceibal.github.io/emercado-api/products/${productID}.json`;

fetch(URL)
  .then(response => {
    if (!response.ok) {
      throw new Error("Error al cargar el producto");
    }
    return response.json();
  })
  .then(product => {

  spinner.style.display = "none"; // Ocultar spinner

  container.innerHTML = "";

    
    container.innerHTML = `
  <nav>
    <a href="categories.html">Volver al listado</a> | 
    <a href="products.html">${product.category}</a> > 
    <a href="#">${product.name}</a>
  </nav>

  <div class="row mt-3">
    <div class="col-md-6 d-flex">
      <div class="thumb-container" style="max-width: 7.25rem; margin-right: 1rem;">
        <img src="${product.images[0]}" class="thumb-img" alt="">
        <img src="${product.images[1]}" class="thumb-img" alt="">
        <img src="${product.images[2]}" class="thumb-img" alt="">
        <img src="${product.images[3]}" class="thumb-img" alt="">
      </div>
      <div class="flex-grow-1 me-2">
        <img src="${product.images[0]}" class="main-img" id="main-image" alt="${product.name}">
      </div>
    </div>

    <!-- Información -->
    <div class="col-md-6">
    <div class="text-muted mb-3">${product.soldCount} Vendidos hasta el momento </div>
      <h3>${product.name}</h3>
      <div class="price">${product.cost} ${product.currency}</div>
      <div class="text-muted mb-3">${product.description}</div>
      <button class="btn btn-primary me-2">Preguntar</button>
      <button class="btn btn-success">Agregar al carrito</button>
    </div>

    <div>
      <h5 class="mt-4">Podrían interesarte</h5>
      <div class="row g-2" style="max-width: 40rem;">
        <div class="col-4">
          <div onclick="setProductID(${product.relatedProducts[0].id})" class="card car-card">
            <img src="${product.relatedProducts[0].image}" class="card-img-top" alt="">
            <div class="card-body p-2">
              <p class="small mb-0">${product.relatedProducts[0].name}</p>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div onclick="setProductID(${product.relatedProducts[1].id})" class="card car-card">
            <img src="${product.relatedProducts[1].image}" class="card-img-top" alt="">
            <div class="card-body p-2">
              <p class="small mb-0">${product.relatedProducts[1].name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Descripción -->
  <div class="descripcion mt-5">
    <h4>Descripción</h4>
    <p>${product.description} ${product.description} ${product.description} ${product.description} ${product.description} ${product.description} ${product.description} ${product.description}</p>
  </div>
`;

  const mainImage = document.getElementById("main-image");
  const thumbnails = document.querySelectorAll(".thumb-img");

  thumbnails.forEach(thumb => {
  thumb.addEventListener("click", () => {
    mainImage.src = thumb.src;
  });
});


    // Agregar al DOM
    document.body.appendChild(container);
  })
  .catch(error => {
    console.error("Error al cargar el producto:", error);
  }); // ← Aquí estaba faltando el cierre correcto del catch
});

function setProductID(productid) {
  localStorage.setItem("productID", productid);
  window.location = "product-info.html"
}