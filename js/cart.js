document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cart-container"); 
    const productosCarrito = localStorage.getItem("productosCarrito");

    if (!productosCarrito) {
        cartContainer.innerHTML = '<p>No hay productos en el carrito</p>';
    } else {
        const productos = JSON.parse(productosCarrito);

        productos.forEach(producto => {
            const productElement = document.createElement('div');
            productElement.classList.add(
                'cart-item', 'd-flex', 'flex-row', 'align-items-center', 
                'justify-content-between', 'flex-nowrap', 'gap-3', 'p-2', 'border-bottom'
            );
            productElement.innerHTML = `
                <p class="m-0 flex-shrink-0 text-truncate" style="min-width:100px;">${producto.nombre}</p>
                <p class="m-0 flex-shrink-0 text-truncate" style="min-width:80px;">${producto.costo}</p>
                <p class="m-0 flex-shrink-0 text-truncate" style="min-width:60px;">${producto.moneda}</p>
                <input class="m-0 flex-shrink-0 text-truncate form-control" 
                       type="number" value="${producto.cantidad}" min="1" style="width:80px;">
                <p class="m-0 flex-shrink-0 text-truncate" style="min-width:90px;">Subtotal: ${producto.subtotal}</p>
            `;

            cartContainer.appendChild(productElement);
        });
    }
});