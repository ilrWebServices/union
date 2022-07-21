(function (document) {
  document.addEventListener('click', function(event) {
    if (event.target.matches('.cu-testimonial__media .cu-image')) {
      let chosen = event.target.closest('.cu-testimonial');
      let deck = event.target.closest('.cu-testimonial-deck');
      let testimonials = deck.getElementsByClassName('cu-testimonial');
      deck.insertBefore(chosen, testimonials[0]);
    }
  }, false);
})(document);
