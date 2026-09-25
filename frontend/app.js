// Backend Base URL (Local development ke baad Render ya live domain ka URL yahan ayega)
const API_URL = "http://127.0.0.1:8000/api";

let cart = [];
let orderType = 'Takeaway / Dine-in';

function updateLiveStatus() {
  const now = new Date();
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const pktTime = new Date(utcTime + (3600000 * 5)); // PKT (UTC +5)

  const day = pktTime.getDay();
  const hours = pktTime.getHours();

  let isOpen = false;
  if (hours >= 9) {
    isOpen = true;
  } else if (hours < 1) {
    isOpen = true;
  } else if (hours < 2) {
    const prevDay = (day === 0) ? 6 : day - 1;
    if (prevDay !== 1) {
      isOpen = true;
    }
  }

  const ticker = document.getElementById('liveStatusTicker');
  const heroBadge = document.getElementById('heroOpenBadge');
  const timingBadge = document.getElementById('timingBadge');

  if (isOpen) {
    const closeTime = (day === 1 && hours >= 9) ? '1:00 AM' : '2:00 AM';
    if (ticker) ticker.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Open Now • Serving till ${closeTime}`;
    if (heroBadge) {
      heroBadge.className = 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-950/80 border border-emerald-500/40 text-emerald-400';
      heroBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> <span>OPEN NOW • SERVING TILL ${closeTime}</span>`;
    }
    if (timingBadge) {
      timingBadge.className = 'text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30';
      timingBadge.innerText = '🟢 Kitchen Open Now';
    }
  } else {
    if (ticker) ticker.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400"></span> Closed Now • Opens at 9:00 AM`;
    if (heroBadge) {
      heroBadge.className = 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-950/80 border border-amber-500/40 text-amber-400';
      heroBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400"></span> <span>OPENS TODAY AT 9:00 AM</span>`;
    }
    if (timingBadge) {
      timingBadge.className = 'text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30';
      timingBadge.innerText = '🟡 Opens at 9:00 AM';
    }
  }

  const dayMap = ['day-sun', 'day-mon', 'day-tue', 'day-wed', 'day-thu', 'day-fri', 'day-sat'];
  const todayEl = document.getElementById(dayMap[day]);
  if (todayEl) {
    todayEl.classList.add('bg-white/10', 'border', 'border-brand-red/30');
  }
}

function filterMenu(category) {
  const cards = document.querySelectorAll('.menu-item-card');
  const buttons = document.querySelectorAll('.menu-tab-btn');

  buttons.forEach(btn => {
    if (btn.getAttribute('data-category') === category) {
      btn.className = 'menu-tab-btn active px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap bg-brand-red text-white shadow-glow-red';
    } else {
      btn.className = 'menu-tab-btn px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap bg-brand-card hover:bg-brand-cardBorder text-gray-300 hover:text-white border border-white/5';
    }
  });

  cards.forEach(card => {
    const itemCat = card.getAttribute('data-category');
    if (category === 'all' || itemCat === category) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

function addToCart(title, price, category) {
  const existing = cart.find(item => item.title === title);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ title, price, quantity: 1, category });
  }
  updateCartUI();
  showToast('Added to Tray!', `${title} (PKR ${price})`, 'success');
}

function changeQuantity(index, delta) {
  if (cart[index]) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  }
  updateCartUI();
}

