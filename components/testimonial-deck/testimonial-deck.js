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
      thumb_container: document.createElement('ul'),
      nav_container: document.createElement('div'),
      nav_prev: this.createElementFromTemplate(`<button class="cu-testimonial-deck__nav-button" data-operation="prev"><svg width="37" height="37" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" version="1.1" viewBox="0 0 37 37" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><path d="M21.5 24.5l-6-6 6-6"></path></svg></button>`),
      play_pause: this.createElementFromTemplate(`<button class="cu-testimonial-deck__nav-button cu-testimonial-deck__playpause" data-operation="playtoggle"><svg width="37" height="37" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" version="1.1" viewBox="0 0 37 37" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
        <path class="play" d="m 15.5,24.5 9.5,-6 -9.5,-6 v 12"></path>
        <path class="pause" d="M 15.5,24.5 v -12 M 20.5, 12.5 v 12"></path>
      </svg></button>`),
      nav_next: this.createElementFromTemplate(`<button class="cu-testimonial-deck__nav-button" data-operation="next"><svg width="37" height="37" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" version="1.1" viewBox="0 0 37 37" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><path d="m15.5,24.5 6,-6 -6,-6"></path></svg></button>`)
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

      this.#elements.thumb_container.classList.add('cu-testimonial-deck__thumbnails');
      this.#elements.nav_container.classList.add('cu-testimonial-deck__nav');

      this.append(this.#elements.thumb_container);
      this.append(this.#elements.nav_container);
      this.#elements.nav_container.append(this.#elements.nav_prev);
      this.#elements.nav_container.append(this.#elements.play_pause);
      this.#elements.nav_container.append(this.#elements.nav_next);

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

        // Use media src or poster as background image.
        let media = item.querySelector('.cu-testimonial__media img');

        if (media) {
          media.closest('.cu-testimonial__media').style.setProperty('--cu-testimonial-deck-media-url', "url('" + media.getAttribute('src') + "')");
        }
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

      if (event.target.closest('.cu-testimonial-deck__nav-button')) {
        let operation = event.target.closest('.cu-testimonial-deck__nav-button').dataset.operation;

        if (operation === 'prev') {
          this.prev();
        }
        else if (operation === 'next') {
          this.next();
        }
        else {
          if (this.dataset.state === 'playing') {
            this.pause();
          }
          else {
            this.play();
          }

          return;
        }

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

    prev() {
      this.#currentItem--;
      if (this.#currentItem < 0) {
        this.#currentItem = this.#items.length - 1;
      }
      this.moveCenter(this.#items[this.#currentItem]);
    }

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

    createElementFromTemplate(html) {
      const template = document.createElement('template');
      template.innerHTML = html.trim();
      return template.content.firstChild;
    }

  }

  customElements.define("cu-testimonial-deck", cuTestimonials);

})(document);
