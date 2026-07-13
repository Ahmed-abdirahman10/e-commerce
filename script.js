/*
<!-- card -->
       <div class="card" style="animation-delay: 0.1s;">

        <!-- image -->
        <div class="card-img">
          <!-- badge -->
          <span class="badge">Sale</span>
          <img src="images/ears.png" alt="">
        </div>
        <!-- card body -->
         <div class="card-body">
          <!-- category -->
          <span class="card-cat">Audio</span>
          <!-- card name -->
           <div class="card-name">Obsidian Wireless Earbuds</div>
           <!-- card description -->
           <div class="card-desc">40hr battery, ANC, studio-grade sound.</div>
           <!-- card footer -->
            <div class="card-footer">
              <!-- card price -->
               <div class="card-price">
                <span class="old">$199.99</span>$99.99
               </div>
               <!-- add button -->
               <button class="add-btn">+ Add to cart</button>
            </div>
         </div>

</div>
*/

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
];

// state
let cart = {}
let activeFilter = "all";
let searchQuery = "";
let sortMode = "default";

//----------------------------- FILTER ---------------------------
const getFilteredProducts = () => {
  // list of products
  let list = [...Products];
  if(activeFilter !== "all") 
    list = list.filter(p => p.cat === activeFilter);

  // filter products by name,description,category,price
  if(searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) || list.filter(p => p.desc.toLowerCase().includes(searchQuery.toLowerCase())) || list.filter(p => p.cat.toLowerCase().includes(searchQuery.toLowerCase())) || list.filter(p => p.price.toString().includes(searchQuery.toLowerCase()));
  }

  // ----------- sort by Ascending  & descending --------------------------
  if(sortMode === 'asc') list.sort((a, b)  => a.price - b.price); // lowest price first.
  if(sortMode === 'desc') list.sort((a, b) => b.price - a.price); // highest price first.
  if(sortMode === 'name') list.sort((a, b) => a.name.localeCompare(b.name)); // highest price first.


  // console.log(searchQuery);
  return list;
}


// Selection of products
const productsGrid = document.querySelector("#productsGrid");

function renderProducts() {
  list = getFilteredProducts();
  // not found products 
if(!list.length) {
  productsGrid.innerHTML = `<div class= 'empty'> <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg><br>No products found.</div>`;
  return;
}

//---------------------------- display products -------------------------------
productsGrid.innerHTML =  list.map((product, index) => `
<div class="card" style="animation-delay: 0.1s;">

  <!-- image -->
  <div class="card-img">
          <!-- if badge exist show else hide badge -->
          ${product.badge ? `<span class="badge">${product.badge}</span>`: ``}
          <img src="${product.image}" alt="">
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
              <span class="old">${product.oldPrice.toFixed(2)}</span>${product.price.toFixed(2)}
            </div>
            <!-- add button -->
            <button class="add-btn" onclick="addToCart(${product.id})" id="addbtn-${product.id}">${cart[product.id] ? "✓ Added" : "+ Add to cart"}</button>
        </div>
    </div>

</div>`).join(``);
}


const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add("active");
    activeFilter = btn.dataset.cat;
    renderProducts();
    console.log("Filter buttons : ", activeFilter)
  })
})

let searchTimer;
document.querySelector("#searchInput").addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    searchQuery = e.target.value;
    renderProducts();
  }, 300);
})

// ------------------ sortMode --------------------
document.querySelector("#sortSelect").addEventListener('change',  e => {
  sortMode = e.target.value;
  renderProducts();
})

// ----------------------- Add to cart ----------------------
const addToCart = (id) => {
  const product = Products.find(p => p.id === id)
  
  if(!product) return;

  // add to cart products
  cart[id] = (cart[id] || 0) + 1;

  // save to local storage 

  renderProducts();
  showToast(`${product.name} Added to the cart`)

  renderCartItems()
  console.log("cart", cart);
}

// ---------------- TOAST --------------------------
let toastTimer;

function showToast(message) {
  const toast = document.getElementById("toast")
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200)
}


const drawer = document.getElementById("cartDrawer")
const overlay = document.getElementById("overlay")


//--------------- open and close drawer ------------------------
function OpenDrawer() {
  drawer.classList.add('open')
  overlay.classList.add('open')
  document.body.style.overflow = 'hidden'
}
function CloseDrawer() {
  drawer.classList.remove('open')
  overlay.classList.remove('open')
  document.body.style.overflow = ''
}

//--------------------------- Render cart items ---------------------------
const renderCartItems = () => {
  const itemsOfCart = document.getElementById('cartItems')
  const items = Object.entries(cart)
  if(!items.length) {
    // shopping bag icon
    itemsOfCart.innerHTML = `<div class="cart-empty"><svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg><br>You cart is empty.</div>`;
    return;
  }
  console.log(items)
  itemsOfCart.innerHTML = items.map(([id, qty]) => {
    const p = Products.find(p => p.id == id)
    if(!p) return '';
    return `<div class="cart-item">
<div class="cart-item-icon">
${p.image
  ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">`
  : `<div class="no-img">No image</div>`
}
</div>
<div class="cart-item-info">
<div class="cart-item-name">${p.name}</div>
<div class="cart-item-price">$${(p.price * qty).toFixed(2)}
</div>
</div>
<div class="qty-controls">
    <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>
    <span class="qty-num">${qty}</span>
    <button class="qty-btn" onclick="changeQty(${p.id}, 1)">+</button>
</div>
<button class="remove-btn" onclick="removeFromCart(${p.id})"
title="Remove">X</button>
</div>`;
  }).join('');
}


renderCartItems();
// always
renderProducts();