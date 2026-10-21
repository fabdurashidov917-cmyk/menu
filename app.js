// ========================================================
// ZARAFSHON GRAND RESTAURANT - INTERACTIVE APP LOGIC
// ========================================================

// App State
const state = {
  activeCategory: 'all',
  searchQuery: '',
  sortBy: 'popular',
  cart: JSON.parse(localStorage.getItem('zarafshon_cart') || '[]'),
  serviceChargeRate: 0.10 // 10% xizmat haqi
};

// Currency Formatter
function formatPrice(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
}

// DOM Elements
const dishesContainer = document.getElementById('dishesGrid');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const categoryTabs = document.querySelectorAll('.tab-btn');
const resultsCountEl = document.getElementById('resultsCount');

// Cart Elements
const cartToggleBtn = document.getElementById('cartToggleBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartBadge = document.getElementById('cartBadge');
const cartItemsContainer = document.getElementById('cartItems');
const subtotalEl = document.getElementById('cartSubtotal');
const serviceChargeEl = document.getElementById('cartServiceCharge');
const grandTotalEl = document.getElementById('cartGrandTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

// Dish Modal Elements
const dishModalOverlay = document.getElementById('dishModalOverlay');
const closeDishModal = document.getElementById('closeDishModal');
const modalDishImg = document.getElementById('modalDishImg');
const modalDishBadge = document.getElementById('modalDishBadge');
const modalDishCat = document.getElementById('modalDishCat');
const modalDishTitle = document.getElementById('modalDishTitle');
const modalDishRating = document.getElementById('modalDishRating');
const modalDishPortion = document.getElementById('modalDishPortion');
const modalDishTime = document.getElementById('modalDishTime');
const modalDishCalories = document.getElementById('modalDishCalories');
const modalDishDesc = document.getElementById('modalDishDesc');
const modalIngredientsList = document.getElementById('modalIngredientsList');
const modalDishPrice = document.getElementById('modalDishPrice');
const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');

let currentModalDishId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderCategoryCounts();
  renderMenu();
  updateCartUI();
  setupEventListeners();
});

// Calculate category counts
function renderCategoryCounts() {
  const counts = {
    all: MENU_ITEMS.length,
    milliy: MENU_ITEMS.filter(item => item.category === 'milliy').length,
    kabob: MENU_ITEMS.filter(item => item.category === 'kabob').length,
    shorva: MENU_ITEMS.filter(item => item.category === 'shorva').length,
    salat: MENU_ITEMS.filter(item => item.category === 'salat').length,
    desert: MENU_ITEMS.filter(item => item.category === 'desert').length,
    ichimlik: MENU_ITEMS.filter(item => item.category === 'ichimlik').length
  };

  categoryTabs.forEach(tab => {
    const cat = tab.dataset.category;
    const countBadge = tab.querySelector('.tab-count');
    if (countBadge && counts[cat] !== undefined) {
      countBadge.textContent = counts[cat];
    }
  });
}

// Filter and Sort Menu
function getFilteredAndSortedItems() {
  let items = [...MENU_ITEMS];

  // Category Filter
  if (state.activeCategory !== 'all') {
    items = items.filter(item => item.category === state.activeCategory);
  }

  // Search Filter
  if (state.searchQuery.trim() !== '') {
    const query = state.searchQuery.toLowerCase().trim();
    items = items.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query) ||
      item.ingredients.some(ing => ing.toLowerCase().includes(query))
    );
  }

  // Sort
  if (state.sortBy === 'price-asc') {
    items.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'price-desc') {
    items.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === 'rating') {
    items.sort((a, b) => b.rating - a.rating);
  } else {
    // popular (default) - by reviews count
    items.sort((a, b) => b.reviewsCount - a.reviewsCount);
  }

  return items;
}

