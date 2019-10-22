(function (document) {

  const displayTopicList = function () {
    const listContainers = document.querySelectorAll('.cu-course-finder__topics-list');

    // Show the list.
    listContainers.forEach(function (container) {
      container.classList.add('topics-list--expanded');
    });
  }

  document.addEventListener('click', function (event) {
    if (event.target.matches('.cu-course-finder__trigger')) {
      displayTopicList(event.target);
    }
  }, false);

  // Able to close topic list by hitting escape
  document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
      // Find element that was active when escape was hit
      const activeContainers = document.querySelectorAll('.topics-list--expanded');

      // Hide the list.
      activeContainers.forEach(function (container) {
        container.classList.remove('topics-list--expanded');
      });
    }
  });

})(document);
