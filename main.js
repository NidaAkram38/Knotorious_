// ===========================
//  KNOTORIOUS — main.js
//  Page UI + Product rendering
// ===========================

// ---- Render product cards for a category ----
function renderCategory(containerId, category) {
  const grid = document.getElementById(containerId);
  if (!grid) return;

  const filtered = PRODUCTS.filter(p => p.category === category);

  grid.innerHTML = filtered.map(p => {
    const disc = p.origPrice ? Math.round((1 - p.salePrice / p.origPrice) * 100) : 0;
    const catLabel = p.category === 'keychain' ? 'Keychain'
                   : p.category === 'flower'   ? 'Flower / Bouquet'
                   :                             'Accessory';
    return `
      <div class="product-card">
        <div class="pc-img-wrap">
          <img
            src="${p.img}"
            alt="${p.name}"
            onerror="this.src='${typeof FALLBACK_IMG !== 'undefined' ? FALLBACK_IMG : 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400&q=80'}'">
          ${p.badge ? `<span class="pc-badge">${p.badge}</span>` : ''}
          ${disc > 0 ? `<span class="pc-disc">-${disc}%</span>` : ''}
        </div>
        <div class="pc-body">
          <span class="pc-cat">${catLabel}</span>
          <h4 class="pc-name">${p.name}</h4>
          <div class="pc-footer">
            <div>
              <span class="pc-sale">Rs. ${p.salePrice.toLocaleString()}</span>
              ${p.origPrice ? `<span class="pc-orig">Rs.${p.origPrice.toLocaleString()}</span>` : ''}
            </div>
            <button class="pc-add-btn" onclick="addToCart(${p.id})" title="Add to cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>`;
  }).join('');
}

// ---- On page load ----
window.addEventListener('load', () => {
  // Hide loader
  setTimeout(() => document.getElementById('loader')?.classList.add('hidden'), 500);

  // Render all three sections
  renderCategory('keychainsGrid', 'keychain');
  renderCategory('flowersGrid',   'flower');
  renderCategory('othersGrid',    'other');

  // Scroll-triggered fade-in
  const obs = new IntersectionObserver(entries => {
    entries.forEach(ev => {
      if (ev.isIntersecting) {
        ev.target.classList.add('vis');
        obs.unobserve(ev.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade').forEach(el => obs.observe(el));
});

// ---- Hamburger menu ----
const ham    = document.getElementById('hamBtn');
const drawer = document.getElementById('mobileDrawer');
ham?.addEventListener('click', () => {
  ham.classList.toggle('open');
  drawer.classList.toggle('open');
});

// ---- Scroll events ----
window.addEventListener('scroll', () => {
  document.getElementById('scrollTop')?.classList.toggle('vis', window.scrollY > 400);
  document.querySelector('.topnav')?.classList.toggle('scrolled', window.scrollY > 40);
});

// ---- Scroll to top ----
document.getElementById('scrollTop')?.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' }));