// Render Menu to DOM
function renderMenu() {
  const items = getFilteredAndSortedItems();

  if (resultsCountEl) {
    resultsCountEl.textContent = `${items.length} ta taom mavjud`;
  }

  if (items.length === 0) {
    dishesContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🍽️</div>
        <h3>Hech qanday taom topilmadi</h3>
        <p style="color: var(--text-secondary); margin-top: 8px;">
          "${state.searchQuery}" bo'yicha taom topilmadi. Qidiruv so'zini o'zgartirib ko'ring yoki boshqa toifani tanlang.
        </p>
      </div>
    `;
    return;
  }

  dishesContainer.innerHTML = items.map(dish => {
    const badgeHtml = dish.badge 
      ? `<span class="dish-badge ${dish.badgeType}">${dish.badge}</span>` 
      : '';

    const oldPriceHtml = dish.oldPrice 
      ? `<span class="dish-old-price">${formatPrice(dish.oldPrice)}</span>` 
      : '';

    const tagsHtml = dish.ingredients.slice(0, 3).map(tag => 
      `<span class="dish-tag-item">${tag}</span>`
    ).join('');

    return `
      <div class="dish-card" data-id="${dish.id}">
        <div class="dish-image-wrapper" onclick="openDishModal(${dish.id})">
          <img src="${dish.image}" alt="${dish.title}" class="dish-image" loading="lazy" />
          ${badgeHtml}
          <div class="dish-quick-meta">
            <span>⏱️ ${dish.time}</span>
            <span>⚖️ ${dish.portion}</span>
          </div>
        </div>

        <div class="dish-content">
          <div class="dish-header-row">
            <span class="dish-category">${dish.categoryName}</span>
            <div class="dish-rating">
              <span>★</span>
              <span>${dish.rating}</span>
              <span class="dish-rating-count">(${dish.reviewsCount})</span>
            </div>
          </div>

          <h3 class="dish-title" onclick="openDishModal(${dish.id})">${dish.title}</h3>
          <p class="dish-description">${dish.desc}</p>

          <div class="dish-tags">
            ${tagsHtml}
          </div>

          <div class="dish-footer">
            <div class="dish-price-wrap">
              ${oldPriceHtml}
              <div class="dish-price">${formatPrice(dish.price)}</div>
            </div>

            <div class="dish-buttons">
              <button class="btn-detail" onclick="openDishModal(${dish.id})">Batafsil</button>
              <button class="btn-add-cart" onclick="addToCart(${dish.id})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Qo'shish
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Open Dish Detail Modal
window.openDishModal = function(id) {
  const dish = MENU_ITEMS.find(item => item.id === id);
  if (!dish) return;

  currentModalDishId = dish.id;
  modalDishImg.src = dish.image;
  modalDishImg.alt = dish.title;
  modalDishCat.textContent = dish.categoryName;
  modalDishTitle.textContent = dish.title;
  modalDishRating.textContent = `★ ${dish.rating} (${dish.reviewsCount} sharh)`;
  modalDishPortion.textContent = dish.portion;
  modalDishTime.textContent = dish.time;
  modalDishCalories.textContent = dish.calories;
  modalDishDesc.textContent = dish.desc;
  modalDishPrice.textContent = formatPrice(dish.price);

  if (dish.badge) {
    modalDishBadge.style.display = 'inline-block';
    modalDishBadge.textContent = dish.badge;
    modalDishBadge.className = `dish-badge ${dish.badgeType}`;
  } else {
    modalDishBadge.style.display = 'none';
  }

  modalIngredientsList.innerHTML = dish.ingredients.map(ing => 
    `<span class="modal-ingredient-chip">✓ ${ing}</span>`
  ).join('');

  dishModalOverlay.classList.add('open');
};

function closeDishModalWindow() {
  dishModalOverlay.classList.remove('open');
  currentModalDishId = null;
}

// Cart Functions
window.addToCart = function(id) {
  const dish = MENU_ITEMS.find(item => item.id === id);
  if (!dish) return;

  const existingItem = state.cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    state.cart.push({
      id: dish.id,
      title: dish.title,
      price: dish.price,
      image: dish.image,
      qty: 1
    });
  }

  saveCart();
  updateCartUI();
  showToast(`"${dish.title}" savatga qo'shildi! 🛒`);
  bumpCartIcon();
};

window.changeCartQty = function(id, delta) {
  const item = state.cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter(i => i.id !== id);
  }

  saveCart();
  updateCartUI();
};

window.removeFromCart = function(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
  showToast("Taom savatdan olib tashlandi");
};

function saveCart() {
  localStorage.setItem('zarafshon_cart', JSON.stringify(state.cart));
}

function bumpCartIcon() {
  if (cartBadge) {
    cartBadge.classList.add('bump');
    setTimeout(() => cartBadge.classList.remove('bump'), 300);
  }
}

