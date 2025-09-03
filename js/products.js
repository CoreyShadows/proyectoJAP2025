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

  // 🚀 Recuperar el ID de la categoría guardado en localStorage
  const catID = localStorage.getItem("catID");

  if (!catID) {
    spinner.style.display = "none";
    container.innerHTML = "<p class='text-danger'>No se seleccionó ninguna categoría.</p>";
    return;
  }

  // 🚀 Usar el catID en la URL del fetch
  const url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Error al cargar el JSON");
      return response.json();
    })
    .then(data => {
      spinner.style.display = "none"; // Ocultar spinner

      container.innerHTML = "";

      data.products.forEach(product => {
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

        col.innerHTML = `
          <div class="card h-100 shadow-sm">
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
    })
    .catch(error => {
      spinner.style.display = "none"; // Ocultar spinner en caso de error
      console.error("Error:", error);
      container.innerHTML = "<p class='text-danger'>No se pudo cargar la lista de productos.</p>";
    });
});