(function (window, document) {

  if (('localStorage' in window) === false) {
    return;
  }

  const processDismissibles = function() {
    const dismissible_elements = document.querySelectorAll('[data-cu-digest].cu-dismissible');

    for (const dismissible_element of dismissible_elements) {
      // Has this element been dismissed? Tag it with a class if so.
      if (parseInt(localStorage.getItem('cu-diss-' + dismissible_element.dataset.cuDigest))) {
        dismissible_element.classList.add('cu-dismissible--predismissed')
      }
      else {
        dismissible_element.classList.remove('cu-dismissible--predismissed');
      }
    }
  };

  let observer = new MutationObserver(processDismissibles).observe(document, {
    childList: true,
    subtree: true
  });

  // Store the dismissal state in local storage.
  document.addEventListener('change', function(event) {
    if (event.target.matches('.cu-dismissible__input')) {
      localStorage.setItem('cu-diss-' + event.target.parentNode.dataset.cuDigest, event.target.checked ? 1 : 0);
    }
  }, false);

})(window, document);
