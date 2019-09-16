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

// A simple script to pause videos when they aren't visible in the viewport.
// @todo Add logic to deal with videos added to the DOM via ajax or other.
// @todo Deal with videos in iframes. See https://stackoverflow.com/a/15251023 and https://stackoverflow.com/q/12336031
(function (window, document) {

  const cu_video_elements = document.querySelectorAll('.cu-video');

  const inViewport = function(el) {
    let bounding = el.getBoundingClientRect();
    return (bounding.top < window.innerHeight) && (bounding.bottom > 0);
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
