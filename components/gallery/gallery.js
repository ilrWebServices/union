(function(document) {

  'use strict';

  /**
   * Define behavior for the <cu-gallery> custom element.
   */
  class cuGallery extends HTMLElement {

    #currentItem = 0;
    #items;
    #itemsArray;
    #thumbs = [];
    #observer;

    constructor() {
      super();

      // tabindex is set so that this component is focusable, but the value is
      // -1 so it can't be reached by the `tab` key.
      this.setAttribute('tabindex', '-1');
    }

    connectedCallback() {
      this.addEventListener('click', this.navigate);
      this.addEventListener('keydown', this.navigate);
      this.addEventListener('mouseover', () => {
        this.focus();
      });
      this.addEventListener('mouseout', () => {
        this.blur();
      });
      this.classList.add('js');
      this.#items = this.querySelectorAll('.cu-gallery__item');
      this.#itemsArray = Array.from(this.#items);

      let item_wrapper = this.querySelector('.cu-gallery__item-wrapper');
      let items_container = this.querySelector('.cu-gallery__items');
      let nav_prev = document.createElement('div');
      let nav_next = document.createElement('div');
      let img_blank_start = document.createElement('div');
      let img_blank_end = document.createElement('div');
      let thumbs = document.createElement('ul');

      nav_prev.classList.add('cu-gallery__navigation', 'cu-gallery__navigation-prev');
      nav_next.classList.add('cu-gallery__navigation', 'cu-gallery__navigation-next');
      img_blank_start.classList.add('cu-gallery__item', 'cu-gallery__item--blank', 'cu-gallery__item--blank-start');
      img_blank_end.classList.add('cu-gallery__item', 'cu-gallery__item--blank', 'cu-gallery__item--blank-end');
      this.append(nav_prev);
      this.append(nav_next);
      thumbs.classList.add('cu-gallery__thumbnails');
      this.append(thumbs);

      items_container.prepend(img_blank_start);
      items_container.append(img_blank_end);

      this.#observer = new IntersectionObserver((entries, observer) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.remove('obscured');
            // TODO: Find a way to use this without breaking the nav button functionality.
            // this.#currentItem = this.#itemsArray.indexOf(entry.target);
          }
          else {
            entry.target.classList.add('obscured');
          }
        }
      }, {
        root: this,
        rootMargin: "0px",
        threshold: 1.0,
      });

      for (const item of this.#items) {
        this.#observer.observe(item);
        let thumb = document.createElement('li');
        thumb.classList.add('cu-gallery__thumbnail');
        thumb.dataset.item = this.#itemsArray.indexOf(item);
        thumb.dataset.thumb = this.getThumbnail(item) ?? '';
        this.#thumbs.push(thumb);
        thumbs.append(thumb);
      }

      if (this.#thumbs[this.#items.length - 1].dataset.thumb) {
        img_blank_start.style.setProperty('--cu-gallery-item-blank-bg', "no-repeat center/cover url('" + this.#thumbs[this.#items.length - 1].dataset.thumb + "')");
      }
      if (this.#thumbs[0].dataset.thumb) {
        img_blank_end.style.setProperty('--cu-gallery-item-blank-bg', "no-repeat center/cover url('" + this.#thumbs[0].dataset.thumb + "')");
      }

      this.#thumbs[this.#currentItem].classList.add('active');

      // Move first item to center without calling moveItem(), which also
      // scrolls vertically, which we don't want on page load.
      setTimeout(() => {
        // This value is an educated guess. The first blank slide has a height
        // set in CSS (currently 180px, 270px, or 360px) and an aspect ration of
        // 1.5. We scroll to where we assume the edge of that blank slide will
        // be and let the CSS `scroll-snap-align` property take over to center
        // it. This still needs to run in a timeout because it seems we still
        // need time for the images and other replaceable content to load.
        item_wrapper.scrollLeft = 270;
      }, '1500');

    }

    getThumbnail(item) {
      let media_element = item.querySelector('img[src], video[poster]');

      if (!media_element) {
        return null;
      }
      else if (media_element.matches('img')) {
        return media_element.src;
      }
      else if (media_element.matches('video')) {
        return media_element.poster;
      }
    }

    navigate(event) {
      if (event.target.closest('.cu-gallery__item--blank-start')) {
        this.#currentItem = this.#items.length - 1;
        this.moveCenter(this.#items[this.#currentItem]);
      }

      if (event.target.closest('.cu-gallery__item--blank-end')) {
        this.#currentItem = 0;
        this.moveCenter(this.#items[this.#currentItem]);
      }

      if (event.target.closest('.cu-gallery__item:not(.cu-gallery__item--blank)')) {
        let selected_item = event.target.closest('.cu-gallery__item');
        this.#currentItem = this.#itemsArray.indexOf(selected_item);
        this.moveCenter(selected_item);
      }

      if (event.target.matches('.cu-gallery__navigation-prev') || (event.type === 'keydown' && event.key === 'ArrowLeft')) {
        this.#currentItem--;
        if (this.#currentItem < 0) {
          this.#currentItem = this.#items.length - 1;
        }
        this.moveCenter(this.#items[this.#currentItem]);
      }

      if (event.target.matches('.cu-gallery__navigation-next') || (event.type === 'keydown' && event.key === 'ArrowRight')) {
        this.#currentItem++;
        if (this.#currentItem > this.#items.length - 1) {
          this.#currentItem = 0;
        }
        this.moveCenter(this.#items[this.#currentItem]);
      }

      if (event.target.matches('.cu-gallery__thumbnail')) {
        this.#currentItem = event.target.dataset.item;
        this.moveCenter(this.#items[this.#currentItem]);
      }
    }

    moveCenter(item) {
      item.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });

      for (const thumb of this.#thumbs) {
        thumb.classList.remove('active');
      }
      this.#thumbs[this.#currentItem].classList.add('active');
    }

  }

  customElements.define("cu-gallery", cuGallery);

})(document);
