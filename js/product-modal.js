/**
 * VHL Global Industries — Product Catalogue & Modal System
 * - Dynamic Category Cards and Desktop Tabs from VHL_PRODUCTS
 * - Instant Live Search across 105+ products by name, category, price, applications
 * - Product cards with Name, Price/Unit, Packaging, Short Description, Applications & Quick Enquiry
 * - Branded PDF generation with complete price list and descriptions
 */

(function () {
  'use strict';

  // ── DOM References ──
  const tabsContainer = document.getElementById('prod-tabs');
  const panel         = document.getElementById('prod-panel');
  const panelTitle    = document.getElementById('prod-panel-title');
  const panelDesc     = document.getElementById('prod-panel-desc');
  const panelCount    = document.getElementById('prod-panel-count');
  const cardsGrid     = document.getElementById('prod-cards-grid');
  const catCardsGrid  = document.getElementById('cat-cards-grid');
  const productsSec   = document.getElementById('products');
  const backBtn       = document.getElementById('prod-back-btn');
  const mobileEnquireBtn = document.getElementById('mobile-enquire-btn');
  const pdfBtn        = document.getElementById('prod-pdf-btn');
  const enquireBtn    = document.getElementById('prod-enquire-btn');
  const searchInput   = document.getElementById('prod-search-input');
  const searchClear   = document.getElementById('prod-search-clear');
  const searchStats   = document.getElementById('prod-search-stats');
  const trendingTrack = document.getElementById('trending-products-track');

  let currentCategory = '';
  let isSearchActive = false;
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  if (!panel || typeof VHL_PRODUCTS === 'undefined') return;

  const reduceCatalogMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const catalogRevealObserver = !reduceCatalogMotion && 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          catalogRevealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' })
    : null;

  function revealCatalogCards(container, selector) {
    if (!container) return;
    container.querySelectorAll(selector).forEach((card, index) => {
      card.classList.add('catalog-reveal');
      card.style.setProperty('--catalog-reveal-delay', `${(index % 3) * 70}ms`);
      if (!catalogRevealObserver) {
        card.classList.add('is-visible');
      } else {
        catalogRevealObserver.observe(card);
      }
    });
  }

  function buildTrendingProducts() {
    if (!trendingTrack) return;
    const featured = Object.entries(VHL_PRODUCTS)
      .map(([category, data]) => ({ category, product: data.products[0] }))
      .filter(item => item.product);
    const cardContent = ({ category, product }) => `
        <span class="trending-product-category">${esc(category)}</span>
        <span class="trending-product-name">${esc(product.name)}</span>
        <span class="trending-product-bottom">
          <span class="trending-product-price">${esc(product.price)}</span>
          <span class="trending-product-link">Explore <span aria-hidden="true">→</span></span>
        </span>
    `;
    const accessibleCards = featured.map(item => `
      <button class="trending-product-card" type="button" data-category="${esc(item.category)}" aria-label="View ${esc(item.product.name)} in ${esc(item.category)}">
        ${cardContent(item)}
      </button>
    `).join('');
    const visualLoop = featured.map(item => `
      <div class="trending-product-card">${cardContent(item)}</div>
    `).join('');

    trendingTrack.innerHTML = `
      <div class="trending-products-segment">${accessibleCards}</div>
      <div class="trending-products-segment" aria-hidden="true">${visualLoop}</div>
    `;

    trendingTrack.querySelectorAll('.trending-product-card').forEach(card => {
      if (card.tagName === 'BUTTON') {
        card.addEventListener('click', () => openCategory(card.getAttribute('data-category')));
      }
    });
  }

  // Sync panel open class with products section
  function syncPanelState() {
    const panelShown = panel.style.display === 'block';
    if (productsSec) productsSec.classList.toggle('panel-open', panelShown);
    document.body.classList.toggle('products-open', panelShown && isMobile());
  }
  window.addEventListener('resize', syncPanelState);

  // ══════════════════════════════════════════
  // 1. RENDER DESKTOP TABS DYNAMICALLY
  // ══════════════════════════════════════════
  function buildDesktopTabs() {
    if (!tabsContainer) return;
    const categories = Object.keys(VHL_PRODUCTS);

    tabsContainer.innerHTML = categories.map(cat => {
      const data = VHL_PRODUCTS[cat];
      const icon = data.icon || '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/></svg>';
      return `
        <button class="prod-tab" role="tab" data-category="${esc(cat)}" aria-selected="false">
          ${icon}
          ${esc(cat)}
          <span class="prod-tab-count">${data.products.length}</span>
        </button>
      `;
    }).join('');

    // Attach click events
    tabsContainer.querySelectorAll('.prod-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const cat = tab.getAttribute('data-category');
        if (!cat) return;
        if (currentCategory === cat && panel.style.display !== 'none' && !isSearchActive) {
          showAllCategories();
          return;
        }
        openCategory(cat);
      });
    });
  }

  // ══════════════════════════════════════════
  // 2. RENDER CATEGORY CARDS
  // ══════════════════════════════════════════
  function buildCategoryCards() {
    if (!catCardsGrid) return;
    const categories = Object.keys(VHL_PRODUCTS);

    catCardsGrid.innerHTML = categories.map(cat => {
      const data = VHL_PRODUCTS[cat];
      if (!data) return '';
      const icon = data.icon || '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/></svg>';
      
      const previews = data.products.slice(0, 3).map(p => `
        <li>
          <span class="preview-pname" title="${esc(p.name)}">${esc(p.name)}</span>
          <span class="preview-price">${esc(p.price)}</span>
        </li>
      `).join('');

      return `
        <div class="cat-card" role="button" tabindex="0" data-category="${esc(cat)}" aria-label="View ${esc(cat)} products">
          <div class="cat-card-header">
            <span class="cat-card-icon" aria-hidden="true">${icon}</span>
            <div>
              <h3 class="cat-card-title">${esc(cat)}</h3>
              <span class="cat-card-count">${data.products.length} Products</span>
            </div>
          </div>
          <ul class="cat-preview-list">${previews}</ul>
          <button type="button" class="cat-view-btn">
            View All ${data.products.length} Products
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
      `;
    }).join('');

    revealCatalogCards(catCardsGrid, '.cat-card');

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
  // 3. OPEN CATEGORY (DISPLAY PRODUCTS)
  // ══════════════════════════════════════════
  function openCategory(category, options = {}) {
    const data = VHL_PRODUCTS[category];
    if (!data) return;

    currentCategory = category;
    isSearchActive = false;

    // Reset search bar value if category explicitly chosen
    if (searchInput && options.fromSearch !== true) {
      searchInput.value = '';
      if (searchClear) searchClear.style.display = 'none';
      if (searchStats) searchStats.style.display = 'none';
    }

    // Update panel toolbar
    panelTitle.textContent = category;
    panelDesc.textContent  = data.description;
    panelCount.textContent = data.products.length + ' Products';
    if (pdfBtn) pdfBtn.style.display = 'inline-flex';

    // Render product item cards
    cardsGrid.innerHTML = data.products.map((p, i) => renderProductCard(p, i, category)).join('');
    revealCatalogCards(cardsGrid, '.prod-item-card');

    // Attach enquire button handlers for individual cards
    attachCardEnquireButtons();

    // Show panel
    panel.style.display = 'block';
    syncPanelState();

    // Update tab / card selected states
    if (tabsContainer) {
      tabsContainer.querySelectorAll('.prod-tab').forEach(t => {
        const isSame = t.getAttribute('data-category') === category;
        t.setAttribute('aria-selected', isSame ? 'true' : 'false');
      });
    }
    if (catCardsGrid) {
      catCardsGrid.querySelectorAll('.cat-card').forEach(c => {
        c.classList.toggle('cat-active', c.getAttribute('data-category') === category);
      });
    }

    // Scroll panel into view smoothly
    if (options.scroll !== false) {
      setTimeout(() => {
        const rect = panel.getBoundingClientRect();
        const top  = window.pageYOffset + rect.top - 85;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }, 60);
    }
  }

  // ══════════════════════════════════════════
  // 4. CARD HTML BUILDER
  // ══════════════════════════════════════════
  function renderProductVisual(p, index, catName) {
    const productToken = `${catName}-${p.name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
    const gradientId = `product-pack-${index}-${productToken}`;
    const palette = [
      ['#1d4ed8', '#60a5fa', '#dbeafe'],
      ['#0f766e', '#34d399', '#d1fae5'],
      ['#b45309', '#fbbf24', '#fef3c7'],
      ['#6d28d9', '#a78bfa', '#ede9fe']
    ][Array.from(productToken).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 4];
    const packageText = (p.packaging || 'Product pack').toLowerCase();
    let packageShape;

    if (packageText.includes('bag')) {
      packageShape = `
        <path d="M49 35h42l10 91H39l10-91Z" fill="url(#${gradientId})" stroke="${palette[0]}" stroke-width="2"/>
        <path d="M49 35l6-11h30l6 11M43 113h54" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="3" stroke-linecap="round"/>
        <rect x="48" y="62" width="44" height="31" rx="4" fill="#fff" opacity=".94"/>
        <text x="70" y="76" text-anchor="middle" fill="${palette[0]}" font-size="8" font-weight="800">VHL</text>
        <path d="M56 82h28" stroke="${palette[1]}" stroke-width="2" stroke-linecap="round"/>`;
    } else if (/bottle|carboy|can|pail|container/.test(packageText)) {
      packageShape = `
        <path d="M58 25h24v14l11 9v68a10 10 0 0 1-10 10H55a10 10 0 0 1-10-10V48l13-9V25Z" fill="url(#${gradientId})" stroke="${palette[0]}" stroke-width="2"/>
        <path d="M61 25v-8h18v8M49 53h42" fill="none" stroke="rgba(255,255,255,.62)" stroke-width="3" stroke-linecap="round"/>
        <rect x="51" y="65" width="38" height="31" rx="4" fill="#fff" opacity=".95"/>
        <text x="70" y="79" text-anchor="middle" fill="${palette[0]}" font-size="8" font-weight="800">VHL</text>
        <path d="M58 85h24" stroke="${palette[1]}" stroke-width="2" stroke-linecap="round"/>`;
    } else {
      packageShape = `
        <rect x="37" y="33" width="66" height="88" rx="13" fill="url(#${gradientId})" stroke="${palette[0]}" stroke-width="2"/>
        <path d="M40 48h60M40 104h60M51 32v90M89 32v90" fill="none" stroke="rgba(255,255,255,.36)" stroke-width="3"/>
        <path d="M48 28h44v9H48z" rx="4" fill="${palette[0]}"/>
        <rect x="48" y="62" width="44" height="29" rx="4" fill="#fff" opacity=".95"/>
        <text x="70" y="75" text-anchor="middle" fill="${palette[0]}" font-size="8" font-weight="800">VHL</text>
        <path d="M56 82h28" stroke="${palette[1]}" stroke-width="2" stroke-linecap="round"/>`;
    }

    return `
      <div class="prod-item-visual" role="img" aria-label="Packaging illustration for ${esc(p.name)}" style="--product-accent:${palette[2]}">
        <span class="prod-visual-kicker">VHL TEXTILE CHEMICALS</span>
        <span class="prod-visual-pack">${esc(p.packaging || 'Product pack')}</span>
        <svg viewBox="0 0 140 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <defs><linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${palette[1]}"/><stop offset="1" stop-color="${palette[0]}"/></linearGradient></defs>
          <ellipse cx="70" cy="130" rx="42" ry="7" fill="${palette[0]}" opacity=".12"/>
          ${packageShape}
        </svg>
      </div>
    `;
  }

  function renderProductCard(p, index, catName, showCategoryBadge = false) {
    const catBadge = showCategoryBadge
      ? `<span class="prod-tag prod-tag-category">${esc(catName)}</span>`
      : '';

    return `
      <div class="prod-item-card" data-product-name="${esc(p.name)}">
        <span class="prod-item-num">#${index + 1}</span>
        ${renderProductVisual(p, index, catName)}
        <div class="prod-item-name">${esc(p.name)}</div>
        <div class="prod-item-tags">
          <span class="prod-tag prod-tag-price">${esc(p.price)}</span>
          <span class="prod-tag prod-tag-pack">${esc(p.packaging)}</span>
          ${catBadge}
        </div>
        <p class="prod-item-desc">${esc(p.description)}</p>
        <div class="prod-item-uses"><strong>Applications:</strong> ${esc(p.uses)}</div>
        <div class="prod-item-footer">
          <button type="button" class="prod-card-enquire-btn" data-product="${esc(p.name)}" data-category="${esc(catName)}" data-price="${esc(p.price)}">
            Enquire
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    `;
  }

  // Attach quick quote / enquire click to cards
  function attachCardEnquireButtons() {
    cardsGrid.querySelectorAll('.prod-card-enquire-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pName = btn.getAttribute('data-product');
        const pCat  = btn.getAttribute('data-category');
        const pPrice = btn.getAttribute('data-price');
        triggerProductEnquiry(pName, pCat, pPrice);
      });
    });
  }

  // ══════════════════════════════════════════
  // 5. ENQUIRE DISPATCHER
  // ══════════════════════════════════════════
  function triggerProductEnquiry(productName, category, price) {
    if (window.preselectProductCategory && category) {
      window.preselectProductCategory(category);
    }
    const messageInput = document.getElementById('message');
    if (messageInput) {
      const priceText = price && price !== 'Price on Request' ? ` (${price})` : '';
      messageInput.value = `Hello VHL Team, I am interested in purchasing ${productName}${priceText}. Please share the current pricing, delivery timeline, and minimum order quantity.`;
      messageInput.focus();
    }
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const top = window.pageYOffset + contactSection.getBoundingClientRect().top - 88;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  }

  // Category toolbar enquiry button
  if (enquireBtn) {
    enquireBtn.addEventListener('click', () => {
      triggerProductEnquiry(currentCategory ? `${currentCategory} range` : 'Textile Chemicals', currentCategory, '');
    });
  }

  if (mobileEnquireBtn && enquireBtn) {
    mobileEnquireBtn.addEventListener('click', () => enquireBtn.click());
  }

  // ══════════════════════════════════════════
  // 6. BACK TO CATEGORIES
  // ══════════════════════════════════════════
  function showAllCategories() {
    panel.style.display = 'none';
    currentCategory = '';
    isSearchActive = false;
    syncPanelState();

    if (tabsContainer) {
      tabsContainer.querySelectorAll('.prod-tab').forEach(t => t.setAttribute('aria-selected', 'false'));
    }
    if (catCardsGrid) {
      catCardsGrid.querySelectorAll('.cat-card').forEach(c => c.classList.remove('cat-active'));
    }
    if (searchInput) {
      searchInput.value = '';
      if (searchClear) searchClear.style.display = 'none';
      if (searchStats) searchStats.style.display = 'none';
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
  // 7. LIVE PRODUCT SEARCH
  // ══════════════════════════════════════════
  function handleSearch(query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) {
      if (searchClear) searchClear.style.display = 'none';
      if (searchStats) searchStats.style.display = 'none';
      if (isSearchActive) {
        showAllCategories();
      }
      return;
    }

    if (searchClear) searchClear.style.display = 'block';
    isSearchActive = true;

    // Collect all matching products across all categories
    const results = [];
    Object.keys(VHL_PRODUCTS).forEach(cat => {
      const catData = VHL_PRODUCTS[cat];
      catData.products.forEach(p => {
        const matchName = p.name.toLowerCase().includes(q);
        const matchCat  = cat.toLowerCase().includes(q);
        const matchDesc = (p.description || '').toLowerCase().includes(q);
        const matchUses = (p.uses || '').toLowerCase().includes(q);
        const matchPrice = (p.price || '').toLowerCase().includes(q);
        if (matchName || matchCat || matchDesc || matchUses || matchPrice) {
          results.push({ product: p, category: cat });
        }
      });
    });

    // Update panel toolbar for search results
    panelTitle.textContent = `Search Results for "${query}"`;
    panelDesc.textContent  = `Showing chemicals and auxiliaries matching your query across all 16 categories.`;
    panelCount.textContent = `${results.length} Found`;
    if (pdfBtn) pdfBtn.style.display = 'none'; // PDF only for individual category

    if (results.length > 0) {
      cardsGrid.innerHTML = results.map((r, i) => renderProductCard(r.product, i, r.category, true)).join('');
      revealCatalogCards(cardsGrid, '.prod-item-card');
      attachCardEnquireButtons();
    } else {
      cardsGrid.innerHTML = `
        <div class="prod-no-results">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <h4>No products found matching "${esc(query)}"</h4>
          <p>Please check the spelling or explore our categories below.</p>
          <button type="button" class="btn-primary prod-reset-search-btn" id="prod-reset-search-btn">View All Categories</button>
        </div>
      `;
      const resetBtn = document.getElementById('prod-reset-search-btn');
      if (resetBtn) resetBtn.addEventListener('click', showAllCategories);
    }

    if (searchStats) {
      searchStats.textContent = `Found ${results.length} product${results.length === 1 ? '' : 's'}`;
      searchStats.style.display = 'block';
    }

    panel.style.display = 'block';
    syncPanelState();
  }

  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => handleSearch(e.target.value), 220);
    });

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        handleSearch('');
        searchInput.focus();
      });
    }
  }

  // ══════════════════════════════════════════
  // 8. DOWNLOAD PDF CATALOGUE (CATEGORY SPECIFIC)
  // ══════════════════════════════════════════
  if (pdfBtn) {
    pdfBtn.addEventListener('click', () => {
      const data = VHL_PRODUCTS[currentCategory];
      if (!data) return;

      let el = document.getElementById('vhl-print-area');
      if (el) el.remove();

      const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

      const rows = data.products.map((p, i) => `
        <tr>
          <td style="text-align:center;">${i + 1}</td>
          <td><strong>${esc(p.name)}</strong></td>
          <td style="color:#047857;font-weight:700;white-space:nowrap;">${esc(p.price)}</td>
          <td>${esc(p.packaging)}</td>
          <td style="color:#333;font-size:7.5pt;">${esc(p.description)}</td>
          <td style="color:#555;font-size:7.5pt;">${esc(p.uses)}</td>
        </tr>
      `).join('');

      el = document.createElement('div');
      el.id = 'vhl-print-area';
      el.style.display = 'none';
      el.innerHTML = `
        <div class="vhl-print-header">
          <svg viewBox="0 0 40 40" width="52" height="52" style="flex-shrink:0">
            <circle cx="20" cy="20" r="18" fill="#203a5c"/>
            <path d="M4 20a16 16 0 0 0 32 0c-6 4-14 5-22 1-4-2-7-2-10-1Z" fill="#3b82f6"/>
            <ellipse cx="20" cy="20" rx="7" ry="18" fill="none" stroke-width="1.5" stroke="rgba(255,255,255,0.7)"/>
            <path d="M2 20h36M6 11h28" stroke-width="1.5" stroke="rgba(255,255,255,0.7)" fill="none"/>
          </svg>
          <div>
            <div class="vhl-print-company">VHL GLOBAL INDUSTRIES &nbsp;·&nbsp; Ahmedabad, Gujarat, India</div>
            <div class="vhl-print-cat">${esc(currentCategory)} — Price &amp; Product Catalogue</div>
          </div>
        </div>
        <div class="vhl-print-desc">${esc(data.description)} &nbsp;·&nbsp; <strong>${data.products.length} Products</strong> &nbsp;·&nbsp; Generated: ${today}</div>
        <table class="vhl-print-table">
          <thead>
            <tr>
              <th style="width:30px;text-align:center;">#</th>
              <th style="width:160px;">Product Name</th>
              <th style="width:90px;">Price (INR)</th>
              <th style="width:110px;">Packaging</th>
              <th>Description</th>
              <th>Applications</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="vhl-print-footer">
          <span><strong>VHL Global Industries</strong> · labanaharshad@gmail.com · +91 87585 99805</span>
          <span>Prices and packaging subject to standard terms &amp; conditions. Contact us for bulk orders.</span>
        </div>
      `;
      document.body.appendChild(el);
      window.print();
      setTimeout(() => el && el.remove(), 2500);
    });
  }

  // ══════════════════════════════════════════
  // 9. HEADER DROPDOWN & FOOTER CATEGORY LINKS
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
          setTimeout(() => {
            if (cat && VHL_PRODUCTS[cat]) openCategory(cat);
          }, 350);
        });
      });
    });
  }

  // Helper escape
  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Expose openCategory globally
  window.vhlOpenCategory = openCategory;

  // ══════════════════════════════════════════
  // 10. INITIALIZATION
  // ══════════════════════════════════════════
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      buildDesktopTabs();
      buildTrendingProducts();
      buildCategoryCards();
      attachNavLinks();
    });
  } else {
    buildDesktopTabs();
    buildTrendingProducts();
    buildCategoryCards();
    attachNavLinks();
  }

})();
