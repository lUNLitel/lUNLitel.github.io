const scrollIndicator = document.querySelector('.scroll-indicator');

// Hide/show scroll indicator based on scroll position
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    scrollIndicator?.classList.add('hidden');
  } else {
    scrollIndicator?.classList.remove('hidden');
  }
});
