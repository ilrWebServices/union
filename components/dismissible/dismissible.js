class cuDismissible extends HTMLElement {
  connectedCallback() {
    if (('localStorage' in window) === false) {
      return;
    }

    let digest = this.getAttribute('digest');
    let checkbox = this.querySelector('.cu-dismissible__input');

    // Has this element been dismissed? Tag it with a class if so.
    if (parseInt(localStorage.getItem('cu-diss-' + digest))) {
      checkbox.checked = true;
    }
    else {
      // Store the dismissal state in local storage.
      checkbox.addEventListener('change', function(event) {
        localStorage.setItem('cu-diss-' + digest, event.target.checked ? 1 : 0);
      }, false);
    }
  }
}

if (('customElements' in window) === true) {
  customElements.define('cu-dismissible', cuDismissible);
}
