(function (window, document) {

  // Test for required browser APIs.
  if (('TextEncoder' in window) === false) {
    return;
  }

  if ((('crypto' in window) || ('subtle' in window.crypto)) === false) {
    return;
  }

  if (('localStorage' in window) === false) {
    return;
  }

  const hashElement = function(el) {
    // Create a new TextEncoder.
    // https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder
    const encoder = new TextEncoder();

    // Encode element innerHTML into a Uint8Array object.
    const element_encoded = encoder.encode(el.innerHTML);

    // Create a digest string of the encoded HTML Element.
    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
    crypto.subtle.digest('SHA-1', element_encoded).then(digest_val => {
      const byteArray = new Uint8Array(digest_val);

      const hexCodes = [...byteArray].map(value => {
        const hexCode = value.toString(16);
        const paddedHexCode = hexCode.padStart(2, '0');
        return paddedHexCode;
      });

      processHashedElement(el, hexCodes.join(''));
    });
  };

  const processHashedElement = function(el, hash) {
    // Add a data attribute with the hash value on the dismissible element.
    el.setAttribute('data-cu-sha256', hash);

    // Has this element been dismissed? Remove it from the DOM if so.
    if (parseInt(localStorage.getItem('cu-diss-' + hash))) {
      el.classList.add('cu-dismissible--predismissed')
    }
    else {
      el.classList.remove('cu-dismissible--predismissed');
    }
  };

  const hashElements = function() {
    const dismissible_elements = document.querySelectorAll('.cu-dismissible');

    for (const dismissible_element of dismissible_elements) {
      hashElement(dismissible_element);
    }
  };

  // Set a simple debounce timer to prevent the following trigger from running
  // more often than necessary.
  let debounce_timeout;

  // Trigger dismissible hash processing when the DOM is modified, including
  // initial page load.
  let observer = new MutationObserver(function() {
    clearTimeout(debounce_timeout);
    debounce_timeout = setTimeout(hashElements, 250);
  }).observe(document, {
    childList: true,
    subtree: true
  });

  // Store the dismissal state in local storage.
  document.addEventListener('change', function(event) {
    if (event.target.matches('.cu-dismissible__input')) {
      localStorage.setItem('cu-diss-' + event.target.parentNode.dataset.cuSha256, event.target.checked ? 1 : 0);
    }
  }, false);

})(window, document);
