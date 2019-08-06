(function (document) {
  const video_trigger_present = document.querySelectorAll('.cu-icon--play').length;
  if (video_trigger_present) {
    document.addEventListener("click", function (event) {
      if (event.target.matches('.cu-icon--play')) {
        let videoId = event.target.id.replace('toggle', '');
        let videoElement = document.getElementById(videoId);
        // @todo - refactor to something more flexible/predictable
        let overlayContent = event.target.closest('div').parentElement;
        handlePlayButton(videoElement, overlayContent);
        event.target.style.opacity = 1;
      }

      function handlePlayButton(videoElement, overlayContent) {
        if (videoElement.paused) {
          videoElement.play();
          overlayContent.style.display = 'none';
          videoElement.controls = true;
        }
      }
    });
  }
})(document);
