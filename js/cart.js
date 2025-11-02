document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const productosCarrito = JSON.parse(localStorage.getItem("productosCarrito"));

  if (!productosCarrito || productosCarrito.length === 0) {
    cartContainer.innerHTML = '<p class="text-center mt-4 text-muted">No hay productos en el carrito</p>';
    const summary = document.getElementById('cart-summary');
    if (summary) summary.style.display = 'none';
    return;
  }

  productosCarrito.forEach((producto, index) => {
    const productElement = document.createElement("div");
    productElement.classList.add(
      "cart-item", "d-flex", "flex-row", "align-items-center",
      "justify-content-between", "flex-nowrap", "gap-3", "p-2", "border-bottom"
    );

    const subtotal = Number(producto.costo) * Number(producto.cantidad);

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

    // Modificar el evento input para actualizar también el badge y el total
    cantidadInput.addEventListener("input", () => {
      const nuevaCantidad = parseInt(cantidadInput.value);
      if (isNaN(nuevaCantidad) || nuevaCantidad < 1) return;

      producto.cantidad = nuevaCantidad;
      subtotalElem.textContent = `Subtotal: ${Number(producto.costo) * nuevaCantidad} ${producto.moneda}`;

      // Actualizar localStorage y badge
      localStorage.setItem("productosCarrito", JSON.stringify(productosCarrito));
      if (typeof updateCartBadge === 'function') updateCartBadge();
      updateTotal();
    });
  });
});

function removeFromCart(index) {
  const productosCarrito = JSON.parse(localStorage.getItem("productosCarrito"));
  productosCarrito.splice(index, 1);
  localStorage.setItem("productosCarrito", JSON.stringify(productosCarrito));
  location.reload();
}  



  // calcular total inicial
  updateTotal();


// Agregar función para eliminar productos
function removeProduct(index) {
  const productosCarrito = JSON.parse(localStorage.getItem("productosCarrito")) || [];
  productosCarrito.splice(index, 1);
  localStorage.setItem("productosCarrito", JSON.stringify(productosCarrito));
  if (typeof updateCartBadge === 'function') updateCartBadge();
  // recargar para re-renderizar la lista (puedes cambiar por re-render sin recarga)
  location.reload();
}

// Función que calcula y muestra el total del carrito
function updateTotal() {
  const productos = JSON.parse(localStorage.getItem("productosCarrito")) || [];
  const total = productos.reduce((sum, p) => sum + (Number(p.costo) * Number(p.cantidad)), 0);
  const moneda = productos.length ? (productos[0].moneda || '') : '';
  const totalElem = document.getElementById('cart-total-amount');
  if (totalElem) {
    // Mostrar sin decimales si es entero, o con 2 decimales si tiene decimales
    const displayTotal = Number.isInteger(total) ? total : total.toFixed(2);
    totalElem.textContent = moneda ? `${displayTotal} ${moneda}` : displayTotal;
  }
}