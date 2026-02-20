const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

const slides = [...document.querySelectorAll('.slide')];
const dotsWrap = document.getElementById('sliderDots');
let slideIndex = 0;
if (slides.length && dotsWrap) {
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (idx === 0 ? ' active' : '');
    dot.addEventListener('click', () => setSlide(idx));
    dotsWrap.appendChild(dot);
  });
  const dots = [...dotsWrap.children];
  function setSlide(index) {
    slides[slideIndex].classList.remove('active');
    dots[slideIndex].classList.remove('active');
    slideIndex = index;
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
  }
  setInterval(() => setSlide((slideIndex + 1) % slides.length), 4500);
}

const videoTrack = document.getElementById('videoTrack');
if (videoTrack) {
  const videos = Array.from({ length: 30 }, (_, i) => ({
    title: `Operations Clip ${i + 1}`,
    tag: i % 3 === 0 ? 'Store walkthrough' : i % 3 === 1 ? 'Cargo shipment' : 'Import/export logistics',
    duration: `${1 + (i % 5)}:${(10 + i * 7) % 60}`.padStart(4, '0')
  }));
  const renderCards = (arr) => arr.map((v) => `
    <article class="video-card">
      <div class="video-thumb">
        <i class="fa-solid fa-play"></i>
        <span class="duration">${v.duration}</span>
      </div>
      <div class="video-meta">
        <h3>${v.title}</h3>
        <p>${v.tag}</p>
      </div>
    </article>
  `).join('');
  videoTrack.innerHTML = renderCards(videos) + renderCards(videos);
}

const cart = JSON.parse(localStorage.getItem('otCart') || '[]');
const cartButtons = document.querySelectorAll('[data-add-cart]');
const cartDrawer = document.getElementById('cartDrawer');
const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');
const overlay = document.getElementById('overlay');

function saveCart() { localStorage.setItem('otCart', JSON.stringify(cart)); }
function drawCart() {
  if (!cartList || !cartTotal) return;
  cartList.innerHTML = cart.length ? '' : '<p>Your cart is empty.</p>';
  cart.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `<div><strong>${item.name}</strong><div>£${item.price.toFixed(2)}</div></div>
      <button class="icon-btn" data-remove="${idx}"><i class="fa-solid fa-trash"></i></button>`;
    cartList.appendChild(row);
  });
  cartTotal.textContent = `£${cart.reduce((sum, i) => sum + i.price, 0).toFixed(2)}`;
}
function openCart() {
  if (!cartDrawer || !overlay) return;
  cartDrawer.classList.add('open');
  overlay.classList.add('show');
}
function closePanels() {
  if (cartDrawer) cartDrawer.classList.remove('open');
  if (overlay) overlay.classList.remove('show');
  document.querySelectorAll('.modal').forEach((m) => m.classList.remove('show'));
}
cartButtons.forEach((btn) => btn.addEventListener('click', () => {
  cart.push({ name: btn.dataset.name, price: Number(btn.dataset.price) });
  saveCart();
  drawCart();
  openCart();
}));

document.addEventListener('click', (e) => {
  const cartBtn = e.target.closest('[data-open-cart]');
  const removeBtn = e.target.closest('[data-remove]');
  const authBtn = e.target.closest('[data-open-modal]');
  const closeBtn = e.target.closest('[data-close]');
  if (cartBtn) { drawCart(); openCart(); }
  if (removeBtn) {
    cart.splice(Number(removeBtn.dataset.remove), 1);
    saveCart(); drawCart();
  }
  if (authBtn) {
    const modal = document.getElementById(authBtn.dataset.openModal);
    if (modal) { modal.classList.add('show'); overlay?.classList.add('show'); }
  }
  if (closeBtn || e.target === overlay) closePanels();
});
drawCart();

const cookieBanner = document.getElementById('cookieBanner');
if (cookieBanner && !localStorage.getItem('otCookieAccepted')) cookieBanner.classList.add('show');
const cookieAccept = document.getElementById('cookieAccept');
if (cookieAccept) cookieAccept.addEventListener('click', () => {
  localStorage.setItem('otCookieAccepted', 'yes');
  cookieBanner?.classList.remove('show');
});

const whatsappFab = document.getElementById('whatsappFab');
const chatWidget = document.getElementById('chatWidget');
if (whatsappFab && chatWidget) {
  whatsappFab.addEventListener('click', () => chatWidget.classList.toggle('open'));
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.15 });
document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));

const foodstuffStage = document.getElementById('foodstuffStage');
if (foodstuffStage) {
  const foodImages = [
    'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1603048719539-9ecb4aa395e6?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1506617564039-2f3b650b7010?auto=format&fit=crop&w=1400&q=80'
  ];
  let foodIndex = 0;
  const paintFood = () => {
    foodstuffStage.style.backgroundImage = `linear-gradient(120deg, rgba(0,0,0,.15), rgba(0,0,0,.35)), url('${foodImages[foodIndex]}')`;
  };
  paintFood();
  setInterval(() => {
    foodIndex = (foodIndex + 1) % foodImages.length;
    paintFood();
  }, 3200);
}

if (whatsappFab) {
  let isDragging = false;
  let moved = false;
  let startX = 0;
  let startY = 0;
  whatsappFab.addEventListener('pointerdown', (e) => {
    isDragging = true;
    moved = false;
    startX = e.clientX - whatsappFab.offsetLeft;
    startY = e.clientY - whatsappFab.offsetTop;
    whatsappFab.setPointerCapture(e.pointerId);
  });
  whatsappFab.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    moved = true;
    const maxX = window.innerWidth - whatsappFab.offsetWidth;
    const maxY = window.innerHeight - whatsappFab.offsetHeight;
    const left = Math.max(0, Math.min(maxX, e.clientX - startX));
    const top = Math.max(0, Math.min(maxY, e.clientY - startY));
    whatsappFab.style.left = `${left}px`;
    whatsappFab.style.top = `${top}px`;
    whatsappFab.style.right = 'auto';
    whatsappFab.style.bottom = 'auto';
  });
  whatsappFab.addEventListener('pointerup', (e) => {
    if (isDragging) whatsappFab.releasePointerCapture(e.pointerId);
    isDragging = false;
    setTimeout(() => { moved = false; }, 40);
  });
  whatsappFab.addEventListener('click', (e) => {
    if (moved) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);
}
