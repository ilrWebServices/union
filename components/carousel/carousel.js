(function (window, document) {

  const moveCarousel = function(carousel, direction) {
    let carouselItemWrapper = carousel.querySelector('.cu-carousel__item-wrapper');
    let distance = 225;

    if (direction == 'prev') {
      distance = distance * -1;
    }

    carouselItemWrapper.scrollBy({ behavior: "smooth", top: 0, left: distance });
  };

  window.addEventListener('load', function() {
    let carouselNavs = document.querySelectorAll('.cu-carousel__navigation-button');

    carouselNavs.forEach(element => {
      element.addEventListener('click', function(event) {
        let carousel = element.closest('.cu-carousel');
        moveCarousel(carousel, element.dataset.direction);
      });
    });
  });

})(window, document);
