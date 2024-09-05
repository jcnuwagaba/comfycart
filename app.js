//variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

let cart = [];
let buttonsDom = [];

class Products {
  //get products
  async getProducts() {
    try {
      let products = await fetch("products.json");
      let data = await products.json();
      products = data.items;

      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `<article class="product">
          <div class="img-container">
            <img
              src=${product.image}
              alt="product"
              class="product-img"
            />
            <button class="bag-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart"></i>
              add to cart
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>$${product.price}</h4>
        </article>`;
    });
    productsDOM.innerHTML = result;
  }
  //get bag buttons
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")]; //change nodelist into array
    buttonsDom = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        //get product from products
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        //add product to the cart
        cart = [...cart, cartItem];
        //save the cart in local storage
        Storage.saveCart(cart);
        //set cart values
        this.setCartValues(cart);
        //display cart item
        this.addCartItem(cartItem);
        //show the cart
        this.showCart();
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }
  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = ` <img src=${cartItem.image} alt="product" />
            <div>
              <h4>${cartItem.title}</h4>
              <h5>$${cartItem.price}</h5>
              <span class="remove-item" data-id=${cartItem.id}>remove</span>
            </div>
            <div>
              <i class="fas fa-chevron-up" data-id=${cartItem.id}></i>
              <p class="item-amount">
              ${cartItem.amount}
              </p>
              <i class="fas fa-chevron-down" data-id=${cartItem.id}></i>
            </div>`;
    cartContent.appendChild(div);
  }
  showCart() {
    cartOverlay.classList.add("transparentBCG");
    cartDOM.classList.add("showCart");
    cartOverlay.style.visibility = "visible";
    cartDOM.style.transform = "translateX(0)";
  }
  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }
  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }
  hideCart() {
    cartOverlay.style.visibility = "hidden";
    cartDOM.style.transform = "translateX(180)";
    cartOverlay.classList.remove("transparentBCG");
    cartDOM.classList.remove("showCart");
  }
  cartLogic() {
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });
    //cart functionality
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        let id = event.target.dataset.id;

        cartContent.removeChild(event.target.parentElement.parentElement);
        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let itemId = event.target.dataset.id;
        let tempItem = cart.find((cartItem) => cartItem.id === itemId);
        tempItem.amount++;

        Storage.saveCart(cart);
        this.setCartValues(cart);
        //console.log(event.target.nextElementSibling);

        event.target.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let itemId = event.target.dataset.id;
        let tempItem = cart.find((cartItem) => cartItem.id === itemId);
        tempItem.amount--;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          console.log(event.target);
          event.target.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartContent.removeChild(event.target.parentElement.parentElement);
          this.removeItem(itemId);
        }
      }
    });
  }
  clearCart() {
    let itemIds = cart.map((item) => item.id);
    itemIds.forEach((id) => {
      this.removeItem(id);
    });
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }
  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);

    let button = this.getSingleButton(id);

    button.disabled = false;
    button.innerHTML = ` <i class="fas fa-shopping-cart"></i>add to cart`;
  }
  getSingleButton(id) {
    return buttonsDom.find((button) => button.dataset.id === id);
  }
}
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
    //console.log(localStorage.getItem("products"));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  //setup App
  ui.setupAPP();

  //get all products
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
