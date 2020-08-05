(function (document) {

  // Wire play icons to videos in banners.
  document.addEventListener('click', function(event) {
    if (event.target.matches('.cu-icon--play')) {
      // If the icon has a video target selector in a `data-cu-video-target`
      // attribute, use that. Otherwise, use the closest video.
      let video_element = document.querySelector(event.target.dataset.cuVideoTarget) || event.target.closest('.cu-banner').querySelector('.cu-banner__media video');
      let play = document.querySelector('.play');
      let pause = document.querySelector('.pause');

      if (video_element) {
        if (video_element.paused) {
          video_element.play();
          video_element.controls = true;
          play.classList.add('visually-hidden');
          pause.classList.remove('visually-hidden');
        } else {
          video_element.pause();
          pause.classList.add('visually-hidden');
          play.classList.remove('visually-hidden');
        }
      }
    }
  });

})(document);
