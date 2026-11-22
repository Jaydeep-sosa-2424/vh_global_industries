/**
 * VHL Global Industries — Product Tabs & Cards System
 * - Category tab bar at top
 * - Clicking a tab shows product cards grid below (no popup)
 * - Each card shows: name, CAS, purity, packaging, uses
 * - Download PDF generates a branded category PDF
 */

(function () {
  'use strict';

  // ── References ──
  const tabs        = document.querySelectorAll('.prod-tab');
  const panel       = document.getElementById('prod-panel');
  const panelTitle  = document.getElementById('prod-panel-title');
  const panelDesc   = document.getElementById('prod-panel-desc');
  const panelCount  = document.getElementById('prod-panel-count');
  const cardsGrid   = document.getElementById('prod-cards-grid');
  const catCardsGrid = document.getElementById('cat-cards-grid');
  const productsSec = document.getElementById('products');
  const backBtn     = document.getElementById('prod-back-btn');
  const pdfBtn      = document.getElementById('prod-pdf-btn');
  const enquireBtn  = document.getElementById('prod-enquire-btn');

  let currentCategory = '';
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  if (!panel || !tabs.length) return;

  // ══════════════════════════════════════════
  // 1. OPEN CATEGORY (show cards)
  // ══════════════════════════════════════════
  function openCategory(category) {
    const data = VHL_PRODUCTS[category];
    if (!data) return;

    currentCategory = category;

    // Update toolbar
    panelTitle.textContent = category;
    panelDesc.textContent  = data.description;
    panelCount.textContent = data.products.length + ' Products';

    // Build product cards
    cardsGrid.innerHTML = data.products.map((p, i) => `
      <div class="prod-item-card">
        <span class="prod-item-num">#${i + 1}</span>
        <div class="prod-item-name">${esc(p.name)}</div>
        <div class="prod-item-cas">CAS: ${esc(p.cas)}</div>
        <div class="prod-item-tags">
          <span class="prod-tag prod-tag-purity">${esc(p.purity)}</span>
          <span class="prod-tag prod-tag-pack">${esc(p.packaging)}</span>
        </div>
        <div class="prod-item-uses"><strong>Uses:</strong> ${esc(p.uses)}</div>
      </div>
    `).join('');

    // Show panel (on mobile the cards give way to the opened category)
    panel.style.display = 'block';
    if (isMobile() && productsSec) productsSec.classList.add('panel-open');

    // Update tab / card selected states
    tabs.forEach(t => {
      const isSame = t.getAttribute('data-category') === category;
      t.setAttribute('aria-selected', isSame ? 'true' : 'false');
    });
    if (catCardsGrid) {
      catCardsGrid.querySelectorAll('.cat-card').forEach(c => {
        c.classList.toggle('cat-active', c.getAttribute('data-category') === category);
      });
    }

    // Scroll panel into view
    setTimeout(() => {
      const rect = panel.getBoundingClientRect();
      const top  = window.pageYOffset + rect.top - 90;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, 60);
  }

  // ══════════════════════════════════════════
  // 2. TAB CLICK HANDLER
  // ══════════════════════════════════════════
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.getAttribute('data-category');
      if (!cat) return;

      // Toggle: click same tab → close
      if (currentCategory === cat && panel.style.display !== 'none') {
        showAllCategories();
        return;
      }
      openCategory(cat);
    });
  });

  // ══════════════════════════════════════════
  // 2b. BACK TO CATEGORY CARDS (mobile)
  // ══════════════════════════════════════════
  function showAllCategories() {
    panel.style.display = 'none';
    currentCategory = '';
    if (productsSec) productsSec.classList.remove('panel-open');
    tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
    if (catCardsGrid) {
      catCardsGrid.querySelectorAll('.cat-card').forEach(c => c.classList.remove('cat-active'));
    }
    setTimeout(() => {
      const target = catCardsGrid || productsSec;
      if (!target) return;
      const top = window.pageYOffset + target.getBoundingClientRect().top - 90;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, 60);
  }

  if (backBtn) backBtn.addEventListener('click', showAllCategories);

  // ══════════════════════════════════════════
  // 2c. CATEGORY CARDS (mobile)
  // ══════════════════════════════════════════
  function buildCategoryCards() {
    if (!catCardsGrid) return;

    catCardsGrid.innerHTML = Array.from(tabs).map(tab => {
      const cat = tab.getAttribute('data-category');
      const data = VHL_PRODUCTS[cat];
      if (!data) return '';
      const icon = tab.querySelector('svg')?.outerHTML || '';
      const previews = data.products.slice(0, 3).map(p => `<li>${esc(p.name)}</li>`).join('');

      return `
        <div class="cat-card" role="button" tabindex="0" data-category="${esc(cat)}" aria-label="View ${esc(cat)} products">
          <div class="cat-card-header">
            <span class="cat-card-icon" aria-hidden="true">${icon}</span>
            <div>
              <h3 class="cat-card-title">${esc(cat)}</h3>
              <span class="cat-card-count">${data.products.length} products</span>
            </div>
          </div>
          <ul class="cat-preview-list">${previews}</ul>
          <button type="button" class="cat-view-btn">View Products
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>`;
    }).join('');

    catCardsGrid.querySelectorAll('.cat-card').forEach(card => {
      const open = () => openCategory(card.getAttribute('data-category'));
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      });
    });
  }

  // ══════════════════════════════════════════
  // 3. ENQUIRE NOW
  // ══════════════════════════════════════════
  enquireBtn.addEventListener('click', () => {
    if (window.preselectProductCategory) {
      window.preselectProductCategory(currentCategory);
    }
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const top = window.pageYOffset + contactSection.getBoundingClientRect().top - 88;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  });

  // ══════════════════════════════════════════
  // 4. DOWNLOAD PDF
  // ══════════════════════════════════════════
  pdfBtn.addEventListener('click', () => {
    const data = VHL_PRODUCTS[currentCategory];
    if (!data) return;

    let el = document.getElementById('vhl-print-area');
    if (el) el.remove();

    const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

    const rows = data.products.map((p, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${esc(p.name)}</strong></td>
        <td style="font-family:monospace;color:#553c9a;font-size:7.5pt">${esc(p.cas)}</td>
        <td style="color:#276749;font-weight:600">${esc(p.purity)}</td>
        <td>${esc(p.packaging)}</td>
        <td style="color:#555">${esc(p.uses)}</td>
      </tr>`).join('');

    el = document.createElement('div');
    el.id = 'vhl-print-area';
    el.style.display = 'none';
    el.innerHTML = `
      <div class="vhl-print-header">
        <svg viewBox="0 0 40 40" width="52" height="52" style="flex-shrink:0">
          <circle cx="20" cy="20" r="18" fill="#203a5c"/>
          <path d="M4 20a16 16 0 0 0 32 0c-6 4-14 5-22 1-4-2-7-2-10-1Z" fill="#38a169"/>
          <ellipse cx="20" cy="20" rx="7" ry="18" fill="none" stroke-width="1.5" stroke="rgba(255,255,255,0.7)"/>
          <path d="M2 20h36M6 11h28" stroke-width="1.5" stroke="rgba(255,255,255,0.7)" fill="none"/>
        </svg>
        <div>
          <div class="vhl-print-company">VHL GLOBAL INDUSTRIES &nbsp;·&nbsp; Ahmedabad, Gujarat, India</div>
          <div class="vhl-print-cat">${esc(currentCategory)} — Product Catalogue</div>
        </div>
      </div>
      <div class="vhl-print-desc">${esc(data.description)} &nbsp;·&nbsp; <strong>${data.products.length} products</strong> &nbsp;·&nbsp; ${today}</div>
      <table class="vhl-print-table">
        <thead>
          <tr><th>#</th><th>Product Name</th><th>CAS Number</th><th>Purity / Grade</th><th>Packaging</th><th>Applications</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="vhl-print-footer">
        <span><strong>VHL Global Industries</strong> · info@vhlglobal.in · +91 87585 99805</span>
        <span>Specifications subject to change. Contact us for pricing &amp; availability.</span>
      </div>`;
    document.body.appendChild(el);
    window.print();
    setTimeout(() => el && el.remove(), 2000);
  });

  // ══════════════════════════════════════════
  // 5. DROPDOWN & FOOTER NAV LINKS → open tab
  // ══════════════════════════════════════════
  function attachNavLinks() {
    const selectors = ['.dropdown-item[data-category]', '.footer-product-link[data-category]'];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        const newEl = el.cloneNode(true);
        el.parentNode.replaceChild(newEl, el);
        newEl.addEventListener('click', e => {
          e.preventDefault();
          const cat = newEl.getAttribute('data-category');
          // close mobile menu
          document.querySelector('.mobile-menu')?.classList.remove('active');
          document.body.classList.remove('overflow-hidden');
          // scroll to products
          const sec = document.getElementById('products');
          if (sec) {
            const top = window.pageYOffset + sec.getBoundingClientRect().top - 88;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
          }
          setTimeout(() => { if (cat && VHL_PRODUCTS[cat]) openCategory(cat); }, 400);
        });
      });
    });
  }

  // ══════════════════════════════════════════
  // 6. HELPER
  // ══════════════════════════════════════════
  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ══════════════════════════════════════════
  // 7. INIT
  // ══════════════════════════════════════════
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachNavLinks);
  } else {
    attachNavLinks();
  }

  buildCategoryCards();

  // On desktop keep the first category open; on mobile show the category cards first
  if (!isMobile()) {
    const firstCat = tabs[0]?.getAttribute('data-category');
    if (firstCat && VHL_PRODUCTS[firstCat]) openCategory(firstCat);
  }

})();
