(function (document) {

  // Wire play icons to videos in banners.
  document.addEventListener('click', function(event) {
    if (event.target.matches('.cu-icon--play')) {
      // If the icon has a video target selector in a `data-cu-video-target`
      // attribute, use that. Otherwise, use the closest video.
      let video_element = document.querySelector(event.target.dataset.cuVideoTarget) || event.target.closest('.cu-banner').querySelector('.cu-banner__media video');
      let overlay_content = event.target.closest('.cu-banner__content');

      if (video_element && video_element.paused) {
        video_element.play();
        overlay_content.style.display = 'none';
        video_element.controls = true;
      }
    }
  });

})(document);

(function (document) {

  const displayTopicList = function () {
    const listContainers = document.querySelectorAll('.cu-course-finder__topics-list');

    // Show the list.
    listContainers.forEach(function (container) {
      container.classList.add('topics-list--expanded');
    });
  }

  document.addEventListener('click', function (event) {
    if (event.target.matches('.cu-course-finder__trigger')) {
      displayTopicList(event.target);
    }
  }, false);

  // Able to close topic list by hitting escape
  document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
      // Find element that was active when escape was hit
      const activeContainers = document.querySelectorAll('.topics-list--expanded');

      // Hide the list.
      activeContainers.forEach(function (container) {
        container.classList.remove('topics-list--expanded');
      });
    }
  });

})(document);

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
        if (wrapper) {
          wrapper.classList.add('is-filled');
        }
      }
      else {
        event.target.classList.remove('is-filled');
        if (wrapper) {
          wrapper.classList.remove('is-filled');
        }
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

(function(window, document) {

  const processRegistrationForms = function() {
    const registrationForms = document.querySelectorAll('.cu-registration-form');

    if (registrationForms == null) {
      return;
    }

    for (const registrationForm of registrationForms) {
      const prices = registrationForm.querySelectorAll('.cu-js-price');
      const buttons = registrationForm.querySelectorAll('.cu-button');
      const input_name = registrationForm.querySelector('.cu-checkbutton__input').getAttribute('name');

      // Hide any displayed prices.
      prices.forEach(function(price) {
        price.style.display = 'none';
      });

      // Hide any checkbutton registration links.
      buttons.forEach(function (button) {
        button.style.display = 'none';
      });

      let first_input = registrationForm.querySelector('input[name="' + input_name + '"]')
      let checked_input = registrationForm.querySelector('input[name="' + input_name + '"]:checked');

      // If there is a checked input, activate its price.
      if (checked_input) {
        setActivePrice(registrationForm, checked_input);
        addRegistrationButton(registrationForm, checked_input);
      }
      // Otherwise, activate the price of the first input.
      else {
        first_input.checked = true;
        setActivePrice(registrationForm, first_input);
        addRegistrationButton(registrationForm, first_input);
      }
    }
  }

  const checkButtonChangeHandler = function(checkbutton_input) {
    let registrationForm = checkbutton_input.closest('form');
    setActivePrice(registrationForm, checkbutton_input);
    setRegisterLink(registrationForm, checkbutton_input);
  }

  const setActivePrice = function(registrationForm, input) {
    let priceElement = registrationForm.querySelector('.cu-registration-form__active-price');
    priceElement.textContent = input.dataset.price;
    activePriceSet = true;
  }

  const addRegistrationButton = function (registrationForm, checked_input) {
    let registerButton = document.createElement('a');
    registerButton.setAttribute('class', 'cu-button cu-button--alt cu-js-register-link');
    registerButton.setAttribute('href', checked_input.value);
    registerButton.innerHTML = 'Register';
    checked_input.parentNode.parentNode.appendChild(registerButton, registrationForm);
  }

  const setRegisterLink = function (registrationForm, checked_input) {
    let registerButton = registrationForm.querySelector('.cu-js-register-link');
    registerButton.setAttribute('href', checked_input.value);
  }

  window.addEventListener('DOMContentLoaded', processRegistrationForms);

  document.addEventListener('change', function(event) {
    if (event.target.matches('.cu-checkbutton__input')) {
      checkButtonChangeHandler(event.target);
    }
  }, false);

})(window, document);

// A simple script to pause videos when they aren't visible in the viewport.
// @todo Add logic to deal with videos added to the DOM via ajax or other.
// @todo Deal with videos in iframes. See https://stackoverflow.com/a/15251023 and https://stackoverflow.com/q/12336031
(function (window, document) {

  const cu_video_elements = document.querySelectorAll('.cu-video');

  const inViewport = function(el) {
    let bounding = el.getBoundingClientRect();
    let within_upper_bounds = (bounding.top + bounding.height / 2 < window.innerHeight);
    let within_lower_bounds = (bounding.bottom > bounding.height / 2);
    return within_upper_bounds && within_lower_bounds;
  };

  let debounce_timeout;
  window.addEventListener('scroll', function(ev) {
    clearTimeout(debounce_timeout);
    debounce_timeout = setTimeout(function() {
      for (const cu_video_element of cu_video_elements) {
        // See if the video is in the viewport. I.e. is visible.
        if (inViewport(cu_video_element)) {
          // If it is visible, only play it if it was paused via javascript
          // rather than manually by the user.
          if (cu_video_element.classList.contains('js-paused')) {
            cu_video_element.play();
            cu_video_element.classList.remove('js-paused')
          }
        }
        // The video is outside the viewport (i.e. not visible).
        else {
          // If the video is already paused, it was probably done by the user,
          // so leave it paused and don't add the class that indicates that the
          // video was paused via javascript.
          if (cu_video_element.paused === false) {
            cu_video_element.pause();
            cu_video_element.classList.add('js-paused')
          }
        }
      }
    }, 500);

  }, false);

})(window, document);
//# sourceMappingURL=union.js.map
