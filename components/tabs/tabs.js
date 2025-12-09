/**
 * @file
 * Tabs component JavaScript.
 *
 * Handles tab switching, keyboard navigation, and mobile select synchronization.
 */

(function () {
  'use strict';

  /**
   * Initialize tabs functionality for a single cu-tabs element.
   *
   * @param {HTMLElement} tabsElement - The cu-tabs custom element.
   */
  function initTabs(tabsElement) {
    const tabList = tabsElement.querySelector('.cu-tabs__list');
    const tabs = tabsElement.querySelectorAll('.cu-tabs__tab');
    const panels = tabsElement.querySelectorAll('.cu-tabs__panel');
    const select = tabsElement.querySelector('.cu-tabs__select');

    if (!tabs.length || !panels.length) {
      return;
    }

    /**
     * Activate a specific tab by index.
     *
     * @param {number} index - The index of the tab to activate.
     * @param {boolean} focus - Whether to focus the tab button.
     */
    function activateTab(index, focus = false) {
      // Deactivate all tabs
      tabs.forEach((tab, i) => {
        tab.classList.remove('cu-tabs__tab--active');
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
        panels[i].classList.remove('cu-tabs__panel--active');
        panels[i].setAttribute('hidden', '');
      });

      // Activate selected tab
      tabs[index].classList.add('cu-tabs__tab--active');
      tabs[index].setAttribute('aria-selected', 'true');
      tabs[index].setAttribute('tabindex', '0');
      panels[index].classList.remove('cu-tabs__panel--active');
      panels[index].classList.add('cu-tabs__panel--active');
      panels[index].removeAttribute('hidden');

      // Sync mobile select
      if (select) {
        select.value = index;
      }

      // Focus if requested
      if (focus) {
        tabs[index].focus();
      }

      // Scroll active tab into view on desktop
      if (tabList && window.innerWidth >= 976) {
        tabs[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }

    // Tab click handlers
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        activateTab(index);
      });
    });

    // Keyboard navigation
    if (tabList) {
      tabList.addEventListener('keydown', (event) => {
        const currentIndex = Array.from(tabs).findIndex(
          tab => tab.getAttribute('aria-selected') === 'true'
        );

        let newIndex = currentIndex;

        switch (event.key) {
          case 'ArrowDown':
          case 'ArrowRight':
            event.preventDefault();
            newIndex = (currentIndex + 1) % tabs.length;
            break;
          case 'ArrowUp':
          case 'ArrowLeft':
            event.preventDefault();
            newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            break;
          case 'Home':
            event.preventDefault();
            newIndex = 0;
            break;
          case 'End':
            event.preventDefault();
            newIndex = tabs.length - 1;
            break;
          default:
            return;
        }

        activateTab(newIndex, true);
      });
    }

    // Mobile select change handler
    if (select) {
      select.addEventListener('change', (event) => {
        const index = parseInt(event.target.value, 10);
        activateTab(index);
      });
    }
  }

  /**
   * Initialize all tabs components on the page.
   */
  function initAllTabs() {
    const tabsElements = document.querySelectorAll('cu-tabs');
    tabsElements.forEach(initTabs);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllTabs);
  } else {
    initAllTabs();
  }

  // Re-initialize on Drupal behaviors attach (for AJAX-loaded content)
  if (typeof Drupal !== 'undefined' && Drupal.behaviors) {
    Drupal.behaviors.cuTabs = {
      attach: function (context) {
        const tabsElements = context.querySelectorAll('cu-tabs');
        tabsElements.forEach(initTabs);
      }
    };
  }
})();
