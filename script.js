// store products
const Products = [
  {
    id: 1,
    name: "Obsidian Wireless Earbuds",
    image: "images/ears.png",
    cat: "Audio",
    price: 99.99,
    desc: "40hr battery, ANC, studio-grade sound.",
    badge: "Sale",
    oldPrice: 199.99,
  },
  {
    id: 2,
    name: "Head Phones",
    image: "images/head phones.png",
    cat: "Audio",
    price: 85,
    desc: "Premium sound with noice cancellation.",
    badge: "",
    oldPrice: 0,
  },
  {
    id: 3,
    name: "Canon Camera",
    image: "images/canon.png",
    cat: "Camera",
    price: 60,
    desc: "capture moments in stunning clarity.",
    badge: "",
    oldPrice: 0,
  },
  {
    id: 4,
    name: "MackBook PC",
    image: "images/mac black.png",
    cat: "Laptop",
    price: 50,
    desc: "High performance laptop for work and Design.",
    badge: "",
    oldPrice: 0,
  },
  {
    id: 5,
    name: "MackBook White",
    image: "images/mac white.png",
    cat: "Laptop",
    price: 50,
    desc: "Sleek design with powerful performance.",
    badge: "",
    oldPrice: 0,
  },
  {
    id: 6,
    name: "Best Speakers",
    image: "images/speakers.png",
    cat: "Audio",
    price: 85,
    desc: "Deep boss and crystal clear sound.",
    badge: "",
    oldPrice: 0,
  },
  // ------------------- NEW PRODUCTS -------------------
  {
    id: 7,
    name: "4K Streaming Webcam",
    image: "images/webcam.jpg",
    cat: "Camera",
    price: 74.99,
    desc: "Crisp 4K video with auto low-light correction.",
    badge: "New",
    oldPrice: 0,
  },
  {
    id: 8,
    name: "Aurora Mechanical Keyboard",
    image: "images/keyboard.jpg",
    cat: "Accessories",
    price: 64.5,
    desc: "Hot-swappable switches with per-key RGB lighting.",
    badge: "",
    oldPrice: 0,
  },
  {
    id: 9,
    name: "Pulse Smart Watch",
    image: "images/smartwatch.png",
    cat: "Accessories",
    price: 129.99,
    desc: "Heart-rate tracking, GPS, and a 10-day battery.",
    badge: "Sale",
    oldPrice: 159.99,
  },
];

// state
let cart = {}; // { id: qty }
let activeFilter = "all";
let searchQuery = "";
let sortMode = "default";

const SHIPPING_FLAT = 5.99;
const FREE_SHIPPING_THRESHOLD = 75;

//----------------------------- FILTER ---------------------------
const getFilteredProducts = () => {
  // list of products
  let list = [...Products];
  if (activeFilter !== "all") list = list.filter((p) => p.cat === activeFilter);

  // filter products by name, description, category, price (matches ANY field)
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.cat.toLowerCase().includes(q) ||
        p.price.toString().includes(q)
    );
  }

  // ----------- sort by Ascending & descending --------------------------
  if (sortMode === "asc") list.sort((a, b) => a.price - b.price); // lowest price first.
  if (sortMode === "desc") list.sort((a, b) => b.price - a.price); // highest price first.
  if (sortMode === "name") list.sort((a, b) => a.name.localeCompare(b.name));

  return list;
};

// Selection of products
const productsGrid = document.querySelector("#productsGrid");

