// Dark mode toggle
const themeToggle = document.querySelector('.theme-toggle');

let savedTheme = null;
try {
  savedTheme = localStorage.getItem('theme');
} catch (e) {}

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
  try {
    localStorage.setItem('theme', next);
  } catch (e) {}
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

// ─── Contact Form (Web3Forms) ───
(function() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const status = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending…';
    status.className = 'form-status sending';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        status.textContent = 'Message sent! We\u2019ll get back to you soon.';
        status.className = 'form-status success';
        form.reset();
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      status.textContent = 'Something went wrong. Please try again or email rosecitydetailing519@gmail.com directly.';
      status.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
    }
  });
})();
