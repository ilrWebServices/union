(function (document) {
  const inputs = document.querySelectorAll('.cu-input');

  for (let i = 0, len = inputs.length; i < len; i++) {
    const input = inputs[i];
    const wrapper = input.closest('.cu-input-list__item');

    // Check if the field has pre-filled text from the server side
    if (input.value) {
      input.classList.add('is-filled');
      // Check if input has a wrapper
      if (wrapper) {
        wrapper.classList.add('is-filled');
      }
    }

    // If wrapper, remove the js-disabled class for float labels
    if (wrapper) {
      wrapper.classList.remove('js-disabled');
    }

    input.onchange = function() {
      let wrapper = input.closest('.cu-input-list__item');
      if (input.value) {
        input.classList.add('is-filled');
        wrapper.classList.add('is-filled');
      } else {
        input.classList.remove('is-filled');
        wrapper.classList.remove('is-filled');
      }
    };

    input.onfocus = function() {
      input.classList.remove('is-touched');
      input.classList.add('is-focused');

      // Check for wrapper and update classes
      if (wrapper) {
        wrapper.classList.add('is-active')
      }

      // In there were server-side errors, the 'is-invalid' class will be present
      // but should be removed on focus because the user is trying to fix them.
      input.classList.remove('is-invalid');

      if (input.errors) {
        input.errors.remove();
      }
    };

    input.onblur = function(e) {
      if (!e.isTrusted) {
        // This blur event was triggered by a script, not a human, so don't mark
        // the input as is-touched (because it actually wasn't) or show errors.

        // Note that Mozilla claims that isTrusted shouldn't work in IE, but
        // based on testing, it does.
        // https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted
        return;
      }

      input.classList.add('is-touched');

      // Check for wrapper and update classes
      if (wrapper) {
        wrapper.classList.remove('is-active');
      }
    };
  }
})(document);
