## Overview

Video components are low-level video elements with some helper functionality.

## Description

The following variables are available:

- `src`: A string with the video URL. Or:
- `sources`: An array of objects with two keys: `src` and `type`. Ignored if `src` is set.
- `poster`: A string with an image URL. Default ''.
- `controls`: A boolean to enable or disable video player controls. Default TRUE.
- `autoplay`: A boolean to enable or disable immediate playback. Default FALSE.
- `loop`: A boolean to enable or disable video replay. Default FALSE.
- `fallback`: A string with text or markup to display if the browser doesn't support the `video` element.
