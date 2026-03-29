import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", ".order-summary");
checkout.init();

document
  .querySelector("#checkout-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    if (form.checkValidity()) {
      checkout.checkout(form);
    } else {
      form.reportValidity();
    }
  });
