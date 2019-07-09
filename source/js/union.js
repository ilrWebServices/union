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
