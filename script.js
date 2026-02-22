// ==================== YOUR VIDEOS ====================
// Place your .mp4 files in the 'videos/' folder.
// For each video, provide: title, tag, videoUrl.
const videosData = [
  {
    title: "Store Walkthrough - Birmingham",
    tag: "Store tour",
    videoUrl: "otvideo5.mp4"
  },
  {
    title: "Cargo Loading for Export",
    tag: "Logistics",
    videoUrl: "otvideo6.mp4"
  },
  {
    title: "Fresh Produce Arrival",
    tag: "Inventory",
    videoUrl: "otvideo4.mp4"
  },
  {
    title: "Customer Pickup Experience",
    tag: "Service",
    videoUrl: "goodsexp.mp4"
  },
  {
    title: "Import Documentation Process",
    tag: "Import/Export",
    videoUrl: "export.mp4"
  }
  // Add up to 25+ videos here
];

// ==================== ANNOUNCEMENT POPUP SLIDES ====================
const announcementSlides = [
  {
    title: "🎬 New Store Walkthrough!",
    description: "Take a tour of our Birmingham store – see the fresh produce section.",
    image: "storefront.jpg",
    link: "#operations",
    buttonText: "Watch Now"
  },
  {
    title: "📦 OT AFROMART FLYER",
    description: "Call the numbers for your export – real logistics in action.",
    image: "ota.jpeg",
    link: "#operations",
    buttonText: "See Video"
  },
  {
    title: "🥭 Fresh Vegetables Arrived",
    description: " Fresh vegetables now in stock. Order today!",
    image: "veg.jpeg",
    link: "#deals",
    buttonText: "Shop Now"
  },
  {
    title: "🎉 Import/Export Tips",
    description: "Learn about our documentation support for businesses.",
    image: "goods.jpeg",
    link: "import-export.html",
    buttonText: "Learn More"
  }
];

// ========== MOBILE MENU ==========
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// ========== HERO SLIDER ==========
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

// ========== VIDEO GALLERY (with live playing videos, no overlays) ==========
const videoTrack = document.getElementById('videoTrack');
if (videoTrack) {
  let videos = videosData.length ? videosData : Array.from({ length: 30 }, (_, i) => ({
    title: `Operations Clip ${i + 1}`,
    tag: i % 3 === 0 ? 'Store walkthrough' : i % 3 === 1 ? 'Cargo shipment' : 'Import/export logistics',
    videoUrl: ''
  }));

  const renderCards = (arr) => arr.map((v) => {
    let videoHtml = '';
    if (v.videoUrl) {
      videoHtml = `<video muted autoplay loop playsinline>
        <source src="${v.videoUrl}" type="video/mp4">
      </video>`;
    } else {
      // Fallback gradient background for mock videos
      videoHtml = `<div style="width:100%; height:100%; background: linear-gradient(130deg,#12345e,#5f1024);"></div>`;
    }
    return `
      <article class="video-card" data-video-url="${v.videoUrl || ''}">
        <div class="video-thumb">
          ${videoHtml}
        </div>
        <div class="video-meta">
          <h3>${v.title}</h3>
          <p>${v.tag}</p>
        </div>
      </article>
    `;
  }).join('');

  // Duplicate for infinite scroll
  videoTrack.innerHTML = renderCards(videos) + renderCards(videos);

  // Attempt to play videos (autoplay may be blocked)
  document.querySelectorAll('.video-card video').forEach(vid => {
    vid.play().catch(() => {});
  });
}

// ========== CART ==========
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

// ========== COOKIE BANNER ==========
const cookieBanner = document.getElementById('cookieBanner');
if (cookieBanner && !localStorage.getItem('otCookieAccepted')) cookieBanner.classList.add('show');
const cookieAccept = document.getElementById('cookieAccept');
if (cookieAccept) cookieAccept.addEventListener('click', () => {
  localStorage.setItem('otCookieAccepted', 'yes');
  cookieBanner?.classList.remove('show');
});

// ========== WHATSAPP CHAT ==========
const whatsappFab = document.getElementById('whatsappFab');
const chatWidget = document.getElementById('chatWidget');
if (whatsappFab && chatWidget) {
  whatsappFab.addEventListener('click', () => chatWidget.classList.toggle('open'));
}

// ========== SCROLL ANIMATION ==========
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.15 });
document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));

