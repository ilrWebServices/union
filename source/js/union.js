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

(function (document) {

  document.addEventListener('change', function(event) {
    if (event.target.matches('.cu-input')) {
      let wrapper = event.target.closest('.cu-input-list__item');

      if (event.target.value) {
        event.target.classList.add('is-filled');
        wrapper.classList.add('is-filled');
      }
      else {
        event.target.classList.remove('is-filled');
        wrapper.classList.remove('is-filled');
      }
    }
  }, false);

  // This is the equivalent of focus (which doesnt' bubble).
  document.addEventListener('focusin', function(event) {
    if (event.target.matches('.cu-input')) {
      let wrapper = event.target.closest('.cu-input-list__item');

      event.target.classList.remove('is-touched');
      event.target.classList.add('is-focused');

      // Check for wrapper and update classes.
      if (wrapper) {
        wrapper.classList.add('is-active')
      }

      // If there were server-side errors, the 'is-invalid' class will be present
      // but should be removed on focus because the user is trying to fix them.
      event.target.classList.remove('is-invalid');

      if (event.target.errors) {
        event.target.errors.remove();
      }
    }
  }, false);

  // This is the equivalent of blur (which doesnt' bubble).
  document.addEventListener('focusout', function(event) {
    if (event.target.matches('.cu-input')) {
      let wrapper = event.target.closest('.cu-input-list__item');

      if (!event.isTrusted) {
        // This blur event was triggered by a script, not a human, so don't mark
        // the input as is-touched (because it actually wasn't) or show errors.

        // Note that Mozilla claims that isTrusted shouldn't work in IE, but
        // based on testing, it does.
        // https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted
        return;
      }

      event.target.classList.add('is-touched');
      event.target.classList.remove('is-focused');

      // Check for wrapper and update classes
      if (wrapper) {
        wrapper.classList.remove('is-active');
      }
    }
  }, false);

  // Process any .cu-input elements whenever stuff is added to the DOM. This
  // includes the initial page load.
  let observer = new MutationObserver(function(mutations, observer) {
    // Check to see if any of the mutations added nodes to the DOM.
    let added_children = false;

    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        added_children = true;
        break;
      }
    }

    // Return if not adding children.
    if (!added_children) {
      return;
    }

    const inputs = document.querySelectorAll('.cu-input');

    for (const input of inputs) {
      const wrapper = input.closest('.cu-input-list__item');

      // Check if the field has pre-filled text from the server side.
      if (input.value) {
        input.classList.add('is-filled');

        // Check if input has a wrapper.
        if (wrapper) {
          wrapper.classList.add('is-filled');
        }
      }

      // If wrapper, remove the js-disabled class for float labels.
      if (wrapper) {
        wrapper.classList.remove('js-disabled');
      }
    }
  });

  // @todo Investigate the performance ramifications of observing the entire
  // document, plus its children.
  observer.observe(document, {
    childList: true,
    subtree: true
  });

})(document);
//# sourceMappingURL=union.js.map