function updateCartUI() {
  const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartBadge) {
    cartBadge.textContent = totalItems;
  }

  if (state.cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart-msg">
        <div style="font-size: 40px; margin-bottom: 12px;">🛍️</div>
        <p>Savatingiz hozircha bo'sh</p>
        <p style="font-size: 13px; margin-top: 6px;">Menyudan o'zingiz yoqtirgan tansiq taomlarni qo'shing!</p>
      </div>
    `;
    subtotalEl.textContent = "0 so'm";
    serviceChargeEl.textContent = "0 so'm";
    grandTotalEl.textContent = "0 so'm";
    checkoutBtn.disabled = true;
    checkoutBtn.style.opacity = '0.5';
    checkoutBtn.style.cursor = 'not-allowed';
    return;
  }

  checkoutBtn.disabled = false;
  checkoutBtn.style.opacity = '1';
  checkoutBtn.style.cursor = 'pointer';

  cartItemsContainer.innerHTML = state.cart.map(item => `
    <div class="cart-item-card">
      <img src="${item.image}" alt="${item.title}" class="cart-item-img" />
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.title}</h4>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="cart-item-counter">
          <button class="count-btn" onclick="changeCartQty(${item.id}, -1)">-</button>
          <span class="cart-item-qty">${item.qty}</span>
          <button class="count-btn" onclick="changeCartQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="btn-delete-item" onclick="removeFromCart(${item.id})" title="O'chirish">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    </div>
  `).join('');

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const serviceCharge = Math.round(subtotal * state.serviceChargeRate);
  const grandTotal = subtotal + serviceCharge;

  subtotalEl.textContent = formatPrice(subtotal);
  serviceChargeEl.textContent = formatPrice(serviceCharge);
  grandTotalEl.textContent = formatPrice(grandTotal);
}

// Toast Notification
function showToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✨</span><span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Setup Event Listeners
function setupEventListeners() {
  // Category tabs click
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.activeCategory = tab.dataset.category;
      renderMenu();
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderMenu();
    });
  }

  // Sort select
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderMenu();
    });
  }

  // Cart Drawer open/close
  if (cartToggleBtn) {
    cartToggleBtn.addEventListener('click', () => {
      cartDrawer.classList.add('open');
      cartOverlay.classList.add('open');
    });
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
      cartDrawer.classList.remove('open');
      cartOverlay.classList.remove('open');
    });
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', () => {
      cartDrawer.classList.remove('open');
      cartOverlay.classList.remove('open');
    });
  }

  // Dish Modal Close
  if (closeDishModal) {
    closeDishModal.addEventListener('click', closeDishModalWindow);
  }

  if (dishModalOverlay) {
    dishModalOverlay.addEventListener('click', (e) => {
      if (e.target === dishModalOverlay) {
        closeDishModalWindow();
      }
    });
  }

  if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener('click', () => {
      if (currentModalDishId) {
        addToCart(currentModalDishId);
        closeDishModalWindow();
      }
    });
  }

  // Checkout process (Order via Modal / Telegram Summary)
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckout);
  }

  // Table reservation form
  const reserveForm = document.getElementById('reservationForm');
  if (reserveForm) {
    reserveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('resName').value;
      const phone = document.getElementById('resPhone').value;
      const date = document.getElementById('resDate').value;
      const time = document.getElementById('resTime').value;
      const guests = document.getElementById('resGuests').value;
      const hall = document.getElementById('resHall').value;

      alert(`🎉 Rahmat, ${name}! Stolingiz muvaffaqiyatli band qilindi.\n\n📅 Sana: ${date}\n⏰ Vaqt: ${time}\n👥 Mehmonlar: ${guests} kishi\n🏛️ Zal: ${hall}\n\nAdministratorimiz ${phone} raqamingizga qo'ng'iroq qilib tasdiqlaydi.`);
      reserveForm.reset();
    });
  }

  // Navbar scroll background
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      if (navLinks.classList.contains('open')) {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '80px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = '#0d1117';
        navLinks.style.padding = '24px';
        navLinks.style.borderBottom = '1px solid var(--border-color)';
      } else {
        navLinks.style.display = '';
      }
    });
  }
}

// Handle Order Checkout
function handleCheckout() {
  if (state.cart.length === 0) return;

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const serviceCharge = Math.round(subtotal * state.serviceChargeRate);
  const grandTotal = subtotal + serviceCharge;

  let orderSummary = "🍽️ ZARAFSHON RESTORANIGA YANGI BUYURTMA:\n\n";
  state.cart.forEach((item, index) => {
    orderSummary += `${index + 1}. ${item.title} x ${item.qty} dona = ${formatPrice(item.price * item.qty)}\n`;
  });

  orderSummary += `\nTaomlar narxi: ${formatPrice(subtotal)}`;
  orderSummary += `\nXizmat haqi (10%): ${formatPrice(serviceCharge)}`;
  orderSummary += `\nJAMI TO'LOV: ${formatPrice(grandTotal)}`;

  const customerName = prompt("Buyurtmani rasmiylashtirish uchun ismingizni kiriting:", "");
  if (!customerName) return;

  const customerPhone = prompt("Bog'lanish uchun telefon raqamingiz (+998...):", "+998 ");
  if (!customerPhone) return;

  const finalSummary = `${orderSummary}\n\n👤 Mijoz: ${customerName}\n📞 Tel: ${customerPhone}\n\nBuyurtmangiz qabul qilindi! Operatorimiz 5 daqiqada siz bilan bog'lanadi.`;

  alert(finalSummary);

  // Clear cart
  state.cart = [];
  saveCart();
  updateCartUI();
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
  showToast("Buyurtmangiz qabul qilindi! Yoqimli ishtaha! 🎉");
}
