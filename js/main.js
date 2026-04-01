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
  navLinks.classList.toggle('active');
});

navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('active');
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
