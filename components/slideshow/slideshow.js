(function(document) {

  'use strict';

  /**
   * Define behavior for the <cu-slideshow> custom element.
   */
  class cuSlideshow extends HTMLElement {

    #currentItem = 0;
    #items;
    #itemsArray;
    #dots = [];
    #elements = {
      controls: document.createElement('div'),
      pagination: document.createElement('ul'),
      play_pause: this.createElementFromTemplate(`<button class="cu-slideshow__playpause" data-operation="playtoggle" aria-label="Play/Pause slideshow"><svg width="37" height="37" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" version="1.1" viewBox="0 0 37 37" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
        <path class="play" d="m 15.5,24.5 9.5,-6 -9.5,-6 v 12"></path>
        <path class="pause" d="M 15.5,24.5 v -12 M 20.5, 12.5 v 12"></path>
      </svg></button>`)
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
      this.#items = this.querySelectorAll('.cu-slideshow__item');
      this.#itemsArray = Array.from(this.#items);

      this.#elements.controls.classList.add('cu-slideshow__controls');
      this.#elements.pagination.classList.add('cu-slideshow__pagination');

      // Append controls container with play/pause button and pagination
      this.append(this.#elements.controls);
      this.#elements.controls.append(this.#elements.play_pause);
      this.#elements.controls.append(this.#elements.pagination);

      // Honor prefers-reduced-motion
      if (window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true) {
        this.dataset.state = 'paused';
      }

      this.#observer = new IntersectionObserver((entries, observer) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            this.#dots.at(entry.target.dataset.item).classList.add('active');
            this.#currentItem = this.#itemsArray.indexOf(entry.target);
          }
          else {
            entry.target.classList.remove('active');
            this.#dots.at(entry.target.dataset.item).classList.remove('active');
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
        
        let dot = document.createElement('button');
        dot.classList.add('cu-slideshow__dot');
        dot.dataset.item = this.#itemsArray.indexOf(item);
        dot.setAttribute('aria-label', `Go to slide ${parseInt(item.dataset.item) + 1}`);
        this.#dots.push(dot);
        this.#elements.pagination.append(dot);
      }

      // Set #isVisible if this slideshow is partially in the viewport.
      const in_view_observer = new IntersectionObserver((entries, observer) => {
        // Since only one item, this slideshow, is observed, the array will always only have one item.
        this.#isVisible = entries[0].isIntersecting;
      }, {
        root: document,
        threshold: .25,
      });

      in_view_observer.observe(this);

      // Pause on touch/mouse interaction
      this.addEventListener("touchmove", (event) => {
        if (event.target === this.#elements.play_pause) {
          return;
        }

        if (this.dataset.state === 'playing') {
          this.pause();
        }
      });

      // Pause on hover
      this.addEventListener("mouseenter", () => {
        if (this.dataset.state === 'playing') {
          this.pause();
        }
      });

      // Resume on mouse leave (if it was playing before)
      this.addEventListener("mouseleave", () => {
        if (this.dataset.state === 'paused' && !this.dataset.userPaused) {
          this.play();
        }
      });

      // Pause on focus
      this.addEventListener("focusin", () => {
        if (this.dataset.state === 'playing') {
          this.pause();
        }
      });

      // Keyboard navigation
      this.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          this.prev();
          this.pause();
          this.dataset.userPaused = 'true';
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          this.next();
          this.pause();
          this.dataset.userPaused = 'true';
        }
      });

      this.pause();

      this.addEventListener('click', (event) => {
        this.delegateClick(event);
      });

      // Ensure we start on the first slide
      this.#currentItem = 0;
      this.moveCenter(this.#items[0]);

      // Auto-play after initialization (unless reduced motion is preferred)
      setTimeout(() => {
        if (!window.matchMedia(`(prefers-reduced-motion: reduce)`).matches) {
          this.play();
        }
      }, 100);

      // Handle dropdown navigation
      const dropdown = this.querySelector('.cu-slideshow__select');
      if (dropdown) {
        dropdown.addEventListener('change', (event) => {
          if (event.target.value) {
            window.location.href = event.target.value;
          }
        });
      }
    }

    delegateClick(event) {
      if (event.target === this.#elements.play_pause || event.target.closest('.cu-slideshow__playpause')) {
        if (this.dataset.state === 'paused') {
          this.play();
          this.dataset.userPaused = 'false';
        }
        else {
          this.pause();
          this.dataset.userPaused = 'true';
        }

        return;
      }

      if (this.#dots.includes(event.target)) {
        this.#currentItem = parseInt(event.target.dataset.item);
        this.moveCenter(this.#items[this.#currentItem]);
        this.pause();
        this.dataset.userPaused = 'true';
      }

      // Removed prev/next button handling since we're not using those buttons anymore
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
      }, 4000); // 4 seconds per slide as specified
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

  customElements.define("cu-slideshow", cuSlideshow);

})(document);
