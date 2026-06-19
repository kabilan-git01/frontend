document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // SCROLL PROGRESS BAR & STICKY HEADER
  // ==========================================
  const scrollProgress = document.getElementById('scrollProgress');
  const mainHeader = document.getElementById('mainHeader');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  
  window.addEventListener('scroll', () => {
    // Scroll progress indicator
    if (scrollProgress) {
      const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolledPercentage = height > 0 ? (windowScroll / height) * 100 : 0;
      scrollProgress.style.width = scrolledPercentage + '%';
    }
    
    // Sticky Header
    if (mainHeader) {
      if (window.scrollY > 50) {
        mainHeader.classList.add('scrolled');
      } else {
        mainHeader.classList.remove('scrolled');
      }
    }

    // Scroll-to-top button visibility
    if (scrollTopBtn) {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    }
  });

  // Scroll to Top action
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // MOBILE NAVIGATION MENU & ACTIVE LINK SETTER
  // ==========================================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Dynamic Multi-page Active link highlight
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === 'index.html' && href === '') || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ==========================================
  // SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ==========================================
  // STATS COUNTERS ANIMATION
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsSection = document.querySelector('.stats');
  let countersStarted = false;

  if (statsSection && statNumbers.length > 0) {
    const countUp = (element) => {
      const target = parseInt(element.getAttribute('data-target'), 10);
      const duration = 2000; // Animation duration in ms
      const stepTime = Math.max(Math.floor(duration / target), 15);
      let start = 0;
      
      const timer = setInterval(() => {
        start += Math.ceil(target / (duration / stepTime));
        
        if (start >= target) {
          element.textContent = target + (target === 5000 ? '+' : '');
          clearInterval(timer);
        } else {
          element.textContent = start;
        }
      }, stepTime);
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          statNumbers.forEach(num => countUp(num));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // ==========================================
  // BILLING TOGGLE (MONTHLY / ANNUALLY)
  // ==========================================
  const billingToggle = document.getElementById('billingToggle');
  const monthlyLabel = document.getElementById('monthlyLabel');
  const annualLabel = document.getElementById('annualLabel');
  
  const basicPrice = document.getElementById('basicPrice');
  const elitePrice = document.getElementById('elitePrice');
  const vipPrice = document.getElementById('vipPrice');

  if (billingToggle && basicPrice && elitePrice && vipPrice) {
    const updatePrices = (isAnnual) => {
      const prices = [basicPrice, elitePrice, vipPrice];
      
      prices.forEach(priceEl => {
        const monthlyVal = priceEl.getAttribute('data-monthly');
        const annualVal = priceEl.getAttribute('data-annual');
        
        priceEl.style.transform = 'scale(0.8)';
        priceEl.style.opacity = '0';
        
        setTimeout(() => {
          if (isAnnual) {
            priceEl.innerHTML = `$${annualVal}<span>/yr</span>`;
          } else {
            priceEl.innerHTML = `$${monthlyVal}<span>/mo</span>`;
          }
          priceEl.style.transform = 'scale(1)';
          priceEl.style.opacity = '1';
        }, 200);
      });
    };

    billingToggle.addEventListener('change', () => {
      const isChecked = billingToggle.checked;
      if (isChecked) {
        if (monthlyLabel) monthlyLabel.classList.remove('active');
        if (annualLabel) annualLabel.classList.add('active');
        updatePrices(true);
      } else {
        if (monthlyLabel) monthlyLabel.classList.add('active');
        if (annualLabel) annualLabel.classList.remove('active');
        updatePrices(false);
      }
    });

    if (monthlyLabel) {
      monthlyLabel.addEventListener('click', () => {
        if (billingToggle.checked) {
          billingToggle.checked = false;
          monthlyLabel.classList.add('active');
          if (annualLabel) annualLabel.classList.remove('active');
          updatePrices(false);
        }
      });
    }

    if (annualLabel) {
      annualLabel.addEventListener('click', () => {
        if (!billingToggle.checked) {
          billingToggle.checked = true;
          if (monthlyLabel) monthlyLabel.classList.remove('active');
          annualLabel.classList.add('active');
          updatePrices(true);
        }
      });
    }
  }

  // ==========================================
  // TESTIMONIALS SLIDER
  // ==========================================
  const testimonialTrack = document.getElementById('testimonialTrack');
  const slides = document.querySelectorAll('.testimonial-slide');
  const sliderDotsContainer = document.getElementById('sliderDots');
  const testimonialSlider = document.getElementById('testimonialSlider');

  if (testimonialTrack && testimonialSlider && sliderDotsContainer && slides.length > 0) {
    let currentSlide = 0;
    let autoSlideTimer;

    // Create dot buttons
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if (idx === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetAutoSlide();
      });
      sliderDotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    function goToSlide(index) {
      currentSlide = index;
      testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Update dots status
      dots.forEach(dot => dot.classList.remove('active'));
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
      let nextIndex = currentSlide + 1;
      if (nextIndex >= slides.length) {
        nextIndex = 0;
      }
      goToSlide(nextIndex);
    }

    function startAutoSlide() {
      autoSlideTimer = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
      clearInterval(autoSlideTimer);
      startAutoSlide();
    }

    // Pause on hover
    testimonialSlider.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
    testimonialSlider.addEventListener('mouseleave', startAutoSlide);

    // Initialize Slider
    startAutoSlide();
  }

  // ==========================================
  // GALLERY INTERACTIVE LIGHTBOX
  // ==========================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');

  if (lightboxModal && galleryItems.length > 0 && lightboxImg) {
    let activeGalleryIndex = 0;
    const galleryImagesSrc = Array.from(galleryItems).map(item => {
      const img = item.querySelector('img');
      return img ? img.src : '';
    }).filter(src => src !== '');

    function openLightbox(index) {
      activeGalleryIndex = index;
      lightboxImg.src = galleryImagesSrc[activeGalleryIndex];
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Stop page scroll
    }

    function closeLightbox() {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = 'auto'; // Re-enable scroll
    }

    function navigateLightbox(direction) {
      activeGalleryIndex += direction;
      if (activeGalleryIndex < 0) {
        activeGalleryIndex = galleryImagesSrc.length - 1;
      } else if (activeGalleryIndex >= galleryImagesSrc.length) {
        activeGalleryIndex = 0;
      }
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src = galleryImagesSrc[activeGalleryIndex];
        lightboxImg.style.opacity = '1';
      }, 150);
    }

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
    if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', () => navigateLightbox(-1));
    if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', () => navigateLightbox(1));

    // Close by clicking outside image content
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('active')) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
      } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
      }
    });
  }

  // ==========================================
  // CONTACT FORM UI VALIDATION
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const formResponseMsg = document.getElementById('formResponseMsg');

  if (contactForm && formResponseMsg) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const messageInput = document.getElementById('contactMessage');
      
      // Clear previous responses
      formResponseMsg.className = 'form-message';
      formResponseMsg.textContent = '';
      formResponseMsg.style.display = 'none';

      // Basic Validation Check
      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        formResponseMsg.classList.add('error');
        formResponseMsg.textContent = 'Please fill out all required fields before submitting.';
        return;
      }

      if (!validateEmail(emailInput.value.trim())) {
        formResponseMsg.classList.add('error');
        formResponseMsg.textContent = 'Please provide a valid email address.';
        return;
      }

      // Success response simulation
      const name = nameInput.value.trim();
      const submitBtn = document.getElementById('formSubmitBtn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      setTimeout(() => {
        formResponseMsg.classList.add('success');
        formResponseMsg.textContent = `Thank you, ${name}! Your inquiry has been sent to Titan Fitness. A trainer will reach out to you within 24 hours.`;
        
        // Reset button and fields
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        contactForm.reset();
      }, 1500);
    });

    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  }

  // ==========================================
  // NEWSLETTER FORM VALIDATION
  // ==========================================
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterFeedback = document.getElementById('newsletterFeedback');

  if (newsletterForm && newsletterFeedback) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      
      newsletterFeedback.style.display = 'block';
      newsletterFeedback.style.color = '#777777';
      newsletterFeedback.textContent = 'Registering...';

      setTimeout(() => {
        newsletterFeedback.style.color = 'var(--accent)';
        newsletterFeedback.textContent = 'Thank you for subscribing to Titan updates!';
        newsletterForm.reset();
        
        setTimeout(() => {
          newsletterFeedback.style.display = 'none';
        }, 4000);
      }, 1000);
    });
  }
});