// ========== ROTATING FOODSTUFF WITH TOUCH SWIPE ==========
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
  let autoRotateInterval;

  const paintFood = () => {
    foodstuffStage.style.backgroundImage = `linear-gradient(120deg, rgba(0,0,0,.15), rgba(0,0,0,.35)), url('${foodImages[foodIndex]}')`;
  };

  const startAutoRotate = () => {
    if (autoRotateInterval) clearInterval(autoRotateInterval);
    autoRotateInterval = setInterval(() => {
      foodIndex = (foodIndex + 1) % foodImages.length;
      paintFood();
    }, 3200);
  };

  paintFood();
  startAutoRotate();

  let touchStartX = 0;
  let touchEndX = 0;
  const minSwipeDistance = 50;

  foodstuffStage.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  foodstuffStage.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  foodstuffStage.addEventListener('mousedown', (e) => {
    touchStartX = e.screenX;
  });
  foodstuffStage.addEventListener('mouseup', (e) => {
    touchEndX = e.screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const distance = touchEndX - touchStartX;
    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0) {
      foodIndex = (foodIndex - 1 + foodImages.length) % foodImages.length;
    } else {
      foodIndex = (foodIndex + 1) % foodImages.length;
    }
    paintFood();
    startAutoRotate();
  }

  foodstuffStage.addEventListener('touchmove', (e) => {
    if (Math.abs(e.touches[0].screenX - touchStartX) > 20) {
      e.preventDefault();
    }
  }, { passive: false });
}

// ========== WHATSAPP DRAG ==========
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

// ========== VIDEO MODAL ==========
const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const closeModalBtn = document.querySelector('.video-modal-close');

document.addEventListener('click', (e) => {
  const card = e.target.closest('.video-card');
  if (!card) return;
  const videoUrl = card.dataset.videoUrl;
  if (videoUrl) {
    modalVideo.src = videoUrl;
    videoModal.classList.add('show');
    modalVideo.play();
  }
});

const closeVideoModal = () => {
  videoModal.classList.remove('show');
  modalVideo.pause();
  modalVideo.src = '';
};
if (closeModalBtn) closeModalBtn.addEventListener('click', closeVideoModal);
window.addEventListener('click', (e) => {
  if (e.target === videoModal) closeVideoModal();
});

// ========== ANNOUNCEMENT POPUP CAROUSEL ==========
const announcementPopup = document.getElementById('announcementPopup');
const closePopup = document.querySelector('.popup-close');
const popupSlidesContainer = document.getElementById('popupSlides');
const popupDotsContainer = document.getElementById('popupDots');

let currentSlide = 0;
let slideInterval;

function renderAnnouncementSlides() {
  if (!popupSlidesContainer) return;
  popupSlidesContainer.innerHTML = '';
  popupDotsContainer.innerHTML = '';

  announcementSlides.forEach((slide, index) => {
    const slideDiv = document.createElement('div');
    slideDiv.className = `popup-slide ${index === 0 ? 'active' : ''}`;
    
    let html = '';
    if (slide.image) {
      html += `<img src="${slide.image}" alt="${slide.title}">`;
    }
    html += `<h3>${slide.title}</h3>`;
    html += `<p>${slide.description}</p>`;
    if (slide.link && slide.buttonText) {
      html += `<a href="${slide.link}" class="btn btn-primary">${slide.buttonText}</a>`;
    }
    
    slideDiv.innerHTML = html;
    popupSlidesContainer.appendChild(slideDiv);

    const dot = document.createElement('button');
    dot.className = `popup-dot ${index === 0 ? 'active' : ''}`;
    dot.setAttribute('data-slide', index);
    dot.addEventListener('click', () => goToSlide(index));
    popupDotsContainer.appendChild(dot);
  });
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.popup-slide');
  const dots = document.querySelectorAll('.popup-dot');
  if (!slides.length || !dots.length) return;
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function startSlideInterval() {
  if (slideInterval) clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 5000);
}

if (announcementPopup) {
  announcementPopup.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
  });
  announcementPopup.addEventListener('mouseleave', () => {
    startSlideInterval();
  });
}

if (closePopup) {
  closePopup.addEventListener('click', () => {
    announcementPopup.classList.remove('show');
    clearInterval(slideInterval);
    localStorage.setItem('popupClosed', 'true');
  });
}

setTimeout(() => {
  if (!localStorage.getItem('popupClosed')) {
    renderAnnouncementSlides();
    announcementPopup.classList.add('show');
    startSlideInterval();
  }
}, 3000);
