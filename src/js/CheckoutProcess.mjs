import ExternalServices from "./ExternalServices.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSubtotal();
    this.calculateOrderTotal();
  }

  calculateItemSubtotal() {
    this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice, 0);
    document.querySelector(
      `${this.outputSelector} .cart-subtotal`
    ).textContent = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    this.shipping = 10 + (this.list.length - 1) * 2;
    this.tax = this.itemTotal * 0.06;
    this.orderTotal = this.itemTotal + this.shipping + this.tax;
    document.querySelector(
      `${this.outputSelector} .cart-shipping`
    ).textContent = `$${this.shipping.toFixed(2)}`;
    document.querySelector(`${this.outputSelector} .cart-tax`).textContent =
      `$${this.tax.toFixed(2)}`;
    document.querySelector(`${this.outputSelector} .cart-total`).textContent =
      `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    const formData = formDataToJSON(form);
    formData.orderDate = new Date().toISOString();
    formData.orderTotal = this.orderTotal.toFixed(2);
    formData.tax = this.tax.toFixed(2);
    formData.shipping = this.shipping.toFixed(2);
    formData.itemSubTotal = this.itemTotal.toFixed(2);
    formData.items = this.list;

    try {
      await services.checkout(formData);
      setLocalStorage("so-cart", []);
      window.location.href = "/checkout/success.html";
    } catch (err) {
      const errMsg = document.querySelector(".error-message");
      if (errMsg) {
        const msg =
          err.message?.message ||
          err.message ||
          "An error occurred during checkout. Please try again.";
        errMsg.textContent = typeof msg === "string" ? msg : JSON.stringify(msg);
        errMsg.classList.add("show");
      }
    }
  }
}
