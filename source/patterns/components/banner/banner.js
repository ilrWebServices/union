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
