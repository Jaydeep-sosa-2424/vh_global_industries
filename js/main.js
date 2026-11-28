/**
 * VHL Global Industries - Main JavaScript
 * Single-page application script handling navigation, mobile menu,
 * accessibility, product selection, form validation, scroll interactions,
 * and scroll-triggered animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================
  // CONSTANTS & CONFIGURATION
  // ==========================================
  const HEADER_OFFSET = 80; // 64px header + 16px buffer
  const WHATSAPP_PHONE = '918758599805';
  const CONTACT_EMAIL = 'labanaharshad@gmail.com';

  // DOM Elements
  const siteHeader = document.querySelector('.site-header');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const productsDropdown = document.querySelector('.products-dropdown');
  const dropdownMenu = productsDropdown ? productsDropdown.querySelector('.dropdown-menu') : null;
  const dropdownToggle = productsDropdown ? productsDropdown.querySelector('.dropdown-trigger, a.nav-link') : null;
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  const footerProductLinks = document.querySelectorAll('.footer-product-link');
  const productCards = document.querySelectorAll('.product-card');
  const scrollTopBtn = document.querySelector('.scroll-top');
  const inquiryForm = document.getElementById('inquiry-form');
  const emailOpenStatus = document.getElementById('email-open-status');
  const whatsappBtn = document.getElementById('whatsapp-btn');
  const footerYear = document.getElementById('footer-year');

  // Form Fields
  const nameInput = document.getElementById('name');
  const companyInput = document.getElementById('company');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const productSelect = document.getElementById('product');
  const quantityInput = document.getElementById('quantity');
  const messageInput = document.getElementById('message');

  // Set current year in footer if element exists
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // ==========================================
  // 1. SMOOTH SCROLLING HELPER
  // ==========================================
  /**
   * Scrolls smoothly to a target element or coordinate, taking header offset into account.
   * @param {HTMLElement|number} target - The element or Y-coordinate to scroll to.
   */
  function smoothScrollTo(target) {
    let targetTop = 0;

    if (typeof target === 'number') {
      targetTop = target;
    } else if (target && typeof target.getBoundingClientRect === 'function') {
      const rect = target.getBoundingClientRect();
      targetTop = window.pageYOffset + rect.top - HEADER_OFFSET;
    }

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth'
    });
  }

  /**
   * Global click handler for anchor links with hash href.
   */
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');

    // Ignore empty hashes or javascript links
    if (!href || href === '#' || href === '#!') {
      e.preventDefault();
      return;
    }

    const targetElement = document.querySelector(href);
    if (targetElement) {
      e.preventDefault();

      // Close mobile menu if currently open
      closeMobileMenu();

      // Close products dropdown if open
      closeProductsDropdown();

      // Scroll to target element with header offset
      smoothScrollTo(targetElement);

      // Update URL hash without causing an instant scroll jump
      if (history.pushState) {
        history.pushState(null, '', href);
      }
    }
  });

  // Refresh should start at the top, not jump back to a section hash.
  // Direct links that open the page fresh still honour their hash.
  const navType = performance.getEntriesByType?.('navigation')[0]?.type;
  if (navType === 'reload') {
    if (history.replaceState) {
      history.replaceState(null, '', location.pathname + location.search);
    }
    const goToTop = () => {
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      document.documentElement.style.scrollBehavior = '';
    };
    goToTop();
    // Re-assert after the browser finishes its own hash/scroll restoration
    window.addEventListener('load', () => setTimeout(goToTop, 120), { once: true });
    setTimeout(goToTop, 300);
  } else if (window.location.hash) {
    // Handle direct navigation with hash on page load
    const initialTarget = document.querySelector(window.location.hash);
    if (initialTarget) {
      setTimeout(() => {
        smoothScrollTo(initialTarget);
      }, 150);
    }
  }

  // ==========================================
  // 2. MOBILE MENU
  // ==========================================
  /**
   * Opens the mobile menu and updates accessibility attributes.
   */
  function openMobileMenu() {
    if (mobileMenu) {
      mobileMenu.classList.add('active');
      mobileMenu.setAttribute('aria-hidden', 'false');
    }
    if (mobileMenuOverlay) {
      mobileMenuOverlay.classList.add('active');
    }
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.classList.add('overflow-hidden');
  }

  /**
   * Closes the mobile menu and restores body scrolling.
   */
  function closeMobileMenu() {
    if (mobileMenu) {
      mobileMenu.classList.remove('active');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
    if (mobileMenuOverlay) {
      mobileMenuOverlay.classList.remove('active');
    }
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('overflow-hidden');
  }

  /**
   * Toggles the mobile menu open/closed state.
   */
  function toggleMobileMenu() {
    const isOpen = mobileMenu && mobileMenu.classList.contains('active');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMobileMenu();
    });
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
    });
  }

  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', () => {
      closeMobileMenu();
    });
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // ==========================================
  // 3. PRODUCTS DROPDOWN (DESKTOP ACCESSIBILITY)
  // ==========================================
  /**
   * Closes the products desktop dropdown menu.
   */
  function closeProductsDropdown() {
    if (productsDropdown) {
      productsDropdown.classList.remove('open', 'active');
      if (dropdownToggle) {
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    }
  }

  /**
   * Opens the products desktop dropdown menu.
   */
  function openProductsDropdown() {
    if (productsDropdown) {
      productsDropdown.classList.add('open', 'active');
      if (dropdownToggle) {
        dropdownToggle.setAttribute('aria-expanded', 'true');
      }
    }
  }

  if (productsDropdown && dropdownToggle) {
    dropdownToggle.setAttribute('aria-haspopup', 'true');
    dropdownToggle.setAttribute('aria-expanded', 'false');

    // Keyboard support for opening/toggling
    productsDropdown.addEventListener('keydown', (e) => {
      const isOpen = productsDropdown.classList.contains('open') || productsDropdown.classList.contains('active');

      if (e.key === 'Enter' || e.key === ' ') {
        // Only trigger toggle if focus is directly on the dropdown trigger link
        if (document.activeElement === dropdownToggle) {
          e.preventDefault();
          if (isOpen) {
            closeProductsDropdown();
          } else {
            openProductsDropdown();
            // Move focus to first dropdown item
            if (dropdownMenu) {
              const firstItem = dropdownMenu.querySelector('.dropdown-item, a, button');
              if (firstItem) firstItem.focus();
            }
          }
        }
      } else if (e.key === 'Escape') {
        if (isOpen) {
          e.preventDefault();
          closeProductsDropdown();
          dropdownToggle.focus();
        }
      } else if (e.key === 'ArrowDown') {
        if (isOpen && dropdownMenu) {
          const items = Array.from(dropdownMenu.querySelectorAll('.dropdown-item, a, button'));
          const currentIndex = items.indexOf(document.activeElement);
          if (currentIndex < items.length - 1) {
            e.preventDefault();
            items[currentIndex + 1].focus();
          }
        }
      } else if (e.key === 'ArrowUp') {
        if (isOpen && dropdownMenu) {
          const items = Array.from(dropdownMenu.querySelectorAll('.dropdown-item, a, button'));
          const currentIndex = items.indexOf(document.activeElement);
          if (currentIndex > 0) {
            e.preventDefault();
            items[currentIndex - 1].focus();
          } else if (currentIndex === 0) {
            e.preventDefault();
            dropdownToggle.focus();
          }
        }
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!productsDropdown.contains(e.target)) {
        closeProductsDropdown();
      }
    });
  }

  // Global Escape key handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
      closeProductsDropdown();
    }
  });

  // ==========================================
  // 4. PRODUCT CARD CLICK
  // ==========================================
  /**
   * Helper to set product select option by category string.
   * @param {string} category
   */
  function preselectProductCategory(category) {
    if (!productSelect || !category) return;

    let matched = false;
    const categoryLower = category.trim().toLowerCase();

    for (let i = 0; i < productSelect.options.length; i++) {
      const option = productSelect.options[i];
      const optVal = option.value.trim().toLowerCase();
      const optText = option.text.trim().toLowerCase();

      if (optVal === categoryLower || optText === categoryLower) {
        productSelect.selectedIndex = i;
        matched = true;
        break;
      }
    }

    if (matched) {
      productSelect.dispatchEvent(new Event('change', { bubbles: true }));
      clearFieldError(productSelect);
    }
  }

  // When a .product-card is clicked, scroll to #contact and pre-select category
  productCards.forEach((card) => {
    card.addEventListener('click', () => {
      const category = card.getAttribute('data-category');
      if (category) {
        preselectProductCategory(category);
      }

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        smoothScrollTo(contactSection);
        if (history.pushState) {
          history.pushState(null, '', '#contact');
        }
      }
    });
  });

  // ==========================================
  // 5. DROPDOWN ITEM & FOOTER CATEGORY CLICK
  // ==========================================
  /**
   * Handles clicks on dropdown items and footer product links:
   * scrolls to the #products section and closes any open menus.
   */
  function handleProductNavigation(e) {
    e.preventDefault();
    closeMobileMenu();
    closeProductsDropdown();

    const productsSection = document.getElementById('products');
    if (productsSection) {
      smoothScrollTo(productsSection);
      if (history.pushState) {
        history.pushState(null, '', '#products');
      }
    }
  }

  dropdownItems.forEach((item) => {
    item.addEventListener('click', handleProductNavigation);
  });

  footerProductLinks.forEach((link) => {
    link.addEventListener('click', handleProductNavigation);
  });

  // ==========================================
  // 6. ACTIVE NAV HIGHLIGHTING
  // ==========================================
  const sectionIds = ['home', 'products', 'about', 'industries', 'quality', 'contact'];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((el) => el !== null);

  /**
   * Sets active class on nav links matching the current section id.
   * @param {string} currentId
   */
  function setActiveNavLink(currentId) {
    if (!currentId) return;

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileNavLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Use IntersectionObserver with multiple thresholds for reliable section tracking
  if ('IntersectionObserver' in window && sections.length > 0) {
    const sectionVisibilityMap = new Map();

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            sectionVisibilityMap.set(entry.target.id, entry.intersectionRatio);
          } else {
            sectionVisibilityMap.delete(entry.target.id);
          }
        });

        // Determine which section currently has the largest visible ratio
        let highestRatio = -1;
        let mostVisibleSectionId = '';

        sectionVisibilityMap.forEach((ratio, id) => {
          if (ratio > highestRatio) {
            highestRatio = ratio;
            mostVisibleSectionId = id;
          }
        });

        // Scroll edge cases: Top of page & Bottom of page
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollY < 120) {
          mostVisibleSectionId = 'home';
        } else if (scrollY + windowHeight >= documentHeight - 60) {
          mostVisibleSectionId = 'contact';
        }

        if (mostVisibleSectionId) {
          setActiveNavLink(mostVisibleSectionId);
        }
      },
      {
        root: null,
        rootMargin: '-80px 0px -40% 0px',
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0]
      }
    );

    sections.forEach((sec) => sectionObserver.observe(sec));
  } else {
    // Fallback scroll listener if IntersectionObserver is unavailable
    window.addEventListener(
      'scroll',
      () => {
        const scrollPosition = window.pageYOffset + HEADER_OFFSET + 100;
        let currentSectionId = 'home';

        sections.forEach((sec) => {
          if (scrollPosition >= sec.offsetTop) {
            currentSectionId = sec.id;
          }
        });

        setActiveNavLink(currentSectionId);
      },
      { passive: true }
    );
  }

  // ==========================================
  // 7. SCROLL TO TOP BUTTON
  // ==========================================
  function handleScrollTopVisibility() {
    if (!scrollTopBtn) return;
    if (window.pageYOffset > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 8. CONTACT FORM VALIDATION & SUBMISSION
  // ==========================================
  /**
   * Clears the error state from a form field.
   * @param {HTMLElement} field
   */
  function clearFieldError(field) {
    if (!field) return;
    field.classList.remove('error');
    const formGroup = field.closest('.form-group');
    if (formGroup) {
      const errorMsg = formGroup.querySelector('.error-message');
      if (errorMsg) {
        errorMsg.classList.remove('visible');
      }
    }
  }

  /**
   * Marks a form field as invalid and displays its error message.
   * @param {HTMLElement} field
   */
  function showFieldError(field) {
    if (!field) return;
    field.classList.add('error');
    const formGroup = field.closest('.form-group');
    if (formGroup) {
      const errorMsg = formGroup.querySelector('.error-message');
      if (errorMsg) {
        errorMsg.classList.add('visible');
      }
    }
  }

  /**
   * Validates email address using standard RFC pattern.
   * @param {string} email
   * @returns {boolean}
   */
  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailPattern.test(email);
  }

  /**
   * Validates phone number (must contain at least 10 digits).
   * @param {string} phone
   * @returns {boolean}
   */
  function isValidPhone(phone) {
    if (!phone) return false;
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 10;
  }

  // Clear validation errors dynamically on user input or change
  const formFields = [
    nameInput,
    companyInput,
    emailInput,
    phoneInput,
    productSelect,
    quantityInput,
    messageInput
  ].filter((f) => f !== null);

  formFields.forEach((field) => {
    field.addEventListener('input', () => clearFieldError(field));
    field.addEventListener('change', () => clearFieldError(field));
  });

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isFormValid = true;
      let firstInvalidField = null;

      // 1. Name validation (required)
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal) {
        showFieldError(nameInput);
        isFormValid = false;
        if (!firstInvalidField) firstInvalidField = nameInput;
      } else {
        clearFieldError(nameInput);
      }

      // 2. Email validation (required, valid format)
      const emailVal = emailInput ? emailInput.value.trim() : '';
      if (!emailVal || !isValidEmail(emailVal)) {
        showFieldError(emailInput);
        isFormValid = false;
        if (!firstInvalidField) firstInvalidField = emailInput;
      } else {
        clearFieldError(emailInput);
      }

      // 3. Phone validation (required, at least 10 digits)
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      if (!phoneVal || !isValidPhone(phoneVal)) {
        showFieldError(phoneInput);
        isFormValid = false;
        if (!firstInvalidField) firstInvalidField = phoneInput;
      } else {
        clearFieldError(phoneInput);
      }

      // 4. Product category validation (required)
      const productVal = productSelect ? productSelect.value.trim() : '';
      if (!productVal || productVal === 'default') {
        showFieldError(productSelect);
        isFormValid = false;
        if (!firstInvalidField) firstInvalidField = productSelect;
      } else {
        clearFieldError(productSelect);
      }

      // 5. Message validation (required)
      const messageVal = messageInput ? messageInput.value.trim() : '';
      if (!messageVal) {
        showFieldError(messageInput);
        isFormValid = false;
        if (!firstInvalidField) firstInvalidField = messageInput;
      } else {
        clearFieldError(messageInput);
      }

      // If invalid, focus the first invalid field
      if (!isFormValid) {
        if (firstInvalidField) {
          firstInvalidField.focus();
        }
        return;
      }

      // Form is valid: gather values
      const companyVal = companyInput ? companyInput.value.trim() : '';
      const quantityVal = quantityInput ? quantityInput.value.trim() : '';
      const selectedOption = productSelect.options[productSelect.selectedIndex];
      const productCategory = selectedOption ? (selectedOption.text || selectedOption.value) : productVal;

      // Construct mailto link
      const emailSubject = `Product Inquiry - ${productCategory} | VHL Global Industries`;
      const emailBodyLines = [
        'VHL Global Industries - Product Inquiry Details',
        '==================================================',
        `Full Name:          ${nameVal}`,
        `Company Name:       ${companyVal || 'Not specified'}`,
        `Email Address:      ${emailVal}`,
        `Phone Number:       ${phoneVal}`,
        `Product Category:   ${productCategory}`,
        `Quantity Required:  ${quantityVal || 'Not specified'}`,
        '--------------------------------------------------',
        'Message / Requirement Details:',
        messageVal,
        '=================================================='
      ];
      const emailBody = emailBodyLines.join('\r\n');

      const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody)}`;

      // Hand off directly to the visitor's configured mail app. Avoid a
      // blocking alert here: on mobile it can interrupt the mail-app handoff.
      if (emailOpenStatus) emailOpenStatus.hidden = false;
      window.location.href = mailtoUrl;
    });
  }

  // ==========================================
  // 9. WHATSAPP BUTTON HANDLER
  // ==========================================
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Read current values from the inquiry form
      const nameVal = nameInput ? nameInput.value.trim() : '';
      const companyVal = companyInput ? companyInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const quantityVal = quantityInput ? quantityInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      let productCategory = '';
      if (productSelect && productSelect.selectedIndex > 0) {
        const option = productSelect.options[productSelect.selectedIndex];
        if (option && option.value) {
          productCategory = option.text || option.value;
        }
      }

      // Build formatted message
      const details = [];
      if (nameVal) details.push(`*Name:* ${nameVal}`);
      if (companyVal) details.push(`*Company:* ${companyVal}`);
      if (emailVal) details.push(`*Email:* ${emailVal}`);
      if (phoneVal) details.push(`*Phone:* ${phoneVal}`);
      if (productCategory) details.push(`*Product Interest:* ${productCategory}`);
      if (quantityVal) details.push(`*Quantity:* ${quantityVal}`);
      if (messageVal) details.push(`*Message:* ${messageVal}`);

      let messageText = '';
      if (details.length > 0) {
        messageText =
          `Hello VHL Global Industries,\n\nI would like to inquire about your chemical products with the following details:\n\n` +
          details.join('\n') +
          `\n\nPlease let me know availability and pricing.`;
      } else {
        messageText =
          `Hello VHL Global Industries,\n\nI am interested in your industrial and specialty chemicals and would like to request more information and product catalogs.`;
      }

      const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(messageText)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // ==========================================
  // 10. HEADER SCROLL EFFECT
  // ==========================================
  function handleHeaderScroll() {
    if (!siteHeader) return;
    if (window.pageYOffset > 50) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }

  // Combined passive scroll listener for scroll-top & header styling
  window.addEventListener(
    'scroll',
    () => {
      handleHeaderScroll();
      handleScrollTopVisibility();
    },
    { passive: true }
  );

  // Run on initial load
  handleHeaderScroll();
  handleScrollTopVisibility();

  // ==========================================
  // 11. SCROLL-TRIGGERED ANIMATIONS
  // ==========================================

  /**
   * Animation configuration map.
   * Each entry defines which elements to animate, the animation type,
   * base delay, and stagger increment for child items.
   */
  const animationConfig = [
    // Section titles
    {
      selector: '.section-title',
      animation: 'fade-up',
      duration: '0.6s',
      stagger: false
    },
    // Section headers (products header)
    {
      selector: '.section-header',
      animation: 'fade-up',
      duration: '0.6s',
      stagger: false
    },
    // Section immediately after the hero — simple fade-in as it scrolls into view
    {
      selector: '.strip-bar',
      animation: 'fade-in',
      duration: '0.8s',
      stagger: false
    },
    // Product cards
    {
      selector: '.product-card',
      animation: 'scale-in',
      duration: '0.5s',
      stagger: true,
      staggerDelay: 80
    },
    // About image
    {
      selector: '.about-image',
      animation: 'fade-left',
      duration: '0.8s',
      stagger: false
    },
    // About content
    {
      selector: '.about-content',
      animation: 'fade-up',
      duration: '0.7s',
      delay: 200,
      stagger: false
    },
    // About sidebar
    {
      selector: '.about-sidebar',
      animation: 'fade-right',
      duration: '0.7s',
      delay: 300,
      stagger: false
    },
    // Industry cards
    {
      selector: '.industry-card',
      animation: 'fade-up',
      duration: '0.5s',
      stagger: true,
      staggerDelay: 100
    },
    // Quality cards
    {
      selector: '.quality-card',
      animation: 'slide-up',
      duration: '0.6s',
      stagger: true,
      staggerDelay: 120
    },
    // Contact info
    {
      selector: '.contact-info',
      animation: 'fade-left',
      duration: '0.7s',
      stagger: false
    },
    // Contact form
    {
      selector: '.contact-form',
      animation: 'fade-right',
      duration: '0.7s',
      delay: 150,
      stagger: false
    },
    // Contact description
    {
      selector: '.contact-desc',
      animation: 'fade-up',
      duration: '0.6s',
      delay: 100,
      stagger: false
    },
    // Contact list items
    {
      selector: '.contact-list-item',
      animation: 'fade-up',
      duration: '0.5s',
      stagger: true,
      staggerDelay: 80
    },
    // Footer columns
    {
      selector: '.footer-grid > *',
      animation: 'fade-up',
      duration: '0.5s',
      stagger: true,
      staggerDelay: 100
    },
    // View all link
    {
      selector: '.view-all-link',
      animation: 'fade-in',
      duration: '0.5s',
      delay: 300,
      stagger: false
    }
  ];

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    // Track stagger groups to apply incremental delays
    const staggerGroups = new Map();

    // Prepare all elements for animation
    animationConfig.forEach((config) => {
      const elements = document.querySelectorAll(config.selector);
      if (!elements.length) return;

      // Group stagger elements by their parent section
      if (config.stagger) {
        elements.forEach((el, index) => {
          el.classList.add('reveal');
          el.setAttribute('data-animation', config.animation);
          el.style.animationDuration = config.duration || '0.6s';

          // Calculate stagger delay
          const baseDelay = config.delay || 0;
          const staggerDelay = baseDelay + (index * (config.staggerDelay || 100));
          el.style.animationDelay = staggerDelay + 'ms';
        });
      } else {
        elements.forEach((el) => {
          el.classList.add('reveal');
          el.setAttribute('data-animation', config.animation);
          el.style.animationDuration = config.duration || '0.6s';
          if (config.delay) {
            el.style.animationDelay = config.delay + 'ms';
          }
        });
      }
    });

    // Create IntersectionObserver for reveal animations
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
      }
    );

    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach((el) => {
      revealObserver.observe(el);
    });

  } else {
    // Reduced motion or no IntersectionObserver: show everything immediately
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('active');
    });
  }

  // ==========================================
  // 12. HERO SECTION ANIMATION (always visible)
  // ==========================================
  // The hero uses .animate-fade-up which runs immediately on load
  // No additional observer needed for the hero section

  // ==========================================
  // 13. GLOBAL EXPORTS (for product modal)
  // ==========================================
  // Expose preselectProductCategory so the product modal JS can call it.
  window.preselectProductCategory = preselectProductCategory;
});
