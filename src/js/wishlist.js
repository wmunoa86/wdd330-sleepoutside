import { loadHeaderFooter } from "./utils.mjs";
import Wishlist from "./Wishlist.mjs";

loadHeaderFooter();

const wishlist = new Wishlist();
wishlist.init();
