The Open Frame is a design element used with the ILR wordmark and other design elements. See the [ILR Branding Guidelines][] for more information.

This javascript API allows the addition of the open frame to most HTML elements.

### Adding an Open Frame to an HTML element

Add a `data-cu-frame-style` attribute to the target HTML element. The attribute can have one of the following values:

- `open-right`
- `open-left`

The API will attempt to use the padding of the frame target or its children to place the frame correctly.

The `open-right` style will place the frame line in the center of the top, right, left, and bottom padding.

The `open-left` style will start the frame line to the right of the frame target's first child, and expects that the child element is less than 100% width of the frame target.

### Optional settings

In addition to `data-cu-frame-style`, the following optional settings are available:

- `data-cu-frame-size`: A number, in pixels, of the frame line width. Defaults to 20.
- `data-cu-frame-color`: Any [CSS color value][]. Defaults to 'white'.


[ILR Branding Guidelines]: https://brand.ilr.cornell.edu/our-visual-style/open-frame
[CSS color value]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
