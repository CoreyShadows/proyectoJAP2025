document.addEventListener("DOMContentLoaded", () => {
  const nombreUsuario = document.getElementById("nombre_usuario");
  const usuario = localStorage.getItem("usuarioLogueado");
  if (usuario) nombreUsuario.textContent = usuario;

  const container = document.getElementById("main");
  const productID = localStorage.getItem("productID");

  if (!productID) {
    container.innerHTML = "<p class='text-danger'>No se seleccionó ningún producto.</p>";
    return;
  }

  const productURL = `https://japceibal.github.io/emercado-api/products/${productID}.json`;
  const commentsURL = `https://japceibal.github.io/emercado-api/products_comments/${productID}.json`;

  // Cargar producto
  fetch(productURL)
    .then(res => res.json())
    .then(product => {
      renderProduct(product);
      renderRelated(product.relatedProducts);
    });

  // Cargar comentarios
  fetch(commentsURL)
    .then(res => res.json())
    .then(comments => {
      const commentsContainer = document.createElement("div");
      commentsContainer.id = "comments-section";
      commentsContainer.className = "mt-5";
      commentsContainer.innerHTML = `<h4>Calificaciones de usuarios</h4>`;

      comments.forEach(comment => {
        commentsContainer.innerHTML += `
          <div class="border rounded p-3 mb-3 bg-white">
            <div class="d-flex justify-content-between">
              <strong>${comment.user}</strong>
              <span class="text-muted">${comment.dateTime}</span>
            </div>
            <div class="text-warning">${"★".repeat(comment.score)}${"☆".repeat(5 - comment.score)}</div>
            <p>${comment.description}</p>
          </div>
        `;
      });

      document.getElementById("main").appendChild(commentsContainer);

      // 👉 Agregar formulario después de comentarios
      addReviewForm(commentsContainer);
    })
    .catch(error => {
      console.error("Error al cargar comentarios:", error);
    });

  // Render de producto
  function renderProduct(product) {
    container.innerHTML = `
      <nav>
        <a href="categories.html">Volver al listado</a> |
        <a href="products.html">${product.category}</a> >
        <span>${product.name}</span>
      </nav>

      <div class="row mt-3">
        <div class="col-md-6 d-flex">
          <div class="thumb-container me-3" style="max-width: 7rem;">
            ${product.images.map(img => `<img src="${img}" class="thumb-img" alt="">`).join("")}
          </div>
          <div class="flex-grow-1">
            <img src="${product.images[0]}" class="main-img" id="main-image" alt="${product.name}">
          </div>
        </div>

        <div class="col-md-6">
          <div class="text-muted mb-2">${product.soldCount} vendidos</div>
          <h3>${product.name}</h3>
          <div class="price">${product.cost} ${product.currency}</div>
          <p class="text-muted">${product.description}</p>
          <button class="btn btn-primary me-2">Preguntar</button>
          <button class="btn btn-success">Agregar al carrito</button>
        </div>
      </div>

      <div class="mt-5">
        <h4>Descripción</h4>
        <p>${product.description}</p>
      </div>
    `;

    const mainImage = document.getElementById("main-image");
    document.querySelectorAll(".thumb-img").forEach(thumb => {
      thumb.addEventListener("click", () => {
        mainImage.src = thumb.src;
      });
    });
  }

  // Render productos relacionados
  function renderRelated(related) {
    container.insertAdjacentHTML("beforeend", `
      <div class="mt-5">
        <h4>Productos relacionados</h4>
        <div class="row g-2">
          ${related.map(prod => `
            <div class="col-4">
              <div onclick="setProductID(${prod.id})" class="card car-card">
                <img src="${prod.image}" class="card-img-top" alt="${prod.name}">
                <div class="card-body p-2">
                  <p class="small mb-0">${prod.name}</p>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `);
  }

  // 👉 Función para agregar formulario de reseña
  function addReviewForm(parent) {
    const formSection = document.createElement("section");
    formSection.className = "mt-4";
    formSection.innerHTML = `
      <h4>Deja tu calificación</h4>
      <form id="review-form">
        <div class="mb-3">
          <label for="rating" class="form-label">Calificación:</label>
          <select id="rating" class="form-select">
            <option value="1">1 estrella</option>
            <option value="2">2 estrellas</option>
            <option value="3">3 estrellas</option>
            <option value="4">4 estrellas</option>
            <option value="5">5 estrellas</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="comment" class="form-label">Comentario:</label>
          <textarea id="comment" class="form-control" rows="3"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Enviar</button>
      </form>
    `;

    parent.insertAdjacentElement("afterend", formSection);

    // Lógica del desafío: agregar reseña al listado
    const form = formSection.querySelector("#review-form");
    form.addEventListener("submit", function(e) {
      e.preventDefault();

      const rating = parseInt(document.getElementById("rating").value);
      const comment = document.getElementById("comment").value;
      const now = new Date().toISOString().slice(0,16).replace("T"," ");
      const user = localStorage.getItem("usuarioLogueado") || "Usuario demo";

      const newComment = document.createElement("div");
      newComment.className = "border rounded p-3 mb-3 bg-white";
      newComment.innerHTML = `
        <div class="d-flex justify-content-between">
          <strong>${user}</strong>
          <span class="text-muted">${now}</span>
        </div>
        <div class="text-warning">${"★".repeat(rating)}${"☆".repeat(5 - rating)}</div>
        <p>${comment}</p>
      `;

      parent.appendChild(newComment);
      form.reset();
    });
  }
});

// Cambiar producto desde relacionados
function setProductID(productid) {
  localStorage.setItem("productID", productid);
  window.location = "product-info.html";
}
