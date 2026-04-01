// Mobile menu toggle
const menuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('active');
  }
});

// Contact form submission
const form = document.getElementById('contact-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  console.log('Form submitted:', data);
  form.reset();
  alert('Thanks for reaching out! We\'ll get back to you shortly.');
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