function renderProducts() {
  const list = getFilteredProducts();
  // not found products
  if (!list.length) {
    productsGrid.innerHTML = `<div class="empty"><svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg><br>No products found.</div>`;
    return;
  }

  //---------------------------- display products -------------------------------
  productsGrid.innerHTML = list
    .map(
      (product, index) => `
<div class="card" style="animation-delay: ${Math.min(index * 0.05, 0.4)}s;">

  <!-- image -->
  <div class="card-img">
          <!-- if badge exist show else hide badge -->
          ${product.badge ? `<span class="badge">${product.badge}</span>` : ``}
          <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">
  </div>
  <!-- card body -->
  <div class="card-body">
    <!-- category -->
    <span class="card-cat">${product.cat}</span>
    <!-- card name -->
    <div class="card-name">${product.name}</div>
        <!-- card description -->
        <div class="card-desc">${product.desc}</div>
        <!-- card footer -->
        <div class="card-footer">
            <!-- card price -->
            <div class="card-price">
              ${product.oldPrice > 0 ? `<span class="old">$${product.oldPrice.toFixed(2)}</span>` : ``}$${product.price.toFixed(2)}
            </div>
            <!-- add button -->
            <button class="add-btn" onclick="addToCart(${product.id})" id="addbtn-${product.id}">${cart[product.id] ? "✓ Added" : "+ Add to cart"}</button>
        </div>
    </div>

</div>`
    )
    .join(``);
}

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.cat;
    renderProducts();
  });
});

let searchTimer;
document.querySelector("#searchInput").addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    searchQuery = e.target.value;
    renderProducts();
  }, 300);
});

// ------------------ sortMode --------------------
document.querySelector("#sortSelect").addEventListener("change", (e) => {
  sortMode = e.target.value;
  renderProducts();
});

// ----------------------- Add to cart ----------------------
const addToCart = (id) => {
  const product = Products.find((p) => p.id === id);
  if (!product) return;

  // add to cart products
  cart[id] = (cart[id] || 0) + 1;

  renderProducts();
  showToast(`${product.name} added to the cart`);

  renderCartItems();
  updateCartCount();
  updateTotals();
};

// ----------------------- Change quantity ----------------------
const changeQty = (id, delta) => {
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) {
    delete cart[id];
  }
  renderProducts();
  renderCartItems();
  updateCartCount();
  updateTotals();
};

// ----------------------- Remove from cart ----------------------
const removeFromCart = (id) => {
  const product = Products.find((p) => p.id === id);
  delete cart[id];
  renderProducts();
  renderCartItems();
  updateCartCount();
  updateTotals();
  if (product) showToast(`${product.name} removed from cart`);
};

// ---------------- TOAST --------------------------
let toastTimer;

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");

//--------------- open and close drawer ------------------------
function OpenDrawer() {
  drawer.classList.add("open");
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}
function CloseDrawer() {
  drawer.classList.remove("open");
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}