function setOrderType(type) {
  orderType = type;
  const btnTakeaway = document.getElementById('btnTakeaway');
  const btnDelivery = document.getElementById('btnDelivery');

  if (type === 'Takeaway / Dine-in') {
    btnTakeaway.className = 'py-2 rounded-xl bg-brand-red text-white border border-brand-red transition-all';
    btnDelivery.className = 'py-2 rounded-xl bg-brand-card text-gray-300 border border-white/5 transition-all';
  } else {
    btnDelivery.className = 'py-2 rounded-xl bg-brand-red text-white border border-brand-red transition-all';
    btnTakeaway.className = 'py-2 rounded-xl bg-brand-card text-gray-300 border border-white/5 transition-all';
  }
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const countEl = document.getElementById('headerCartCount');
  const mobileBadgeEl = document.getElementById('mobileBottomCartBadge');
  if (countEl) countEl.innerText = totalCount;
  if (mobileBadgeEl) mobileBadgeEl.innerText = totalCount;

  const subtotalEl = document.getElementById('cartSubtotal');
  const totalEl = document.getElementById('cartTotal');
  if (subtotalEl) subtotalEl.innerText = `PKR ${subtotal.toLocaleString()}`;
  if (totalEl) totalEl.innerText = `PKR ${subtotal.toLocaleString()}`;

  const listEl = document.getElementById('cartItemList');
  if (!listEl) return;

  if (cart.length === 0) {
    listEl.innerHTML = `
      <div class="h-64 flex flex-col items-center justify-center text-center p-6 text-gray-500 space-y-2">
        <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl text-gray-600 mb-2">
          <i class="fa-solid fa-burger"></i>
        </div>
        <p class="text-sm font-bold text-gray-300">Your Tray is Empty</p>
        <p class="text-xs max-w-xs">Explore our pizzas, crispy crunch burgers & famous sundaes to build your order!</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = cart.map((item, index) => `
    <div class="bg-brand-card border border-white/5 rounded-xl p-3 flex items-center justify-between gap-3">
      <div class="flex-1 min-w-0">
        <p class="text-xs font-bold text-white truncate">${item.title}</p>
        <p class="text-[11px] text-amber-400 font-semibold">PKR ${item.price} × ${item.quantity} = PKR ${(item.price * item.quantity).toLocaleString()}</p>
      </div>
      <div class="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg border border-white/10 shrink-0">
        <button onclick="changeQuantity(${index}, -1)" class="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white text-xs">
          <i class="fa-solid fa-minus text-[10px]"></i>
        </button>
        <span class="text-xs font-bold text-white px-1">${item.quantity}</span>
        <button onclick="changeQuantity(${index}, 1)" class="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white text-xs">
          <i class="fa-solid fa-plus text-[10px]"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// Order dispatch handler (Backend sync + WhatsApp forwarding)
async function sendOrderToWhatsApp() {
  if (cart.length === 0) {
    showToast('Empty Tray', 'Please add at least one dish to order!', 'info');
    return;
  }

  const custName = document.getElementById('orderCustName').value.trim() || 'Valued Customer';
  const custNote = document.getElementById('orderCustNote').value.trim() || 'Standard preparation';
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  let generatedOrderId = "Direct";

  // Backend par order log karna
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: custName,
        order_type: orderType,
        notes_or_address: custNote,
        items: cart,
        total_amount: totalAmount
      })
    });
    if (res.ok) {
      const data = await res.json();
      generatedOrderId = data.order_id;
    }
  } catch (err) {
    console.warn("Backend offline or unreachable, proceeding with direct WhatsApp order.", err);
  }

  // Structured WhatsApp order string
  let msg = `*NEW ORDER - BELLA'S HARIPUR*\n`;
  msg += `*Order Ref:* ${generatedOrderId}\n`;
  msg += `------------------------------------\n`;
  msg += `*Customer:* ${custName}\n`;
  msg += `*Order Type:* ${orderType}\n`;
  msg += `*Notes/Address:* ${custNote}\n`;
  msg += `------------------------------------\n`;
  msg += `*ITEMS:*\n`;

  cart.forEach((item, i) => {
    msg += `${i + 1}. ${item.title} × ${item.quantity} — PKR ${(item.price * item.quantity).toLocaleString()}\n`;
  });

  msg += `------------------------------------\n`;
  msg += `*Total Estimate:* PKR ${totalAmount.toLocaleString()}\n`;
  msg += `*Location:* Main GT Road, Haripur\n`;
  msg += `Please confirm my order and prep time.`;

  const waUrl = `https://wa.me/923361131166?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
}

function toggleCartDrawer(open) {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartDrawerBackdrop');
  if (open) {
    backdrop.classList.remove('hidden');
    setTimeout(() => drawer.classList.remove('translate-x-full'), 10);
  } else {
    drawer.classList.add('translate-x-full');
    setTimeout(() => backdrop.classList.add('hidden'), 300);
  }
}

function toggleMobileNav() {
  const menu = document.getElementById('mobileNavMenu');
  const icon = document.getElementById('menuHamburgerIcon');
  menu.classList.toggle('hidden');
  if (menu.classList.contains('hidden')) {
    icon.className = 'fa-solid fa-bars';
  } else {
    icon.className = 'fa-solid fa-xmark';
  }
}

function copyAddress() {
  const address = "Main GT Road, Akthar Nawaz Khan Plaza, near Sabzi Mandi, opposite Nishat Mandi Mor, Darvesh, Haripur, 22600, Pakistan";
  const tempInput = document.createElement("textarea");
  tempInput.value = address;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);

  const icon = document.getElementById('copyIcon');
  if (icon) {
    icon.className = 'fa-solid fa-check text-emerald-400';
    setTimeout(() => { icon.className = 'fa-regular fa-copy'; }, 2000);
  }
  showToast('Address Copied!', 'Pasted to clipboard.', 'success');
}

// Contact Form Handler with Backend Sync
async function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('contactName').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();
  const message = document.getElementById('contactMessage').value.trim();

  try {
    const res = await fetch(`${API_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, message })
    });

    if (res.ok) {
      showToast(`Thank You, ${name}!`, "Your message was sent to Bella's team.", 'success');
      document.getElementById('contactForm').reset();
    } else {
      showToast('Notice', "Could not save message. Please call 0336-1131166.", 'info');
    }
  } catch (err) {
    showToast(`Shukriya, ${name}!`, "Message noted. We will call you back soon.", 'success');
    document.getElementById('contactForm').reset();
  }
}

function showToast(title, message, type) {
  const toast = document.getElementById('toastNotification');
  const titleEl = document.getElementById('toastTitle');
  const msgEl = document.getElementById('toastMessage');
  const iconEl = document.getElementById('toastIcon');

  titleEl.innerText = title;
  msgEl.innerText = message;

  if (type === 'success') {
    iconEl.className = 'w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm shrink-0';
    iconEl.innerHTML = '<i class="fa-solid fa-check"></i>';
  } else {
    iconEl.className = 'w-7 h-7 rounded-full bg-brand-red/20 text-brand-red flex items-center justify-center text-sm shrink-0';
    iconEl.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
  }

  toast.classList.remove('translate-y-[-150%]', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-[-150%]', 'opacity-0');
  }, 3500);
}

window.addEventListener('DOMContentLoaded', () => {
  updateLiveStatus();
  updateCartUI();
  setInterval(updateLiveStatus, 60000);
});