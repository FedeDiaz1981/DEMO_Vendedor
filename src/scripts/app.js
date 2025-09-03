import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/+esm";
import { animate, stagger } from "motion";
import { addToCart, loadCart, cartTotal, removeFromCart, clearCart } from "../utils/cart.js";
import { buildOrderText, buildWhatsAppUrl } from "../utils/whatsapp.js";
import data from "../data/products.json";

// Animación de las cards
const cards = document.querySelectorAll("[data-open-modal]");
animate(cards, { opacity: [0, 1], transform: ["translateY(12px)", "translateY(0)"] }, { delay: stagger(0.06), duration: 0.5, easing: "ease-out" });

// Modal state
const modal = document.getElementById("productModal");
const mImg = document.getElementById("modalImg");
const mName = document.getElementById("modalName");
const mDesc = document.getElementById("modalDesc");
const mSize = document.getElementById("modalSize");
const mColor = document.getElementById("modalColor");
const mQty = document.getElementById("modalQty");
const addBtn = document.getElementById("addToCart");
const closeModal = document.getElementById("closeModal");
let current;

function openModal(product) {
    current = product;
    mImg.src = product.img;
    mName.textContent = product.nombre;
    mDesc.textContent = product.descripcion;
    mSize.innerHTML = product.tallesDisponibles
        .map((t) => `<option>${t}</option>`)
        .join("");
    mColor.innerHTML = product.colores
        .map((c) => `<option>${c}</option>`)
        .join("");
    mQty.value = 1;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    animate(
        "#productModal .card",
        { opacity: [0, 1], scale: [0.96, 1] },
        { duration: 0.25, easing: "ease-out" }
    );
}
function hideModal() {
    animate(
        "#productModal .card",
        { opacity: [1, 0], scale: [1, 0.96] },
        { duration: 0.2 }
    ).finished.then(() => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    });
}
closeModal?.addEventListener("click", hideModal);
modal?.addEventListener("click", (e) => {
    if (e.target === modal) hideModal();
});

document.querySelectorAll("[data-open-modal]").forEach((el) => {
    el.addEventListener("click", () => {
        const id = el.getAttribute("data-id");
        const p = data.find((x) => x.id === id);
        openModal(p);
    });
});

// Add to cart
addBtn?.addEventListener("click", () => {
    if (!current) return;
    const size = mSize.value;
    const color = mColor.value;
    const qty = Math.max(1, parseInt(mQty.value || "1", 10));
    addToCart({
        id: current.id,
        name: current.nombre,
        price: current.precio,
        size,
        color,
        qty,
    });
    hideModal();
});

// Cart drawer
const drawer = document.getElementById("cartDrawer");
const openCart = document.getElementById("openCart");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotalTop = document.getElementById("cartTotal");
const cartTotalBottom = document.getElementById("cartTotalBottom");
const clearBtn = document.getElementById("clearCart");
const confirmBtn = document.getElementById("confirmWhatsapp");
const clientName = document.getElementById("clientName");

function renderCart() {
    const items = loadCart();
    cartItems.innerHTML = items
        .map(
            (i) => `
          <div class="flex items-start justify-between gap-3 p-3 border rounded-xl">
            <div>
              <div class="font-medium">${i.name} <span class="text-gray-500">(${i.id})</span></div>
              <div class="text-sm text-gray-600">Talle: ${i.size} · Color: ${i.color} · Cant: ${i.qty}</div>
            </div>
            <div class="text-right">
              <button data-remove="${i.id}-${i.size}-${i.color}" class="text-sm text-red-600">Quitar</button>
            </div>
          </div>
        `
        )
        .join("");
    const total = cartTotal(items);
    cartTotalTop.textContent = "$" + total;
    cartTotalBottom.textContent = "$" + total;

    cartItems.querySelectorAll("[data-remove]").forEach((btn) => {
        btn.addEventListener("click", () => {
            removeFromCart(btn.getAttribute("data-remove"));
        });
    });
}

addEventListener("cart:updated", renderCart);

openCart?.addEventListener("click", () => {
    renderCart();
    drawer.classList.remove("translate-x-full");
});
closeCart?.addEventListener("click", () =>
    drawer.classList.add("translate-x-full")
);
clearBtn?.addEventListener("click", () => clearCart());

confirmBtn?.addEventListener("click", () => {
    const items = loadCart();
    if (!items.length) return alert("Tu carrito está vacío.");
    const text = buildOrderText("Lorena", items, clientName.value.trim());
    const url = buildWhatsAppUrl("5491162851665", text); // <-- reemplazar por número real
    window.open(url, "_blank");
});

// Search (Fuse.js)
const fuse = new Fuse(data, {
    keys: ["nombre", "descripcion", "id", "colores"],
    threshold: 0.4,
});
const input = document.getElementById("searchInput");
const grid = document.getElementById("grid");
input?.addEventListener("input", () => {
    const q = input.value.trim();
    let results = data;
    if (q.length > 0) results = fuse.search(q).map((r) => r.item);
    grid.innerHTML = results
        .map(
            (p) => `
          <article class="card overflow-hidden cursor-pointer group" data-open-modal data-id="${p.id}">
            <img src="${p.img}" alt="${p.nombre}" class="aspect-square w-full object-cover" loading="lazy" />
            <div class="p-4">
              <h3 class="font-semibold group-hover:text-sky-600 transition-colors">${p.nombre}</h3>
              <p class="text-sm text-gray-500">${p.descripcion}</p>
              
            </div>
          </article>
        `
        )
        .join("");
    // rebind open modal + animate
    grid.querySelectorAll("[data-open-modal]").forEach((el) => {
        el.addEventListener("click", () => {
            const id = el.getAttribute("data-id");
            const p = data.find((x) => x.id === id);
            openModal(p);
        });
    });
    const cards = grid.querySelectorAll("[data-open-modal]");
    animate(
        cards,
        { opacity: [0, 1], transform: ["translateY(12px)", "translateY(0)"] },
        { delay: stagger(0.04), duration: 0.4, easing: "ease-out" }
    );
});

// initial render cart total
renderCart();
