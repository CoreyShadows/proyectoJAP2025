document.addEventListener("DOMContentLoaded", () => {
  const nombreUsuario = document.getElementById("nombre_usuario");
  const usuario = localStorage.getItem("usuarioLogueado");
  if (usuario) nombreUsuario.textContent = usuario;

  const container = document.getElementById("main");
  const commentsSection = document.getElementById("comments-section");
  const productID = localStorage.getItem("productID");

  if (!productID) {
    container.innerHTML = "<p class='text-danger'>No se seleccionó ningún producto.</p>";
    return;
  }

  const productURL = `https://japceibal.github.io/emercado-api/products/${productID}.json`;
  const commentsURL = `https://japceibal.github.io/emercado-api/products_comments/${productID}.json`;

  fetch(productURL)
    .then(res => res.json())
    .then(product => {
      renderProduct(product);
      renderRelated(product.relatedProducts);
    });

  fetch(commentsURL)
    .then(res => res.json())
    .then(comments => {
      renderComments(comments);
      renderCommentForm();
    })
    .catch(error => {
      console.error("Error al cargar comentarios:", error);
      commentsSection.innerHTML = "<p class='text-danger'>No se pudieron cargar los comentarios.</p>";
    });

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

  function renderComments(comments) {
    commentsSection.innerHTML = `<h4>Calificaciones de usuarios</h4>`;
    comments.forEach(c => {
      commentsSection.innerHTML += `
        <div class="border rounded p-3 mb-3 bg-white">
          <div class="d-flex justify-content-between">
            <strong>${c.user}</strong>
            <span class="text-muted">${c.dateTime}</span>
          </div>
          <div class="text-warning">${"★".repeat(c.score)}${"☆".repeat(5 - c.score)}</div>
          <p>${c.description}</p>
        </div>
      `;
    });
  }

  function renderCommentForm() {
    commentsSection.insertAdjacentHTML("beforeend", `
      <div class="mt-4 bg-white p-4 rounded">
        <h5>Agregar una calificación</h5>
        <form id="commentForm">
          <textarea id="commentText" class="form-control mb-2" rows="3" placeholder="Escribí tu comentario" required></textarea>
          <div class="mb-2">
            <label class="form-label">Puntuación</label>
            <div id="starRating" class="d-flex gap-1 fs-4 text-warning">
              ${[1,2,3,4,5].map(i => `<span class="star" data-score="${i}">☆</span>`).join("")}
            </div>
          </div>
          <button type="submit" class="btn btn-success">Enviar</button>
        </form>
      </div>
    `);

    let selectedScore = 0;
    const stars = document.querySelectorAll(".star");
    stars.forEach(star => {
      star.addEventListener("click", () => {
        selectedScore = parseInt(star.dataset.score);
        stars.forEach(s => {
          s.textContent = parseInt(s.dataset.score) <= selectedScore ? "★" : "☆";
        });
      });
    });

    document.getElementById("commentForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const text = document.getElementById("commentText").value;
      const user = localStorage.getItem("usuarioLogueado") || "Anónimo";
      const date = new Date().toISOString().slice(0, 19).replace("T", " ");

      if (selectedScore === 0) {
        alert("Seleccioná una puntuación antes de enviar.");
        return;
      }

      const newComment = {
        user,
        dateTime: date,
        description: text,
        score: selectedScore
      };

      const commentHTML = `
        <div class="border rounded p-3 mb-3 bg-white">
          <div class="d-flex justify-content-between">
            <strong>${newComment.user}</strong>
            <span class="text-muted">${newComment.dateTime}</span>
          </div>
          <div class="text-warning">${"★".repeat(newComment.score)}${"☆".repeat(5 - newComment.score)}</div>
          <p>${newComment.description}</p>
        </div>
      `;
      commentsSection.insertAdjacentHTML("afterbegin", commentHTML);
      this.reset();
      selectedScore = 0;
      stars.forEach(s => s.textContent = "☆");
      parent.appendChild(newComment);
      form.reset();

        // Mostrar push up (toast)
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.textContent = "¡Comentario enviado con éxito!";
    document.body.appendChild(toast);

    // Estilos del push up
    const style = document.createElement("style");
    style.textContent = `
      .toast {
        visibility: hidden;
        min-width: 250px;
        background-color: #ff6600;
        color: white;
        text-align: center;
        border-radius: 10px;
        padding: 16px;
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.5s, bottom 0.5s;
        font-weight: bold;
      }
      .toast.show {
        visibility: visible;
        opacity: 1;
        bottom: 50px;
      }
    `;
    document.head.appendChild(style);
  }

  // Mostrar el mensaje
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);

    });
  }
});

function setProductID(productid) {
  localStorage.setItem("productID", productid);
  window.location = "product-info.html";
}
