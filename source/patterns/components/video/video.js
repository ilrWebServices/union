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
