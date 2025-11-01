document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const productosCarrito = JSON.parse(localStorage.getItem("productosCarrito"));

  if (!productosCarrito || productosCarrito.length === 0) {
    cartContainer.innerHTML = '<p class="text-center mt-4 text-muted">No hay productos en el carrito</p>';
    return;
  }

  productosCarrito.forEach((producto, index) => {
    const productElement = document.createElement("div");
    productElement.classList.add(
      "cart-item", "d-flex", "flex-row", "align-items-center",
      "justify-content-between", "flex-nowrap", "gap-3", "p-2", "border-bottom"
    );

    const subtotal = producto.costo * producto.cantidad;

    productElement.innerHTML = `
    <button class="btn btn-sm btn-danger flex-shrink-0"
            onclick="removeFromCart(${index})">&times;</button>
    <img src="${producto.imagen}" alt="${producto.nombre}" class="img-thumbnail flex-shrink-0" style="width:80px; height:80px; object-fit:cover;">
      <p class="m-0 flex-shrink-0 text-truncate" style="min-width:100px;">${producto.nombre}</p>
      <p class="m-0 flex-shrink-0 text-truncate" style="min-width:80px;">${producto.costo}</p>
      <p class="m-0 flex-shrink-0 text-truncate" style="min-width:60px;">${producto.moneda}</p>
      <input id="cant-${index}" class="form-control text-center flex-shrink-0"
             type="number" value="${producto.cantidad}" min="1" style="width:80px;">
      <p id="sub-${index}" class="m-0 flex-shrink-0 text-truncate" style="min-width:90px;">
        total: ${subtotal} ${producto.moneda}
      </p>
    `;
    cartContainer.appendChild(productElement);

    // Evento para actualizar subtotal dinámicamente
    const cantidadInput = document.getElementById(`cant-${index}`);
    const subtotalElem = document.getElementById(`sub-${index}`);

    cantidadInput.addEventListener("input", () => {
      const nuevaCantidad = parseInt(cantidadInput.value);
      if (nuevaCantidad < 1) return;

      producto.cantidad = nuevaCantidad;
      subtotalElem.textContent = `Subtotal: ${producto.costo * nuevaCantidad} ${producto.moneda}`;

      // Actualizar localStorage
      localStorage.setItem("productosCarrito", JSON.stringify(productosCarrito));
    });
  });
});

function removeFromCart(index) {
  const productosCarrito = JSON.parse(localStorage.getItem("productosCarrito"));
  productosCarrito.splice(index, 1);
  localStorage.setItem("productosCarrito", JSON.stringify(productosCarrito));
  location.reload();
}  

