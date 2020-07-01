Icons are svg data embedded in an inline `svg` element via the `use` element and svg fragment identifiers.

The following variables are available:

`title`: A title for the icon. Generally used for tooltips and accessibility.

`icon`: The name if the desired icon. Currently available:

-  check-circle
-  cornell-seal
-  facebook
-  handshake
-  ilr-nickname
-  instagram
-  linkedin
-  mortarboard
-  news-phone
-  newsletter
-  speech-bubble
-  student
-  tower
-  twitter
-  youtube

`size`: The size of the icon in CSS units (e.g. 18px, 2em). (optional; default: 2em)

`label`: An optional visible text label to be displayed alongside the icon. (optional)

`label_element`: The HTML element for the icon label. (default: `div`)

`link`: A url/uri that will be added to an `a` tag around the icon and label.

attributes: An array or Drupal attributes object for things like classes. Useful for passing in variant classes. (optional)

The following variants are available:

`.cu-icon--inline`: Places the icon, label, and wrapper inline.

`.cu-icon--inline-centered`: Places the label inline and centers the wrapper.

`.cu-icon--color-light`: Uses a lighter color for the icon and label for use with dark backgrounds.

`.cu-icon--color-brand`: Uses the brand color for the icon and label.
