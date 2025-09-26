class FormHandler {
  selectors = {
    root: "[data-js-form]",
    segmentedButton: "[data-js-segmented-button]",
    segmentedButtonEmail: "[data-js-segmented-button-email]",
    segmentedButtonPhone: "[data-js-segmented-button-phone]",
    fieldEmail: "[data-js-field-email]",
    inputEmail: "[data-js-input-email]",
    errorEmail: "[data-js-error-email]",
    fieldPhone: "[data-js-field-phone]",
    inputPhone: "[data-js-input-phone]",
    errorPhone: "[data-js-error-phone]",
    fieldPassword: "[data-js-field-password]",
    inputPassword: "[data-js-input-password]",
    togglePassword: "[data-js-toggle-password]",
    togglePasswordIcon: "[data-js-toggle-password-icon]",
    errorPassword: "[data-js-error-password]",
    fieldConfirmPassword: "[data-js-field-confirm-password]",
    inputConfirmPassword: "[data-js-input-confirm-password]",
    toggleConfirmPassword: "[data-js-toggle-confirm-password]",
    toggleConfirmPasswordIcon: "[data-js-toggle-confirm-password-icon]",
    errorConfirmPassword: "[data-js-error-confirm-password]",
    checkbox: "[data-js-checkbox]",
    submitButton: "[data-js-submit-button]",
  };

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    this.segmentedButtonElement = this.rootElement.querySelector(this.selectors.segmentedButton);
    this.segmentedButtonEmailElement = this.rootElement.querySelector(this.selectors.segmentedButtonEmail);
    this.segmentedButtonPhoneElement = this.rootElement.querySelector(this.selectors.segmentedButtonPhone);
    this.fieldEmailElement = this.rootElement.querySelector(this.selectors.fieldEmail);
    this.inputEmailElement = this.rootElement.querySelector(this.selectors.inputEmail);
    this.errorEmailElement = this.rootElement.querySelector(this.selectors.errorEmail);
    this.fieldPhoneElement = this.rootElement.querySelector(this.selectors.fieldPhone);
    this.inputPhoneElement = this.rootElement.querySelector(this.selectors.inputPhone);
    this.errorPhoneElement = this.rootElement.querySelector(this.selectors.errorPhone);
    this.fieldPasswordElement = this.rootElement.querySelector(this.selectors.fieldPassword);
    this.inputPasswordElement = this.rootElement.querySelector(this.selectors.inputPassword);
    this.togglePasswordElement = this.rootElement.querySelector(this.selectors.togglePassword);
    this.togglePasswordIconElement = this.rootElement.querySelector(this.selectors.togglePasswordIcon);
    this.errorPasswordElement = this.rootElement.querySelector(this.selectors.errorPassword);
    this.fieldConfirmPasswordElement = this.rootElement.querySelector(this.selectors.fieldConfirmPassword);
    this.inputConfirmPasswordElement = this.rootElement.querySelector(this.selectors.inputConfirmPassword);
    this.toggleConfirmPasswordElement = this.rootElement.querySelector(this.selectors.toggleConfirmPassword);
    this.toggleConfirmPasswordIconElement = this.rootElement.querySelector(this.selectors.toggleConfirmPasswordIcon);
    this.errorConfirmPasswordElement = this.rootElement.querySelector(this.selectors.errorConfirmPassword);
    this.checkboxElement = this.rootElement.querySelector(this.selectors.checkbox);
    this.submitButtonElement = this.rootElement.querySelector(this.selectors.submitButton);

    this.initSegmentedButton();
    this.initPasswordToggle();
  };

  initSegmentedButton() {
    this.segmentedButtonElement.addEventListener("click", (event) => {
      if (!event.target.classList.contains("segmented-button__item--active")) {
        this.toggleSegmentedButton(event.target);
        this.updateVisibleField(event.target);
      }
    });
  };

  toggleSegmentedButton(button) {
    const activeSegmentedButton = this.segmentedButtonElement.querySelector(".segmented-button__item--active");
    activeSegmentedButton.classList.remove("segmented-button__item--active");
    button.classList.add("segmented-button__item--active");
  };

  updateVisibleField(button) {
    if (button.dataset.jsSegmentedButtonEmail !== undefined) {
      this.fieldEmailElement.classList.remove("visually-hidden");
      this.fieldPhoneElement.classList.add("visually-hidden");
    } else {
      this.fieldPhoneElement.classList.remove("visually-hidden");
      this.fieldEmailElement.classList.add("visually-hidden");
    }
  };

  initPasswordToggle() {
    this.togglePasswordElement.addEventListener("click", () => {
      this.togglePassword(this.inputPasswordElement, this.togglePasswordElement, this.togglePasswordIconElement);
    });

    this.toggleConfirmPasswordElement.addEventListener("click", () => {
      this.togglePassword(this.inputConfirmPasswordElement, this.toggleConfirmPasswordElement, this.toggleConfirmPasswordIconElement);
    });
  };

  togglePassword(input, button, icon) {
    if (input.type === "password") {
      input.type = "text";
      icon.src = "./assets/icons/visibility.svg";
      button.setAttribute("aria-label", "Hide password");
      button.setAttribute("title", "Hide password");
    } else {
      input.type = "password";
      icon.src = "./assets/icons/visibility-off.svg";
      button.setAttribute("aria-label", "Show password");
      button.setAttribute("title", "Show password");
    }
  };
}

new FormHandler();