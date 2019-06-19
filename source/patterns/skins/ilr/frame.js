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
        let line_start = frame_target_dimensions.width - padding_right*2;

        if (frame_target.children.length) {
          let frame_target_first_child = frame_target.children[0];
          line_start = frame_target_first_child.getBoundingClientRect().width - padding_right;
        }

        let line_0 = {
              x: Math.ceil(line_start + padding_right/4),
              y: Math.ceil(padding_top + line_width/2)
            },
            line_1 = {
              x: Math.ceil(frame_target_dimensions.width - padding_left - line_width/2),
              y: Math.ceil(padding_top + line_width/2)
            },
            line_2 = {
              x: Math.ceil(frame_target_dimensions.width - padding_left - line_width/2),
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
