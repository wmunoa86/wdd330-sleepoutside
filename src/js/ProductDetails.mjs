import { setLocalStorage, getLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cart = getLocalStorage("so-cart") || [];
    cart.push(this.product);
    setLocalStorage("so-cart", cart);
  }

  renderProductDetails() {
    document.querySelector(".product-detail h3").textContent =
      this.product.Brand.Name;
    document.querySelector(".product-detail h2").textContent =
      this.product.NameWithoutBrand;
    document.querySelector(".product-detail .product-card__price").textContent =
      `$${this.product.FinalPrice}`;
    document.querySelector(".product-detail .product__colors").innerHTML =
      this.product.Colors.map(
        (color) =>
          `<li class="product-card__color">${color.ColorName}</li>`
      ).join("");
    document.querySelector(".product-detail .product-card__description").innerHTML =
      this.product.DescriptionHtmlSimple;
    const img = document.querySelector(".product-detail img");
    img.src = this.product.Image;
    img.alt = this.product.Name;
    document.getElementById("addToCart").dataset.id = this.product.Id;
  }
}