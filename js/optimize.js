// Debounce para eventos de scroll/resize
function debounce(func, wait = 20, immediate = true) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Uso para scroll
window.addEventListener('scroll', debounce(function() {
  // Código de manejo de scroll
}));

// Observer para elementos fuera de vista
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
}, {threshold: 0.01});

document.querySelectorAll('img[data-src]').forEach(img => {
  observer.observe(img);
});