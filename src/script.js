class Form {
  #elements = null;

  selectors = {
    root: "[data-js-form]",

    segmentedButton: {
      group: "[data-js-segmented-button]",
      item: "[data-js-segmented-button-item]",
      email: "[data-js-segmented-button-item-email]",
      phone: "[data-js-segmented-button-item-phone]",
    },

    fields: {
      email: {
        field: "[data-js-field-email]",
        input: "[data-js-input-email]",
        error: "[data-js-error-email]",
      },
      phone: {
        field: "[data-js-field-phone]",
        input: "[data-js-input-phone]",
        error: "[data-js-error-phone]",
      },
      password: {
        field: "[data-js-field-password]",
        input: "[data-js-input-password]",
        toggle: "[data-js-toggle-password]",
        toggleIcon: "[data-js-toggle-password-icon]",
        error: "[data-js-error-password]",
      },
      confirmPassword: {
        field: "[data-js-field-confirm-password]",
        input: "[data-js-input-confirm-password]",
        toggle: "[data-js-toggle-confirm-password]",
        toggleIcon: "[data-js-toggle-confirm-password-icon]",
        error: "[data-js-error-confirm-password]",
      },
    },

    checkbox: "[data-js-checkbox]",
    submitButton: "[data-js-submit-button]",
  }

  classes = {
    state: {
      visuallyHidden: "visually-hidden",
    },
    segmentedButton: {
      base: "segmented-button__item",
      active: "segmented-button__item--active",
    },
  }

  constructor() {
    this.root = document.querySelector(this.selectors.root);

    if (!this.root) {
      console.error("[Form] Root element not found.");
      return;
    }

    this.init();
  }

  init() {
    this.initEventListeners();
    this.setInitialFocus();
  }

  initEventListeners() {
    this.initSegmentedButtonListeners();
    this.initPasswordToggleListeners();
    this.initSubmitListener();
  }

  #getElement(selector) {
    const element = this.root.matches(selector) 
      ? this.root
      : this.root.querySelector(selector);
    
    if (!element) {
      console.error(`[Form] Element not found for selector: ${selector}.`);
    }

    return element;
  }

  collectElements(selectors) {
    const result = {};

    for (const [key, value] of Object.entries(selectors)) {
      if (typeof value === "string") {
        result[key] = this.#getElement(value);
      } else if (typeof value === "object" && value !== null) {
        result[key] = this.collectElements(value);
      }
    }

    return result;
  }

  get elements() {
    if (!this.#elements) {
      this.#elements = this.collectElements(this.selectors);
    }
    return this.#elements;
  }

  initSegmentedButtonListeners() {
    const segmentedButton = this.elements.segmentedButton.group;
    if (!segmentedButton) return;

    segmentedButton.addEventListener("click", this.#onSegmentClick);
  }

  #onSegmentClick = (event) => {
    const { base, active } = this.classes.segmentedButton;
    const segmentedButtonItem = event.target.closest(`.${base}`);

    if (
      !segmentedButtonItem || 
      segmentedButtonItem.classList.contains(active)
    ) {
      return;
    }

    this.setActiveSegment(segmentedButtonItem);
    this.updateVisibleFields(segmentedButtonItem);
  }
                                                                                                                                          
  setActiveSegment(selectedSegmentItem) {
    const segmentedButton = this.elements.segmentedButton.group;
    const activeClass = this.classes.segmentedButton.active;
    const previousItemActive = segmentedButton.querySelector(`.${activeClass}`);

    previousItemActive.classList.remove(activeClass);
    selectedSegmentItem.classList.add(activeClass);
  }

  setInitialFocus() {
    const emailInput = this.elements.fields.email.input;
    if (emailInput) {
      emailInput.focus();
    }
  }

  updateVisibleFields(selectedSegmentItem) {
    const emailField = this.elements.fields.email.field;
    const emailInput = this.elements.fields.email.input;
    const phoneField = this.elements.fields.phone.field;
    const phoneInput = this.elements.fields.phone.input;
    
    const isEmailActive = this.isEmailSegment(selectedSegmentItem);

    requestAnimationFrame(() => {
      if (isEmailActive) {
        emailInput.focus();
      } else {
        phoneInput.focus();
      }
    });

    this.toggleVisibility(emailField, !isEmailActive);
    this.toggleVisibility(phoneField, isEmailActive);

    this.clearErrors();
  }

  isEmailSegment(segmentItem) {
    return segmentItem.dataset.hasOwnProperty("jsSegmentedButtonItemEmail");
  }

  toggleVisibility(element, isHidden) {
    const visuallyHiddenClass = this.classes.state.visuallyHidden;
    element.classList.toggle(visuallyHiddenClass, isHidden);
  }

  clearHiddenFieldErrors() {
    const fields = this.elements.fields;

    for (const key in fields) {
      const fieldGroup = fields[key];
      const field = fieldGroup.field;

      if (!field) continue;

      const isHidden = field.classList.contains(this.classes.state.visuallyHidden);

      if (isHidden) {
        if (fieldGroup.error) fieldGroup.error.textContent = "";
        if (fieldGroup.input) fieldGroup.input.style.borderColor = "";
      }
    }
  }

  initPasswordToggleListeners() {
    const { password, confirmPassword } = this.elements.fields;

    this.setupPasswordField(password);
    this.setupPasswordField(confirmPassword);
  }

  setupPasswordField(field) {
    const { input, toggle, toggleIcon } = field;
    const visuallyHiddenClass = this.classes.state.visuallyHidden;

    if (!input || !toggle || !toggleIcon) return;

    toggle.addEventListener("mousedown", (event) => event.preventDefault());

    input.addEventListener("input", () => {
      toggle.classList.toggle(visuallyHiddenClass, input.value.trim() === "");
    });

    toggle.addEventListener("click", () => {
      this.togglePasswordVisibility(input, toggle, toggleIcon);
    });
  }

  togglePasswordVisibility(input, button, icon) {
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";

    requestAnimationFrame(() => {
      input.setSelectionRange(start, end);
    });

    icon.src = isHidden
      ? "./assets/icons/visibility.svg"
      : "./assets/icons/visibility-off.svg";

    button.setAttribute(
      "aria-label",
      isHidden ? "Hide password" : "Show password"
    );
    button.setAttribute(
      "title", 
      isHidden ? "Hide password" : "Show password"
    );
  }

  initSubmitListener() {
    const form = this.root;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      this.clearErrors();

      const isValid = this.validateForm();

      if (isValid) {
        alert("Form submitted successfully!");
      }
    });
  }

  clearErrors() {
    const fields = this.elements.fields;

    for (const key in fields) {
      const fieldGroup = fields[key];

      if (fieldGroup.error) fieldGroup.error.textContent = "";

      if (fieldGroup.input) fieldGroup.input.style.borderColor = "";
    }
  }

  validateForm() {
    const fields = this.elements.fields;
    let isValid = true;

    const activeSegment = this.getActiveSegment();

    if (activeSegment === "email") {
      const emailInputValue = fields.email.input.value.trim();

      if (emailInputValue === "") {
        this.showError(fields.email.error, "Please enter email address");
        isValid = false;
      } else if (!this.validateEmail(emailInputValue)) {
        this.showError(fields.email.error, "Invalid email address");
        isValid = false;
      }

    } else {
      const phoneInputValue = fields.phone.input.value.trim();

      if (phoneInputValue === "") {
        this.showError(fields.phone.error, "Please enter mobile number");
        isValid = false;
      } else if (!this.validatePhoneNumber(phoneInputValue)) {
        this.showError(fields.phone.error, "Invalid phone number");
        isValid = false;
      }
    }

    const passwordInputValue = fields.password.input.value;
    const confirmPasswordInputValue = fields.confirmPassword.input.value;

    if (!this.validatePassword(passwordInputValue)) {
      this.showError(
        fields.password.error,
        "Password has to be between 8-30 characters, and contains at least one uppercase letter, one lowercase letter and a number"
      );
      isValid = false;
    }

    if (confirmPasswordInputValue.trim() === "") {
      this.showError(fields.confirmPassword.error, "Please confirm your password");
      isValid = false;
    } else if (passwordInputValue !== confirmPasswordInputValue) {
      this.showError(fields.confirmPassword.error, "Passwords do not match");
      isValid = false;
    }

    return isValid;
  }

  showError(errorElement, message) {
    if (!errorElement) return;

    errorElement.textContent = message;

    const input = errorElement.closest(".field").querySelector(".field__input");

    if (input) {
      input.style.borderColor = "var(--color-red)";
    }
  }

  getActiveSegment() {
    const activeClass = this.classes.segmentedButton.active;
    const segmentedButton = this.elements.segmentedButton.group;
    const activeSegmentedButton = segmentedButton.querySelector(`.${activeClass}`);

    if (!activeSegmentedButton) return "email";

    if (activeSegmentedButton.dataset.hasOwnProperty("jsSegmentedButtonItemEmail")) {
      return "email";
    }

    return "phone";
  }

  validateEmail(emailValue) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  }

  validatePhoneNumber(phoneValue) {
    const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
    return phoneRegex.test(phoneValue);
  }

  validatePassword(passwordValue) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+=-]{8,30}$/;
    return passwordRegex.test(passwordValue);
  }
}

new Form();