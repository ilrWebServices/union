(function (document) {
  const registrationForms = document.querySelectorAll('.cu-registration-form');

  if (registrationForms == null) {
    return;
  }

  for (const registrationForm of registrationForms) {
    let activePriceSet = false;
    const prices = registrationForm.querySelectorAll('.cu-registration-form .cu-js-price');

    // Loop through and hide all price displays on the checkbuttons,
    // and store the price value on the associated input for later use.
    for (const price of prices) {
      price.style.display = 'none';
      price.stringValue = price.textContent;
      let inputId = price.closest('label').getAttribute('for');
      let input = document.getElementById(inputId);
      input.price = price.stringValue;

      // Set the active price if the radio is checked.
      if (input.checked) {
        setActivePrice(registrationForm, input);
      }
    }

    // Set the active price based on the first element if none are checked.
    if (!activePriceSet) {
      let input = registrationForm.querySelector('input[type=radio][name="event-checkbutton"]');
      input.checked = true;
      setActivePrice(registrationForm, input);
    }
  }

  function checkButtonChangeHandler(event) {
    setActivePrice(event.target.closest('form'), event.target);
  }

  function setActivePrice(registrationForm, input) {
    let priceElement = registrationForm.querySelector('.cu-registration-form__active-price');
    priceElement.textContent = input.getAttribute('data-price');
    activePriceSet = true;
  }

  let checkbuttons = document.querySelectorAll('input[type=radio][name="event-checkbutton"]');

  Array.prototype.forEach.call(checkbuttons, function (checkbutton) {
    checkbutton.addEventListener('change', checkButtonChangeHandler);
  });
})(document);
