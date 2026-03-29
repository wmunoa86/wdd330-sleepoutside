import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function wishlistItemTemplate(item) {
  const img = item.Images?.PrimaryMedium || item.Image;
  const name = item.NameWithoutBrand || item.Name;
  const color = item.Colors?.[0]?.ColorName || "";
  return `<li class="wishlist-card divider" data-id="${item.Id}">
    <a href="/product_pages/?product=${item.Id}" class="wishlist-card__image">
      <img src="${img}" alt="${item.Name}" />
    </a>
    <div class="wishlist-card__info">
      <h2 class="card__name">${name}</h2>
      <p class="wishlist-card__color">${color}</p>
      <p class="wishlist-card__price">$${item.FinalPrice}</p>
    </div>
    <div class="wishlist-card__actions">
      <button class="btn-move-to-cart" data-id="${item.Id}">Move to Cart</button>
      <button class="btn-remove-wishlist" data-id="${item.Id}">Remove</button>
    </div>
  </li>`;
}

export default class Wishlist {
  constructor() {
    this.listElement = document.querySelector(".wishlist-list");
  }

  init() {
    this.render();
    this.listElement.addEventListener("click", this.handleActions.bind(this));
  }

  render() {
    const items = getLocalStorage("so-wishlist") || [];
    if (items.length === 0) {
      this.listElement.innerHTML =
        "<li class='empty-message'>Your wishlist is empty. Browse products to add items!</li>";
      return;
    }
    this.listElement.innerHTML = items.map(wishlistItemTemplate).join("");
  }

  handleActions(e) {
    const id = e.target.dataset.id;
    if (!id) return;
    if (e.target.classList.contains("btn-move-to-cart")) {
      this.moveToCart(id);
    } else if (e.target.classList.contains("btn-remove-wishlist")) {
      this.removeItem(id);
    }
  }

  moveToCart(id) {
    const wishlist = getLocalStorage("so-wishlist") || [];
    const item = wishlist.find((p) => p.Id === id);
    if (!item) return;
    const cart = getLocalStorage("so-cart") || [];
    if (!cart.find((p) => p.Id === id)) {
      cart.push(item);
      setLocalStorage("so-cart", cart);
    }
    this.removeItem(id);
  }

  removeItem(id) {
    const wishlist = getLocalStorage("so-wishlist") || [];
    setLocalStorage(
      "so-wishlist",
      wishlist.filter((p) => p.Id !== id)
    );
    this.render();
  }
}
