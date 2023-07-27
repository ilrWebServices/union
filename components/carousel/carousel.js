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

    let carouselItemWrappers = document.querySelectorAll('.cu-carousel__item-wrapper');

    carouselItemWrappers.forEach(element => {
      // @TODO Switch from debounce to `scrollend` event when Safari gains support.
      element.addEventListener('scroll', debounce(function(event) {
        let wrapperRect = event.target.getBoundingClientRect();
        let firstItem = event.target.querySelector('.cu-carousel__item:first-of-type');
        let lastItem = event.target.querySelector('.cu-carousel__item:last-of-type');
        let firstItemRect = firstItem.getBoundingClientRect();
        let lastItemRect = lastItem.getBoundingClientRect();
        let carousel = event.target.closest('.cu-carousel');

        carousel.setAttribute('data-scrollposition', '');

        // This math stuff is here to deal with subpixel fractional values.
        if (Math.round(wrapperRect.left / firstItemRect.left * 100) === 100) {
          carousel.setAttribute('data-scrollposition', 'start');
        }

        if (Math.round(wrapperRect.right / lastItemRect.right * 100) === 100) {
          carousel.setAttribute('data-scrollposition', 'end');
        }
      }, 150));
    });
  });

  // @see Drupal.debounce.
  const debounce = function (func, wait, immediate) {
    let timeout;
    let result;
    return function (...args) {
      const context = this;
      const later = function () {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
        }
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
      }
      return result;
    };
  };

})(window, document);
