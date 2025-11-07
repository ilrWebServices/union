(function(document) {

  'use strict';

  /**
   * Define behavior for the <cu-testimonials> custom element.
   */
  class cuTestimonials extends HTMLElement {

    #currentItem = 0;
    #items;
    #itemsArray;
    #thumbs = [];
    #elements = {
      play_pause: document.createElement('div'),
      thumb_container: document.createElement('ul')
    };
    #observer;
    #timer;
    #isVisible = false;

    constructor() {
      super();

      // tabindex is set so that this component is focusable, but the value is
      // -1 so it can't be reached by the `tab` key.
      this.setAttribute('tabindex', '-1');
    }

    connectedCallback() {
      this.#items = this.querySelectorAll('.cu-testimonial');
      this.#itemsArray = Array.from(this.#items);

      this.#elements.play_pause.classList.add('cu-testimonial-deck__playpause');
      this.#elements.thumb_container.classList.add('cu-testimonial-deck__thumbnails');

      this.append(this.#elements.play_pause);
      this.append(this.#elements.thumb_container);

      // TODO: Honor https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
      if (window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true) {
        this.dataset.state = 'paused';
      }

      this.#observer = new IntersectionObserver((entries, observer) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            this.#thumbs.at(entry.target.dataset.item).classList.add('active');
            this.#currentItem = this.#itemsArray.indexOf(entry.target);
          }
          else {
            entry.target.classList.remove('active');
            this.#thumbs.at(entry.target.dataset.item).classList.remove('active');
          }
        }
      }, {
        root: this,
        rootMargin: "0px",
        threshold: .5,
      });

      for (const item of this.#items) {
        this.#observer.observe(item);
        item.dataset.item = this.#itemsArray.indexOf(item);
        let thumb = document.createElement('div');
        thumb.classList.add('cu-testimonial-deck__thumbnail');
        thumb.dataset.item = this.#itemsArray.indexOf(item);
        this.#thumbs.push(thumb);
        this.#elements.thumb_container.append(thumb);
      }

      // Set #isVisible if this deck is partially in the viewport.
      const in_view_observer = new IntersectionObserver((entries, observer) => {
        // Since only one item, this deck, is observed, the array will always only have one item.
        this.#isVisible = entries[0].isIntersecting;
      }, {
        root: document,
        threshold: .25,
      });

      in_view_observer.observe(this);

      this.addEventListener("touchmove", (event) => {
        if (event.target === this.#elements.play_pause) {
          return;
        }

        if (this.dataset.state === 'playing') {
          this.pause();
        }
      });

      this.pause();

      this.addEventListener('click', (event) => {
        this.delegateClick(event);
      });
    }

    delegateClick(event) {
      if (event.target === this.#elements.play_pause) {
        if (this.dataset.state === 'paused') {
          this.play();
        }
        else {
          this.pause();
        }

        return;
      }

      if (this.#thumbs.includes(event.target)) {
        this.#currentItem = event.target.dataset.item;
        this.moveCenter(this.#items[this.#currentItem]);
      }

      this.pause();
    }

    next() {
      this.#currentItem++;
      if (this.#currentItem > this.#items.length - 1) {
        this.#currentItem = 0;
      }
      this.moveCenter(this.#items[this.#currentItem]);
    }

    prev() {}

    pause() {
      this.dataset.state = 'paused';
      clearInterval(this.#timer);
    }

    play() {
      this.dataset.state = 'playing';
      this.#timer = setInterval(() => {
        if (this.#isVisible) {
          this.next();
        }
      }, 5000);
      this.next();
    }

    moveCenter(item) {
      item.scrollIntoView({ behavior: "smooth", block: "start", inline: "center" });
    }

  }

  customElements.define("cu-testimonial-deck", cuTestimonials);

})(document);
