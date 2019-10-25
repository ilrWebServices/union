(function(window, document) {

  const processRegistrationForms = function() {
    const registrationForms = document.querySelectorAll('.cu-registration-form');

    if (registrationForms == null) {
      return;
    }

    for (const registrationForm of registrationForms) {
      const prices = registrationForm.querySelectorAll('.cu-js-price');
      const buttons = registrationForm.querySelectorAll('.cu-button');
      const input_name = registrationForm.querySelector('.cu-checkbutton__input').getAttribute('name');

      // Hide any displayed prices.
      prices.forEach(function(price) {
        price.style.display = 'none';
      });

      // Hide any checkbutton registration links.
      buttons.forEach(function (button) {
        button.style.display = 'none';
      });

      let first_input = registrationForm.querySelector('input[name="' + input_name + '"]')
      let checked_input = registrationForm.querySelector('input[name="' + input_name + '"]:checked');

      // If there is a checked input, activate its price.
      if (checked_input) {
        setActivePrice(registrationForm, checked_input);
        addRegistrationButton(registrationForm, checked_input);
      }
      // Otherwise, activate the price of the first input.
      else {
        first_input.checked = true;
        setActivePrice(registrationForm, first_input);
        addRegistrationButton(registrationForm, first_input);
      }
    }
  }

  const checkButtonChangeHandler = function(checkbutton_input) {
    let registrationForm = checkbutton_input.closest('form');
    setActivePrice(registrationForm, checkbutton_input);
    setRegisterLink(registrationForm, checkbutton_input);
  }

  const setActivePrice = function(registrationForm, input) {
    let priceElement = registrationForm.querySelector('.cu-registration-form__active-price');
    priceElement.textContent = input.dataset.price;
    activePriceSet = true;
  }

  const addRegistrationButton = function (registrationForm, checked_input) {
    let registerButton = document.createElement('a');
    registerButton.setAttribute('class', 'cu-button cu-button--alt cu-js-register-link');
    registerButton.setAttribute('href', checked_input.value);
    registerButton.innerHTML = 'Register';
    checked_input.parentNode.parentNode.appendChild(registerButton, registrationForm);
  }

  const setRegisterLink = function (registrationForm, checked_input) {
    let registerButton = registrationForm.querySelector('.cu-js-register-link');
    registerButton.setAttribute('href', checked_input.value);
  }

  window.addEventListener('DOMContentLoaded', processRegistrationForms);

  document.addEventListener('change', function(event) {
    if (event.target.matches('.cu-checkbutton__input')) {
      checkButtonChangeHandler(event.target);
    }
  }, false);

})(window, document);
