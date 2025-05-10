// Function to hide the address bar on mobile devices
function hideAddressBar() {
  if (document.documentElement.scrollHeight <= window.outerHeight + 1) {
    document.documentElement.style.height = (window.outerHeight + 50) + 'px';
  }
  
  // Hide the address bar on mobile browsers
  setTimeout(function() {
    window.scrollTo(0, 1);
  }, 0);
}

// Hide address bar when page loads
window.addEventListener('load', function() {
  hideAddressBar();
});

// Hide address bar when orientation changes
window.addEventListener('orientationchange', function() {
  hideAddressBar();
});

// Hide address bar when window is resized
window.addEventListener('resize', function() {
  hideAddressBar();
});

// For iOS devices
if ('standalone' in navigator && navigator.standalone) {
  document.addEventListener('touchend', function(e) {
    const a = e.target.closest('a');
    if (a && a.getAttribute('target') !== '_blank') {
      e.preventDefault();
      window.location = a.href;
    }
  }, false);
} 