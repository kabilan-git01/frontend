document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // SCROLL PROGRESS BAR & STICKY HEADER
  // ==========================================
  const scrollProgress = document.getElementById('scrollProgress');
  const mainHeader = document.getElementById('mainHeader');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  
  window.addEventListener('scroll', () => {
    // Scroll progress indicator
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolledPercentage = (windowScroll / height) * 100;
    scrollProgress.style.width = scrolledPercentage + '%';
    
    // Sticky Header
    if (window.scrollY > 50) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }

    // Scroll-to-top button visibility
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }

    // Scroll Spy active navigation
    scrollSpy();
  });

  // Scroll to Top action
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ==========================================
  // MOBILE NAVIGATION MENU
  // ==========================================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

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

  // ==========================================
  // SCROLL SPY ACTIVE MENU LINK
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  
  function scrollSpy() {
    const scrollPosition = window.scrollY + 100; // Offset for sticky navbar

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ==========================================
  // SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once revealed, no need to track it anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // STATS COUNTERS ANIMATION
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersStarted = false;

  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // Animation duration in ms
    const stepTime = Math.max(Math.floor(duration / target), 15);
    let start = 0;
    
    const timer = setInterval(() => {
      // Linear/Ease-out progress
      start += Math.ceil(target / (duration / stepTime));
      
      if (start >= target) {
        element.textContent = target + (target === 5000 ? '+' : '');
        clearInterval(timer);
      } else {
        element.textContent = start;
      }
    }, stepTime);
  };

  const statsSection = document.querySelector('.stats');
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        statNumbers.forEach(num => countUp(num));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (statsSection) {
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

  function updatePrices(isAnnual) {
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
  }

  billingToggle.addEventListener('change', () => {
    const isChecked = billingToggle.checked;
    if (isChecked) {
      monthlyLabel.classList.remove('active');
      annualLabel.classList.add('active');
      updatePrices(true);
    } else {
      monthlyLabel.classList.add('active');
      annualLabel.classList.remove('active');
      updatePrices(false);
    }
  });

  // Label click triggers
  monthlyLabel.addEventListener('click', () => {
    if (billingToggle.checked) {
      billingToggle.checked = false;
      monthlyLabel.classList.add('active');
      annualLabel.classList.remove('active');
      updatePrices(false);
    }
  });

  annualLabel.addEventListener('click', () => {
    if (!billingToggle.checked) {
      billingToggle.checked = true;
      monthlyLabel.classList.remove('active');
      annualLabel.classList.add('active');
      updatePrices(true);
    }
  });

  // ==========================================
  // TESTIMONIALS SLIDER
  // ==========================================
  const testimonialTrack = document.getElementById('testimonialTrack');
  const slides = document.querySelectorAll('.testimonial-slide');
  const sliderDotsContainer = document.getElementById('sliderDots');
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
    dots[currentSlide].classList.add('active');
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
  const testimonialSlider = document.getElementById('testimonialSlider');
  testimonialSlider.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
  testimonialSlider.addEventListener('mouseleave', startAutoSlide);

  // Initialize Slider
  startAutoSlide();

  // ==========================================
  // GALLERY INTERACTIVE LIGHTBOX
  // ==========================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  
  let activeGalleryIndex = 0;
  const galleryImagesSrc = Array.from(galleryItems).map(item => item.querySelector('img').src);

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

  lightboxCloseBtn.addEventListener('click', closeLightbox);
  lightboxPrevBtn.addEventListener('click', () => navigateLightbox(-1));
  lightboxNextBtn.addEventListener('click', () => navigateLightbox(1));

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

  // ==========================================
  // CONTACT FORM UI VALIDATION
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const formResponseMsg = document.getElementById('formResponseMsg');

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

  // ==========================================
  // NEWSLETTER FORM VALIDATION
  // ==========================================
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterFeedback = document.getElementById('newsletterFeedback');

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
});
