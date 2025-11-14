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
      Subtotal();
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


function Subtotal() {
  let productosCarrito = JSON.parse(localStorage.getItem("productosCarrito")) || [];
  subtotal = 0;
  productosCarrito.forEach(producto => {
    subtotal += Number(producto.costo) * Number(producto.cantidad);
  });
  document.getElementById("subtotalPaso1").textContent = "Subtotal: $" + subtotal;
  document.getElementById("subtotalPaso2").textContent = "Subtotal: $" + subtotal;

}
Subtotal();
document.getElementById("btnSiguiente1").addEventListener("click", function () {
  document.getElementById("paso1").classList.add("d-none");
  document.getElementById("paso2").classList.remove("d-none");
});



// Calcular costo de envío
document.querySelectorAll('input[name="envio"]').forEach(radio => {
  radio.addEventListener("change", function () {
    let porcentaje = parseFloat(this.value);
    let costoEnvio = subtotal * porcentaje;
    let total = subtotal + costoEnvio;

    document.getElementById("envioCost").textContent = "$" + costoEnvio.toFixed(2);
    document.getElementById("totalCost").textContent = "$" + total.toFixed(2);
  });
});

document.getElementById("btnSiguiente2").addEventListener("click", function () {
  document.getElementById("paso2").classList.add("d-none");
  document.getElementById("paso3").classList.remove("d-none");

  document.getElementById("subtotalPaso3").textContent =
    document.getElementById("subtotalPaso2").textContent.replace("Subtotal: ", "");
  document.getElementById("envioPaso3").textContent =
    document.getElementById("envioCost").textContent;
  document.getElementById("totalPaso3").textContent =
    document.getElementById("totalCost").textContent;
});

// Boton de volver
document.getElementById("btnVolver1").addEventListener("click", function () {
  document.getElementById("paso2").classList.add("d-none");
  document.getElementById("paso1").classList.remove("d-none");
});

// Boton de volver
document.getElementById("btnVolver2").addEventListener("click", function () {
  document.getElementById("paso3").classList.add("d-none");
  document.getElementById("paso2").classList.remove("d-none");
});

document.getElementById("btnSiguiente3").addEventListener("click", function () {
  document.getElementById("paso3").classList.add("d-none");
  document.getElementById("paso4").classList.remove("d-none");

  document.getElementById("totalPaso4").textContent =
    document.getElementById("totalPaso3").textContent;
});

// Boton de volver
document.getElementById("btnVolver3").addEventListener("click", function () {
  document.getElementById("paso4").classList.add("d-none");
  document.getElementById("paso3").classList.remove("d-none");
});

// Mostrar campos según método de pago 
document.getElementById("metodoPago").addEventListener("change", function () {
  const tarjeta = document.getElementById("pagoTarjeta");
  const banco = document.getElementById("transferenciaCampos");

  tarjeta.classList.add("d-none");
  banco.classList.add("d-none");

  if (this.value === "tarjeta") {
    tarjeta.classList.remove("d-none");
  } else if (this.value === "banco") {
    banco.classList.remove("d-none");
  }
});
// Costos
document.getElementById("btnSiguiente4").addEventListener("click", function () {
  // Ocultar forma de pago, mostrar costos
  document.getElementById("paso4").classList.add("d-none");
  document.getElementById("paso5").classList.remove("d-none");

  // Mostrar resumen final
  document.getElementById("subtotalFinal").textContent = document.getElementById("subtotalPaso2").textContent.replace("Subtotal: ", "");
  document.getElementById("costoEnvioFinal").textContent = document.getElementById("envioCost").textContent;
  document.getElementById("totalFinal").textContent = document.getElementById("totalCost").textContent;

  // Mostrar tipo de envío elegido
  let envioSeleccionado = document.querySelector('input[name="envio"]:checked');
  if (envioSeleccionado) {
    let tipoEnvio = envioSeleccionado.dataset.tipo || "Sin seleccionar";
    document.getElementById("envioElegido").textContent = tipoEnvio;
  }

  // Mostrar dirección
  let direccion = document.getElementById("direccionEnvio")?.value || "No especificada";
  document.getElementById("direccionFinal").textContent = direccion;

  // Mostrar forma de pago
  let formaPago = document.getElementById("metodoPago").value === "tarjeta" ? "Tarjeta de crédito" : "Transferencia bancaria";
  document.getElementById("formaPagoFinal").textContent = formaPago;
});

// Boton de volver a metodo de pago
document.getElementById("btnVolver4").addEventListener("click", function () {
  document.getElementById("paso5").classList.add("d-none");
  document.getElementById("paso4").classList.remove("d-none");
});


document.getElementById("btnSiguiente3").addEventListener("click", (event) => {
    event.preventDefault(); // 👈 IMPORTANTE: evita que el botón avance
    
    const departamento = document.getElementById("departamento").value.trim();
    const localidad = document.getElementById("localidad").value.trim();
    const calle = document.getElementById("calle").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const esquina = document.getElementById("esquina").value.trim();

    if (departamento === "" || localidad === "" || calle === "" || numero === "" || esquina === "") {
        alert("Por favor complete todos los campos de dirección.");
        return; // 👈 se corta acá y NO avanza
    }

    // Si está todo correcto → recién acá avanzás
    document.getElementById("paso3").classList.add("d-none");
    document.getElementById("paso4").classList.remove("d-none");
});


