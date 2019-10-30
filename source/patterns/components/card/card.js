// Javascript enhancements for Card components.
(function (window, document) {

  let observer = new MutationObserver(function(mutations, observer) {
    // Check to see if any of the mutations added nodes to the DOM.
    let added_children = false;

    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        added_children = true;
        break;
      }
    }

    // Return if not adding children.
    if (!added_children) {
      return;
    }

    // Allow text selection of overlaid card links.
    const card_links = document.querySelectorAll('.cu-card__link');

    for (const card_link of card_links) {
      let card_parent = card_link.closest('.cu-card');
      card_link.style.pointerEvents = 'none';
      card_parent.style.cursor = 'Pointer';
    }
  });

  observer.observe(document, {
    childList: true,
    subtree: true
  });

  document.addEventListener('click', function(event) {
    let card_parent = event.target.closest('.cu-card');
    if (!card_parent) {
      return;
    }

    let card_link = card_parent.querySelector('.cu-card__link');
    if (!card_link) {
      return;
    }

    selection = window.getSelection();

    if (selection.type !== 'Range') {
      // card_link.click();
      card_link.click();
    }
  }, false);

})(window, document);
