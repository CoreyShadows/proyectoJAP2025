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

    const cantidadInput = document.getElementById(`cant-${index}`);
    const subtotalElem = document.getElementById(`sub-${index}`);

    cantidadInput.addEventListener("input", () => {
      const nuevaCantidad = parseInt(cantidadInput.value);
      if (isNaN(nuevaCantidad) || nuevaCantidad < 1) return;

      producto.cantidad = nuevaCantidad;
      subtotalElem.textContent = `Subtotal: ${Number(producto.costo) * nuevaCantidad} ${producto.moneda}`;

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
  location.reload();
}

// Función que calcula y muestra el total del carrito
function updateTotal() {
  const productos = JSON.parse(localStorage.getItem("productosCarrito")) || [];
  const total = productos.reduce((sum, p) => sum + (Number(p.costo) * Number(p.cantidad)), 0);
  const moneda = productos.length ? (productos[0].moneda || '') : '';
  const totalElem = document.getElementById('cart-total-amount');
  if (totalElem) {
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

   let envioSeleccionado = document.querySelector('input[name="envio"]:checked');
  if (envioSeleccionado) {
    let porcentaje = parseFloat(envioSeleccionado.value);
    let costoEnvio = subtotal * porcentaje;
    let total = subtotal + costoEnvio;

    document.getElementById("envioCost").textContent = "$" + costoEnvio.toFixed(2);
    document.getElementById("totalCost").textContent = "$" + total.toFixed(2);
    document.getElementById("totalPaso4").textContent = "$" + total.toFixed(2);
  }
}

Subtotal();

document.getElementById("btnSiguiente1").addEventListener("click", function () {
  document.getElementById("paso1").classList.add("d-none");
  document.getElementById("paso2").classList.remove("d-none");
});


document.getElementById("btnSiguiente2").addEventListener("click", (event) => {
  const envioSeleccionado = document.querySelector('input[name="envio"]:checked');
  if (!envioSeleccionado) {
    alerta("Por favor selecciona un método de envío.");
    return;
  }
  event.preventDefault(); 
  document.getElementById("paso2").classList.add("d-none");
  document.getElementById("paso3").classList.remove("d-none");
});
document.getElementById("btnSiguiente3").addEventListener("click", (event) => {
  event.preventDefault(); 
    
  const departamento = document.getElementById("departamento").value.trim();
  const localidad = document.getElementById("localidad").value.trim();
  const calle = document.getElementById("calle").value.trim();
  const numero = document.getElementById("numero").value.trim();
  const esquina = document.getElementById("esquina").value.trim();

  if (!departamento || !localidad || !calle || !numero || !esquina) {
    alerta("Por favor complete todos los campos de dirección.");
    return;
  }

  document.getElementById("paso3").classList.add("d-none");
  document.getElementById("paso4").classList.remove("d-none");
});

const metodoPagoSelect = document.getElementById("metodoPago");
const pagoTarjeta = document.getElementById("pagoTarjeta");
const transferenciaCampos = document.getElementById("transferenciaCampos");

metodoPagoSelect.addEventListener("change", () => {
  const metodo = metodoPagoSelect.value;

  if (metodo === "tarjeta") {
    pagoTarjeta.classList.remove("d-none");
    transferenciaCampos.classList.add("d-none");
  } 
  else if (metodo === "banco") {
    pagoTarjeta.classList.add("d-none");
    transferenciaCampos.classList.remove("d-none");
  } 
  else {
    pagoTarjeta.classList.add("d-none");
    transferenciaCampos.classList.add("d-none");
  }
});

document.getElementById("btnSiguiente4").addEventListener("click", () => {
  const metodo = metodoPagoSelect.value;

  if (!metodo) {
    alerta("Por favor selecciona una forma de pago.");
    return;
  }

  if (metodo === "tarjeta") {
    const nombreTarjeta = document.getElementById("nombreTarjeta").value.trim();
    const NumeroTarjeta= document.getElementById("numeroTarjeta").value.trim();
    const CodigoSeguridad = document.getElementById("codigoSeguridad").value.trim();
    const expMes = document.getElementById("expMes").value.trim();
    const expAnio = document.getElementById("expAnio").value.trim();
    
    if (!nombreTarjeta || !NumeroTarjeta || !CodigoSeguridad || !expMes || !expAnio) {
      alerta("Completa todos los datos de la tarjeta.");
      return;
    }
  }

  if (metodo === "banco") {
    const numeroCuenta = document.getElementById("numeroCuenta").value.trim();
    const nombreTitular = document.getElementById("nombreTitular").value.trim();
    const bancoEntidad = document.getElementById("bancoEntidad").value.trim();
    const numeroMovil = document.getElementById("numeroMovil").value.trim();
    
    if (!numeroCuenta || !nombreTitular || !bancoEntidad || !numeroMovil) {
      alerta("Completa todos los datos de la transferencia bancaria.");
      return;
    }
  }
  document.getElementById("paso4").classList.add("d-none");
  document.getElementById("paso5").classList.remove("d-none");
});

document.getElementById("btnFinalizar").addEventListener("click", () => {
  const subtotal = document.getElementById("subtotalPaso1").textContent;
  const envioSeleccionado = document.querySelector('input[name="envio"]:checked');
  const metodoPago = document.getElementById("metodoPago").value;
  if (subtotal === "$0" || subtotal === "Subtotal: $0") {
    alerta("El carrito está vacío. Agrega productos antes de finalizar la compra.");
    return;
  }
  if (!envioSeleccionado) {
    alerta("Por favor selecciona un método de envío.");
    return;
  }
  if (!metodoPago) {
    alerta("Por favor selecciona una forma de pago.");
    return;
  } 
Swal.fire({
  toast: true,
  position: "top-end",
  icon: "success",
  title: "¡Compra realizada con éxito!",
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
}).then(() => {
  localStorage.removeItem("productosCarrito");
  window.location.href = "index.html";
});
});

// Calcular costo de envío
document.querySelectorAll('input[name="envio"]').forEach(radio => {
  radio.addEventListener("change", function () {
    let porcentaje = parseFloat(this.value);
    let costoEnvio = subtotal * porcentaje;
    let total = subtotal + costoEnvio;

    document.getElementById("envioCost").textContent = "$" + costoEnvio.toFixed(2);
    document.getElementById("totalCost").textContent = "$" + total.toFixed(2);
    document.getElementById("totalPaso4").textContent = "$" + total.toFixed(2);
    let labelElegido = document.querySelector('label[for="' + this.id + '"]').textContent;
    document.getElementById("envioElegido").textContent = labelElegido;
    tipoEnvio = labelElegido;
  });
});

document.getElementById("btnSiguiente2").addEventListener("click", function () {


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

document.getElementById("btnVolver2").addEventListener("click", function () {
  document.getElementById("paso3").classList.add("d-none");
  document.getElementById("paso2").classList.remove("d-none");
});

document.getElementById("btnVolver3").addEventListener("click", function () {
  document.getElementById("paso4").classList.add("d-none");
  document.getElementById("paso3").classList.remove("d-none");
});

// Costos
document.getElementById("btnSiguiente4").addEventListener("click", function () {
  document.getElementById("subtotalFinal").textContent = document.getElementById("subtotalPaso2").textContent.replace("Subtotal: ", "");
  document.getElementById("costoEnvioFinal").textContent = document.getElementById("envioCost").textContent;
  document.getElementById("totalFinal").textContent = document.getElementById("totalCost").textContent;
  document.getElementById("totalPaso4").textContent = document.getElementById("totalCost").textContent;

  let envioSeleccionado = document.querySelector('input[name="envio"]:checked');
  if (envioSeleccionado) {
    document.getElementById("envioElegido").textContent = tipoEnvio;
  }
  const localidad = document.getElementById("localidad").value;
  const calle = document.getElementById("calle").value;
  const numero = document.getElementById("numero").value;
  let direccion = document.getElementById("direccionFinal").textContent =
    localidad + "  " + calle + ", " + numero;
  document.getElementById("direccionFinal").textContent = direccion;

  let formaPago = document.getElementById("metodoPago").value === "tarjeta" ? "Tarjeta de crédito" : "Transferencia bancaria";
  document.getElementById("formaPagoFinal").textContent = formaPago;
});

document.getElementById("btnVolver4").addEventListener("click", function () {
  document.getElementById("paso5").classList.add("d-none");
  document.getElementById("paso4").classList.remove("d-none");
});


function alerta(mensaje) {
  Swal.fire({
    icon: "warning",
    title: "Atención",
    text: mensaje,
    confirmButtonColor: "#25ad6eff",
  });
}

