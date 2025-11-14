const aboutBtn = document.getElementById('about-btn');
const aboutPopup = document.getElementById('about-popup');
const closeAbout = document.getElementById('close-about');
const scrollIndicator = document.querySelector('.scroll-indicator');

aboutBtn.addEventListener('click', () => {
  aboutPopup.classList.remove('hidden');
});

closeAbout.addEventListener('click', () => {
  aboutPopup.classList.add('hidden');
});

// Hide/show scroll indicator based on scroll position
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    scrollIndicator?.classList.add('hidden');
  } else {
    scrollIndicator?.classList.remove('hidden');
  }
});
