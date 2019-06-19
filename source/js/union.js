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

(function(window, document) {

  // Return an object with the padding values of a given element.
  const getPadding = function(el) {
    return {
      top: Math.ceil(parseInt(window.getComputedStyle(el).getPropertyValue('padding-top'))),
      right: Math.ceil(parseInt(window.getComputedStyle(el).getPropertyValue('padding-right'))),
      bottom: Math.ceil(parseInt(window.getComputedStyle(el).getPropertyValue('padding-bottom'))),
      left: Math.ceil(parseInt(window.getComputedStyle(el).getPropertyValue('padding-left')))
    };
  };

  // Draw (or re-draw) decorative ILR Brand frames around any box content.
  const drawFrames = function() {
    const frame_targets = document.querySelectorAll('[data-cu-frame-style]');

    for (const frame_target of frame_targets) {
      let frame_canvas,
          frame_target_dimensions = frame_target.getBoundingClientRect(),
          padding_top = getPadding(frame_target).top,
          padding_right = getPadding(frame_target).right,
          padding_bottom = getPadding(frame_target).bottom,
          padding_left = getPadding(frame_target).left,
          style = frame_target.dataset.cuFrameStyle,
          color = frame_target.dataset.cuFrameColor || 'white',
          line_width = parseInt(frame_target.dataset.cuFrameSize) || 20,
          bevel_size = line_width/10;

      for (const frame_target_child of frame_target.children) {
        // Check for an existing frame canvas.
        if (frame_target_child.matches('canvas.cu-frame')) {
          frame_canvas = frame_target_child;
        }

        // If the current padding is 0, get the padding from the first child that has any.
        if (padding_top === 0) {
          padding_top = getPadding(frame_target_child).top;
        }

        if (padding_right === 0) {
          padding_right = getPadding(frame_target_child).right;
        }

        if (padding_bottom === 0) {
          padding_bottom = getPadding(frame_target_child).bottom;
        }

        if (padding_left === 0) {
          padding_left = getPadding(frame_target_child).left;
        }
      }

      // Create and append a new frame canvas if one wasn't found.
      if (typeof frame_canvas === 'undefined') {
        frame_canvas = document.createElement('canvas');
        // frame_canvas.setAttribute('id', 'todo-there-should-be-only-one');
        frame_canvas.classList.add('cu-frame');
        frame_canvas.style.cssText = 'position: absolute; top: 0; left: 0; pointer-events: none; z-index: 10';
        frame_target.appendChild(frame_canvas);
        frame_target.classList.add('cu-frame-target');
        frame_target.style.position = 'relative';
      }

      // Assign the dimensions of the target element to the new or existing
      // frame canvas.
      frame_canvas.height = frame_target_dimensions.height;
      frame_canvas.width = frame_target_dimensions.width;

      let ctx = frame_canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;

      if (style === 'open-left') {
        // Top after content to bottom before content.
        // text ━━━┓
        //         ┃
        // foo ━━━━┛
        let line_start = padding_top;

        if (frame_target.children.length) {
          let frame_target_first_child = frame_target.children[0];
          let frame_target_first_child_padding = window.getComputedStyle(frame_target_first_child, null).getPropertyValue('padding-right');
          line_start = frame_target_first_child.getBoundingClientRect().width - parseInt(frame_target_first_child_padding);
        }

        let line_0 = {
              x: Math.ceil(line_start),
              y: Math.ceil(padding_top + line_width/2)
            },
            line_1 = {
              x: Math.ceil(frame_target_dimensions.width - padding_right - line_width/2),
              y: Math.ceil(padding_top + line_width/2)
            },
            line_2 = {
              x: Math.ceil(frame_target_dimensions.width - padding_right - line_width/2),
              y: Math.ceil(frame_target_dimensions.height - padding_top - line_width/2)
            },
            line_3 = {
              x: Math.ceil(frame_target_dimensions.width/2),
              y: Math.ceil(frame_target_dimensions.height - padding_top - line_width/2)
            };

        ctx.beginPath();
        ctx.moveTo(line_0.x, line_0.y);
        ctx.lineTo(line_1.x, line_1.y);
        ctx.lineTo(line_2.x, line_2.y);
        ctx.lineTo(line_3.x, line_3.y);
        ctx.lineWidth = line_width;
        ctx.strokeStyle = color;
        ctx.stroke();

        // Begin clipped bevels.
        ctx.beginPath();

        // All bevels are tiny triangles drawn at the ends and corners of lines.
        // Line ends and outer corners are 'notched out', so the destination-out
        // composite is used.
        ctx.globalCompositeOperation = 'destination-out';

        // Beginning of line outside.
        ctx.moveTo(line_0.x, line_0.y - line_width/2);
        ctx.lineTo(line_0.x, line_0.y - line_width/2 + bevel_size);
        ctx.lineTo(line_0.x + bevel_size, line_0.y - line_width/2);

        // Beginning of line inside.
        ctx.moveTo(line_0.x, line_0.y + line_width/2);
        ctx.lineTo(line_0.x, line_0.y + line_width/2 - bevel_size);
        ctx.lineTo(line_0.x + bevel_size, line_0.y + line_width/2);

        // End of line inside.
        ctx.moveTo(line_3.x, line_3.y - line_width/2);
        ctx.lineTo(line_3.x, line_3.y - line_width/2 + bevel_size);
        ctx.lineTo(line_3.x + bevel_size, line_3.y - line_width/2);

        // End of line outside.
        ctx.moveTo(line_3.x, line_3.y + line_width/2);
        ctx.lineTo(line_3.x, line_3.y + line_width/2 - bevel_size);
        ctx.lineTo(line_3.x + bevel_size, line_3.y + line_width/2);

        // First corner outside.
        ctx.moveTo(line_1.x + line_width/2, line_1.y - line_width/2);
        ctx.lineTo(line_1.x + line_width/2, line_1.y - line_width/2 + bevel_size);
        ctx.lineTo(line_1.x + line_width/2 - bevel_size, line_1.y - line_width/2);

        // Second corner outside.
        ctx.moveTo(line_2.x + line_width/2, line_2.y + line_width/2);
        ctx.lineTo(line_2.x + line_width/2, line_2.y + line_width/2 - bevel_size);
        ctx.lineTo(line_2.x + line_width/2 - bevel_size, line_2.y + line_width/2);

        ctx.fill();

        // Inner bevels are visible in the inner corners of the frame.
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = color;

        // First corner inside.
        ctx.moveTo(line_1.x - line_width/2, line_1.y + line_width/2);
        ctx.lineTo(line_1.x - line_width/2 - bevel_size, line_1.y + line_width/2);
        ctx.lineTo(line_1.x - line_width/2, line_1.y + line_width/2 + bevel_size);

        // Second corner inside.
        ctx.moveTo(line_2.x - line_width/2, line_2.y - line_width/2);
        ctx.lineTo(line_2.x - line_width/2, line_2.y - line_width/2 - bevel_size);
        ctx.lineTo(line_2.x - line_width/2 - bevel_size, line_2.y - line_width/2);

        ctx.fill();
      }
      else if (style === 'open-right') {
        // This frame lives in the available padding of the frame target.
        // ┏━━━━━━━━
        // ┃ content
        // ┗━━━━
        let line_0 = {
          x: Math.ceil(frame_target_dimensions.width - padding_right),
          y: Math.ceil(padding_top/2)
        },
        line_1 = {
          x: Math.ceil(padding_left/2),
          y: Math.ceil(padding_top/2)
        },
        line_2 = {
          x: Math.ceil(padding_left/2),
          y: Math.ceil(frame_target_dimensions.height - padding_top/2)
        },
        line_3 = {
          x: Math.ceil(frame_target_dimensions.width/2),
          y: Math.ceil(frame_target_dimensions.height - padding_top/2)
        };

        ctx.beginPath();
        ctx.moveTo(line_0.x, line_0.y);
        ctx.lineTo(line_1.x, line_1.y);
        ctx.lineTo(line_2.x, line_2.y);
        ctx.lineTo(line_3.x, line_3.y);
        ctx.lineWidth = line_width;
        ctx.strokeStyle = color;
        ctx.stroke();

        // Begin clipped bevels.
        ctx.beginPath();
        ctx.globalCompositeOperation = 'destination-out';

        // Beginning of line outside.
        ctx.moveTo(line_0.x, line_0.y - line_width/2);
        ctx.lineTo(line_0.x, line_0.y - line_width/2 + bevel_size);
        ctx.lineTo(line_0.x - bevel_size, line_0.y - line_width/2);

        // Beginning of line inside.
        ctx.moveTo(line_0.x, line_0.y + line_width/2);
        ctx.lineTo(line_0.x, line_0.y + line_width/2 - bevel_size);
        ctx.lineTo(line_0.x - bevel_size, line_0.y + line_width/2);

        // End of line inside.
        ctx.moveTo(line_3.x, line_3.y - line_width/2);
        ctx.lineTo(line_3.x, line_3.y - line_width/2 + bevel_size);
        ctx.lineTo(line_3.x - bevel_size, line_3.y - line_width/2);

        // End of line outside.
        ctx.moveTo(line_3.x, line_3.y + line_width/2);
        ctx.lineTo(line_3.x, line_3.y + line_width/2 - bevel_size);
        ctx.lineTo(line_3.x - bevel_size, line_3.y + line_width/2);

        // First corner outside.
        ctx.moveTo(line_1.x - line_width/2, line_1.y - line_width/2);
        ctx.lineTo(line_1.x - line_width/2, line_1.y - line_width/2 + bevel_size);
        ctx.lineTo(line_1.x - line_width/2 + bevel_size, line_1.y - line_width/2);

        // Second corner outside.
        ctx.moveTo(line_2.x - line_width/2, line_2.y + line_width/2);
        ctx.lineTo(line_2.x - line_width/2, line_2.y + line_width/2 - bevel_size);
        ctx.lineTo(line_2.x - line_width/2 + bevel_size, line_2.y + line_width/2);

        ctx.fill();

        // Inner bevels are visible in the inner corners of the frame.
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = color;

        // First corner inside.
        ctx.moveTo(line_1.x + line_width/2, line_1.y + line_width/2);
        ctx.lineTo(line_1.x + line_width/2 + bevel_size, line_1.y + line_width/2);
        ctx.lineTo(line_1.x + line_width/2, line_1.y + line_width/2 + bevel_size);

        // Second corner inside.
        ctx.moveTo(line_2.x + line_width/2, line_2.y - line_width/2);
        ctx.lineTo(line_2.x + line_width/2, line_2.y - line_width/2 - bevel_size);
        ctx.lineTo(line_2.x + line_width/2 + bevel_size, line_2.y - line_width/2);

        ctx.fill();

      }
    }
  };

  // Set a simple debounce timer to prevent the following redraw triggers from
  // running more often than necessary.
  let debounce_timeout;

  // Trigger a frame draw when the DOM is modified, including initial page load.
  let observer = new MutationObserver(function() {
    clearTimeout(debounce_timeout);
    debounce_timeout = setTimeout(drawFrames, 250);
  }).observe(document, {
    childList: true,
    subtree: true
  });

  // Trigger a frame draw when the window/viewport is resized.
  window.addEventListener('resize', drawFrames, false);

  // This is the debounced version, which only draws the frames once the window
  // resize is done. This is only required if there are performace issues with
  // firing on every resize event.
  // window.addEventListener('resize', function(event) {
  //   clearTimeout(debounce_timeout);
  //   debounce_timeout = setTimeout(drawFrames, 100);
  // }, false);

})(window, document);
//# sourceMappingURL=union.js.map
