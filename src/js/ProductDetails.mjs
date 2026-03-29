import { setLocalStorage, getLocalStorage, getComments, saveComment } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    this.renderComments();
    this.updateWishlistButton();
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
    document
      .getElementById("addToWishlist")
      .addEventListener("click", this.toggleWishlist.bind(this));
    document
      .getElementById("comment-form")
      .addEventListener("submit", this.handleCommentSubmit.bind(this));
  }

  addProductToCart() {
    const cart = getLocalStorage("so-cart") || [];
    cart.push(this.product);
    setLocalStorage("so-cart", cart);
  }

  toggleWishlist() {
    const wishlist = getLocalStorage("so-wishlist") || [];
    const exists = wishlist.find((p) => p.Id === this.product.Id);
    if (exists) {
      setLocalStorage(
        "so-wishlist",
        wishlist.filter((p) => p.Id !== this.product.Id)
      );
    } else {
      wishlist.push(this.product);
      setLocalStorage("so-wishlist", wishlist);
    }
    this.updateWishlistButton();
  }

  updateWishlistButton() {
    const wishlist = getLocalStorage("so-wishlist") || [];
    const btn = document.getElementById("addToWishlist");
    const exists = wishlist.find((p) => p.Id === this.product.Id);
    btn.textContent = exists ? "Remove from Wishlist" : "Add to Wishlist";
    btn.classList.toggle("in-wishlist", !!exists);
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
        (color) => `<li class="product-card__color">${color.ColorName}</li>`
      ).join("");
    document.querySelector(".product-detail .product-card__description").innerHTML =
      this.product.DescriptionHtmlSimple;
    const img = document.querySelector(".product-detail img");
    img.src = this.product.Images.PrimaryLarge;
    img.alt = this.product.Name;
    document.getElementById("addToCart").dataset.id = this.product.Id;
  }

  renderComments() {
    const comments = getComments(this.productId);
    const list = document.querySelector(".comment-list");
    if (comments.length === 0) {
      list.innerHTML = "<li class='no-comments'>No comments yet. Be the first!</li>";
      return;
    }
    list.innerHTML = comments
      .map(
        (c) => `<li class="comment-card">
          <p class="comment-card__name">${c.name}</p>
          <p class="comment-card__date">${c.date}</p>
          <p class="comment-card__text">${c.comment}</p>
        </li>`
      )
      .join("");
  }

  handleCommentSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("comment-name").value.trim();
    const comment = document.getElementById("comment-text").value.trim();
    const date = new Date().toLocaleDateString();
    saveComment(this.productId, { name, comment, date });
    document.getElementById("comment-form").reset();
    this.renderComments();
  }
}