## Overview

Banners display full-width and are used to:

- display page headers with navigation
- highlight and link to important announcements
- display videos with content overlays

## Description

Banners are similar to cards, but they are ususally displayed full-width and behave differently when resized.

The following variables are available:

`media`: An HTML `replaced element` (e.g. img or video).

`content`: Any markup. It will be aligned with the bottom of the video, so be aware of the length of the content.

## Variations

### Announcement Banner

Announcement banners (`cu-banner--announcement`) place the title over the image while the content flows into a second column on wider displays. They will initially be used in combination with the dismissible components, as a way to include an important announcement at the top of a page. Usage may extend over time, though frequent usage should probably be avoided so that they are more visible.

### Video Banner

Video banners (`cu-banner--video`) display a video component with overlayed content. If the content contains a `play` icon, that icon will control the playback of any video found inside the media section.
