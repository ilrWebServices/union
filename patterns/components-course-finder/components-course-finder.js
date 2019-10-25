(function(document) {

  document.addEventListener('click', function(event) {
    if (event.target.matches('.cu-course-finder__trigger')) {
      if (event.target.parentNode.matches('.topics-list--expanded')) {
        event.target.parentNode.classList.remove('topics-list--expanded');
        event.target.setAttribute('aria-expanded', 'false');
      }
      else {
        event.target.parentNode.classList.add('topics-list--expanded');
        event.target.setAttribute('aria-expanded', 'true');
      }
    }
  }, false);

  // Enable topic list collapse by hitting escape.
  document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
      const topic_triggers = document.querySelectorAll('.topics-list--expanded .cu-course-finder__trigger');

      topic_triggers.forEach(function(topic_trigger) {
        topic_trigger.click();
      });
    }
  });

})(document);
