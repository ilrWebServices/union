(function (document) {
  initDecks = function() {
    const decks =  document.getElementsByClassName('cu-testimonial-deck');
    for (let deck of decks) {
      let testimonials = deck.getElementsByClassName('cu-testimonial');
      let copy = testimonials[0].cloneNode(true);
      copy.dataset.selected = 'selected';//('dataselected', 'selected');
      deck.insertBefore(copy, testimonials[1]);
    }
  };

  document.addEventListener('click', function(event) {
    if (event.target.matches('.cu-testimonial__media .cu-image')) {
      let chosen = event.target.closest('.cu-testimonial');

      if (chosen.getAttribute('data-current')) {
        return;
      }

      let copy = chosen.cloneNode(true);
      let deck = event.target.closest('.cu-testimonial-deck');
      let testimonials = deck.getElementsByClassName('cu-testimonial');
      let previous = deck.querySelectorAll('[data-selected="selected"]');
      testimonials[0].remove();
      deck.insertBefore(copy, testimonials[0]);
      copy.dataset.current = 'current';
      delete previous[0].dataset.selected;
      chosen.dataset.selected = 'selected';
    }
  }, false);

  initDecks();
})(document);
