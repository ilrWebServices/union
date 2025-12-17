/**
 * @file
 * Tabs component JavaScript.
 */

(function () {

  'use strict';

  class cuTabs extends HTMLElement {

    connectedCallback() {
      let first_tab = this.querySelector('.cu-tabs__tab-link');

      this.addEventListener('click', (event) => {
        this.delegateClick(event);
      });

      if (first_tab) {
        first_tab.click();
      }
    }

    delegateClick(event) {
      if (event.target.matches('.cu-tabs__tab-link')) {
        event.preventDefault();
        let tabs = this.querySelectorAll('.cu-tabs__tab-link');
        let panels = this.querySelectorAll('.cu-tabs__panel');

        if (!tabs) {
          return;
        }

        for (const tab of tabs) {
          tab.setAttribute('aria-selected', 'false');
        }
        event.target.setAttribute('aria-selected', 'true');

        for (const panel of panels) {
          panel.classList.add('visually-hidden');
        }
        this.querySelector(event.target.getAttribute('href')).classList.remove('visually-hidden');
        this.querySelector('input[type="checkbox"]').checked = false;
      }
    }

  }

  customElements.define("cu-tabs", cuTabs);

})();
