// Dark mode toggle
const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.innerHTML = savedTheme === 'dark' ? '&#9728;' : '&#9790;';
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  if (next === 'light') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  themeToggle.innerHTML = next === 'dark' ? '&#9728;' : '&#9790;';
  localStorage.setItem('theme', next);
});

// Mobile menu toggle
const menuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('active');
  menuBtn.innerHTML = isOpen ? '&#10005;' : '&#9776;';
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('active');
    menuBtn.innerHTML = '&#9776;';
    document.body.style.overflow = '';
  }
});

// Before/After comparison sliders
document.querySelectorAll('.comparison-slider').forEach((slider) => {
  const wrapper = slider.querySelector('.comparison-img-wrapper');
  const afterClip = slider.querySelector('.comp-after-clip');
  const handle = slider.querySelector('.comp-handle');
  let isDragging = false;

  function setPosition(x) {
    const rect = wrapper.getBoundingClientRect();
    let percent = ((x - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    afterClip.style.width = (100 - percent) + '%';
    handle.style.left = percent + '%';
  }

  wrapper.addEventListener('mousedown', (e) => {
    isDragging = true;
    setPosition(e.clientX);
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) setPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  wrapper.addEventListener('touchstart', (e) => {
    isDragging = true;
    setPosition(e.touches[0].clientX);
  });

  window.addEventListener('touchmove', (e) => {
    if (isDragging) setPosition(e.touches[0].clientX);
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
});

// ─── Booking System ───
(function() {
  const steps = document.querySelectorAll('.booking-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  const progressLines = document.querySelectorAll('.progress-line');
  let currentStep = 1;

  // State
  let selectedPackage = null;
  let selectedAddons = [];

  const packageNames = {
    exterior: 'Exterior Detail',
    interior: 'Interior Detail',
    full: 'Full Detail'
  };

  const calUrls = {
    exterior: 'https://cal.com/rosecitydetailing/exterior-wash?embed=true&theme=auto',
    interior: 'https://cal.com/rosecitydetailing/interior-wash?embed=true&theme=auto',
    full: 'https://cal.com/rosecitydetailing/full-detail?embed=true&theme=auto'
  };

  // ─── Step Navigation ───
  function goToStep(n) {
    steps.forEach(s => s.classList.remove('active'));
    document.getElementById('step-' + n).classList.add('active');

    progressSteps.forEach(ps => {
      const stepNum = parseInt(ps.dataset.step);
      ps.classList.remove('active', 'done');
      if (stepNum === n) ps.classList.add('active');
      if (stepNum < n) ps.classList.add('done');
    });

    progressLines.forEach((line, i) => {
      line.classList.toggle('done', i < n - 1);
    });

    currentStep = n;

    // Load correct Cal.com event when entering step 3
    if (n === 3 && selectedPackage) {
      const iframe = document.getElementById('cal-iframe');
      const targetUrl = calUrls[selectedPackage.name];
      if (iframe.src !== targetUrl) {
        iframe.src = targetUrl;
      }
    }

    // Update summary when entering step 4
    if (n === 4) updateSummary();

    // Scroll to booking section
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Disable Step 3 Next button by default
  const step3Next = document.querySelector('#step-3 .btn-next');
  step3Next.disabled = true;

  // Listen for Cal.com booking confirmation via postMessage
  window.addEventListener('message', (e) => {
    let data = e.data;
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch (_) { return; }
    }
    if (!data || typeof data !== 'object') return;

    // Deeply search the message for booking success signals
    const str = JSON.stringify(data).toLowerCase();
    if (str.includes('bookingsuccessful') || str.includes('booking_successful')) {
      step3Next.disabled = false;
      goToStep(4);
      return;
    }
    // Check for route change to booking confirmation page
    if (str.includes('routechanged') || str.includes('route_changed')) {
      if (str.includes('/booking/')) {
        step3Next.disabled = false;
        goToStep(4);
      }
    }
  });

  // Next/Back buttons
  document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep === 1 && !selectedPackage) return;
      if (currentStep === 3 && step3Next.disabled) return;
      goToStep(currentStep + 1);
    });
  });

  document.querySelectorAll('.btn-back').forEach(btn => {
    btn.addEventListener('click', () => {
      goToStep(currentStep - 1);
    });
  });

  // ─── Step 1: Package Selection ───
  const packageOptions = document.querySelectorAll('.package-option');
  const step1Next = document.querySelector('#step-1 .btn-next');

  // Add-ons that are only valid with interior-inclusive packages
  const interiorOnlyAddons = ['deep-interior'];

  function applyAddonGating() {
    const isExterior = selectedPackage && selectedPackage.name === 'exterior';
    document.querySelectorAll('input[name="addon"]').forEach(cb => {
      const label = cb.closest('.addon-option');
      if (interiorOnlyAddons.includes(cb.value)) {
        if (isExterior) {
          if (cb.checked) cb.checked = false;
          cb.disabled = true;
          if (label) label.classList.add('disabled');
        } else {
          cb.disabled = false;
          if (label) label.classList.remove('disabled');
        }
      }
    });
    // Re-sync selectedAddons after possible unchecks
    selectedAddons = [];
    document.querySelectorAll('input[name="addon"]').forEach(c => {
      if (c.checked) {
        selectedAddons.push({ name: c.value, price: parseInt(c.dataset.price) });
      }
    });
  }

  packageOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      packageOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedPackage = {
        name: opt.dataset.package,
        price: parseInt(opt.dataset.price)
      };
      step1Next.disabled = false;
      applyAddonGating();
      updateRunningTotal();
    });
  });

  // ─── Step 2: Add-ons ───
  const addonCheckboxes = document.querySelectorAll('input[name="addon"]');

  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      selectedAddons = [];
      addonCheckboxes.forEach(c => {
        if (c.checked) {
          selectedAddons.push({
            name: c.value,
            price: parseInt(c.dataset.price)
          });
        }
      });
      updateRunningTotal();
    });
  });

  // ─── Running Total ───
  function getTotal() {
    let total = selectedPackage ? selectedPackage.price : 0;
    selectedAddons.forEach(a => total += a.price);
    return total;
  }

  function updateRunningTotal() {
    const el = document.querySelector('.running-total');
    if (el) el.textContent = '$' + getTotal();
  }

  // ─── Step 4: Summary ───
  const addonDisplayNames = {
    'deep-interior': 'Deep Interior Clean',
    'headlight': 'Headlight Restoration',
    'engine-bay': 'Engine Bay Cleaning'
  };

  function updateSummary() {
    const total = getTotal();
    const deposit = Math.ceil(total * 0.25);

    document.getElementById('summary-package').textContent =
      selectedPackage ? packageNames[selectedPackage.name] : '—';
    document.getElementById('summary-package-price').textContent =
      selectedPackage ? '$' + selectedPackage.price : '$0';

    const addonsEl = document.getElementById('summary-addons');
    if (selectedAddons.length === 0) {
      addonsEl.innerHTML = '<div class="summary-row summary-muted">No add-ons selected</div>';
    } else {
      addonsEl.innerHTML = selectedAddons.map(a =>
        '<div class="summary-row"><span>' + addonDisplayNames[a.name] + '</span><span>+$' + a.price + '</span></div>'
      ).join('');
    }

    document.getElementById('summary-total').textContent = '$' + total;
    document.getElementById('summary-deposit').textContent = '$' + deposit;
    document.getElementById('btn-deposit-amount').textContent = '$' + deposit;
  }

  // ─── Pay Button (placeholder) ───
  document.getElementById('btn-pay').addEventListener('click', () => {
    const total = getTotal();
    const deposit = Math.ceil(total * 0.25);
    alert('Stripe integration coming soon!\n\nDeposit amount: $' + deposit + '\nThis will redirect to Stripe Checkout.');
  });
})();