//--------------------------- Render cart items ---------------------------
const renderCartItems = () => {
  const itemsOfCart = document.getElementById("cartItems");
  const items = Object.entries(cart);
  if (!items.length) {
    // shopping bag icon
    itemsOfCart.innerHTML = `<div class="cart-empty"><svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg><br>Your cart is empty.</div>`;
    return;
  }
  itemsOfCart.innerHTML = items
    .map(([id, qty]) => {
      const p = Products.find((p) => p.id == id);
      if (!p) return "";
      return `<div class="cart-item">
<div class="cart-item-icon">
${p.image ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'">` : `<div class="no-img">No image</div>`}
</div>
<div class="cart-item-info">
<div class="cart-item-name">${p.name}</div>
<div class="cart-item-price">$${(p.price * qty).toFixed(2)}</div>
</div>
<div class="qty-controls">
    <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>
    <span class="qty-num">${qty}</span>
    <button class="qty-btn" onclick="changeQty(${p.id}, 1)">+</button>
</div>
<button class="remove-btn" onclick="removeFromCart(${p.id})" title="Remove">✕</button>
</div>`;
    })
    .join("");
};

//--------------------------- Cart count badge ---------------------------
function updateCartCount() {
  const count = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  document.querySelector(".cart-count").textContent = count;
}

//--------------------------- Totals + checkout enable/disable ---------------------------
function getSubtotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = Products.find((p) => p.id == id);
    return p ? sum + p.price * qty : sum;
  }, 0);
}

function updateTotals() {
  const subtotal = getSubtotal();
  const hasItems = subtotal > 0;
  const shipping = !hasItems ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("shipping").textContent = !hasItems
    ? "Free"
    : shipping === 0
    ? "Free"
    : `$${shipping.toFixed(2)}`;
  document.getElementById("total").textContent = `$${total.toFixed(2)}`;

  const checkoutBtn = document.getElementById("checkoutBtn");
  checkoutBtn.disabled = !hasItems;
}

// ===========================================================
//                       CHECKOUT FLOW
// ===========================================================

const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const checkoutOverlay = document.getElementById("checkoutOverlay");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutStepPay = document.getElementById("checkoutStepPay");
const checkoutStepSuccess = document.getElementById("checkoutStepSuccess");
const checkoutSummaryItems = document.getElementById("checkoutSummaryItems");
const checkoutSummaryTotal = document.getElementById("checkoutSummaryTotal");
const payNowBtn = document.getElementById("payNowBtn");
const closeCheckoutBtn = document.getElementById("closeCheckoutBtn");
const continueShoppingBtn = document.getElementById("continueShoppingBtn");
const orderNumberEl = document.getElementById("orderNumber");

checkoutBtn.addEventListener("click", () => {
  if (checkoutBtn.disabled) return;
  openCheckout();
});

function openCheckout() {
  // build order summary
  const items = Object.entries(cart);
  checkoutSummaryItems.innerHTML = items
    .map(([id, qty]) => {
      const p = Products.find((p) => p.id == id);
      if (!p) return "";
      return `<div class="summary-row"><span>${p.name} × ${qty}</span><span>$${(p.price * qty).toFixed(2)}</span></div>`;
    })
    .join("");
  checkoutSummaryTotal.textContent = document.getElementById("total").textContent;

  // reset to step 1
  checkoutStepPay.classList.remove("hidden");
  checkoutStepSuccess.classList.add("hidden");
  payNowBtn.disabled = false;
  payNowBtn.textContent = "Pay Now";

  CloseDrawer();
  checkoutModal.classList.add("open");
  checkoutOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCheckout() {
  checkoutModal.classList.remove("open");
  checkoutOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

closeCheckoutBtn.addEventListener("click", closeCheckout);
checkoutOverlay.addEventListener("click", closeCheckout);

// -------- simple input formatting helpers --------
const cardNumberInput = document.getElementById("cardNumber");
if (cardNumberInput) {
  cardNumberInput.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 16);
    e.target.value = v.replace(/(.{4})/g, "$1 ").trim();
  });
}
const cardExpiryInput = document.getElementById("cardExpiry");
if (cardExpiryInput) {
  cardExpiryInput.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
    e.target.value = v;
  });
}
const cardCvvInput = document.getElementById("cardCvv");
if (cardCvvInput) {
  cardCvvInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
  });
}

// -------- form submit = simulated payment --------
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!checkoutForm.checkValidity()) {
    checkoutForm.reportValidity();
    return;
  }

  payNowBtn.disabled = true;
  payNowBtn.textContent = "Processing…";

  // simulate a payment request
  setTimeout(() => {
    const orderNumber = "PT-" + Math.floor(100000 + Math.random() * 900000);
    orderNumberEl.textContent = orderNumber;

    checkoutStepPay.classList.add("hidden");
    checkoutStepSuccess.classList.remove("hidden");

    // clear the cart now that "payment" succeeded
    cart = {};
    renderProducts();
    renderCartItems();
    updateCartCount();
    updateTotals();
    checkoutForm.reset();
  }, 1400);
});

continueShoppingBtn.addEventListener("click", closeCheckout);

// ===========================================================
//                        INITIAL RENDER
// ===========================================================
renderCartItems();
updateCartCount();
updateTotals();
renderProducts();
