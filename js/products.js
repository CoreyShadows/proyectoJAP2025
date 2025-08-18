document.addEventListener("DOMContentLoaded", function() {
    const usuario = localStorage.getItem("usuarioLogueado");

    if (!usuario) {
        // No hay sesión → al login
        window.location.href = "login.html";
    }
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".Main-1");

  fetch("https://japceibal.github.io/emercado-api/cats_products/101.json")
    .then(response => {
      if (!response.ok) throw new Error("Error al cargar el JSON");
      return response.json();
    })
    .then(data => {
      container.innerHTML = "";

      data.products.forEach(product => {
        const objDiv = document.createElement("div");
        objDiv.classList.add("objeto");

        objDiv.innerHTML = `
          <img src="${product.image}" class="imgproducto" alt="${product.name}" />
          <div class="datos">
              <div>
                  <h2>${product.name}</h2>
                  <p class="descripcion">${product.description}</p>
              </div>
              <div class="infoventa">
                  <p>Ventas: ${product.soldCount}</p>
                  <h3>${product.cost} ${product.currency}</h3>
              </div>
          </div>
        `;

        container.appendChild(objDiv);
      });
    })
    .catch(error => {
      console.error("Error:", error);
      container.innerHTML = "<p>No se pudo cargar la lista de productos.</p>";
    });
});
