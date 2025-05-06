document.addEventListener("DOMContentLoaded", () => {
    const selectedDrinksContainer = document.getElementById("selected-drinks-container");
    const checkoutBtn = document.getElementById("checkout-btn");
    const selectedItems = [];

    document.querySelectorAll(".drink").forEach(drink => {
      const plusBtn = drink.querySelector(".plus");
      const minusBtn = drink.querySelector(".minus");
      const quantityDisplay = drink.querySelector(".quantity");

      let quantity = 0;

      plusBtn.addEventListener("click", () => {
        quantity++;
        quantityDisplay.textContent = quantity;
      });

      minusBtn.addEventListener("click", () => {
        if (quantity > 0) {
          quantity--;
          quantityDisplay.textContent = quantity;
        }
      });

      drink.addEventListener("click", () => {
        const name = drink.getAttribute("data-name");
        const price = parseInt(drink.getAttribute("data-price"), 10);
        const image = drink.querySelector("img").src;

        if (quantity > 0) {
          const existingIndex = selectedItems.findIndex(item => item.name === name);
          if (existingIndex !== -1) {
            selectedItems[existingIndex].quantity += quantity;
          } else {
            selectedItems.push({ name, price, quantity, image });
          }

          renderCart();
          quantity = 0;
          quantityDisplay.textContent = quantity;
        } else {
          alert(`Please select a quantity for ${name}.`);
        }
      });
    });

    function renderCart() {
      selectedDrinksContainer.innerHTML = "";
      selectedItems.forEach(item => {
        const itemHTML = `
          <div class="selected-drink" data-name="${item.name}">
            <img src="${item.image}" width="100" />
            <h2>${item.name}</h2>
            <p>₱${item.price}</p>
            <div class="controls">
              <button class="cart-minus">−</button>
              <span class="cart-quantity">${item.quantity}</span>
              <button class="cart-plus">+</button>
            </div>
            <button class="remove-btn">Remove</button>
          </div>
        `;
        selectedDrinksContainer.insertAdjacentHTML("beforeend", itemHTML);
      });

      document.querySelectorAll(".cart-minus").forEach((btn, index) => {
        btn.addEventListener("click", () => {
          if (selectedItems[index].quantity > 1) {
            selectedItems[index].quantity--;
            renderCart();
          }
        });
      });

      document.querySelectorAll(".cart-plus").forEach((btn, index) => {
        btn.addEventListener("click", () => {
          selectedItems[index].quantity++;
          renderCart();
        });
      });

      document.querySelectorAll(".remove-btn").forEach((btn, index) => {
        btn.addEventListener("click", () => {
          selectedItems.splice(index, 1);
          renderCart();
        });
      });

      updateCheckoutLink();
    }

    function updateCheckoutLink() {
      const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const queryString = encodeURIComponent(JSON.stringify(selectedItems));
      checkoutBtn.href = `Payment.html?cart=${queryString}&total=${total}`;
    }

    checkoutBtn.addEventListener("click", (e) => {
      if (selectedItems.length === 0) {
        e.preventDefault();
        alert("Your cart is empty. Please add an item.");
      }
    });
  });