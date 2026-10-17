const teaMenu = {
  "moon-taro": {
    name: "Matcha",
    price: 480,
    image: "jasmine",
    milkImage: "jasmine"
  },
  "goblin-peach": {
    name: "Mango",
    price: 520,
    image: "mango",
    milkImage: null
  },
  "cosmic-strawberry": {
    name: "Black",
    price: 500,
    image: "black",
    milkImage: "black"
  }
};

const toppingMenu = {
  "chaos-pearls": {
    name: "Boba",
    price: 60,
    image: "boba"
  },
  "unicorn-glitter": {
    name: "Lychee",
    price: 80,
    image: "lychee"
  },
  "cereal-meteors": {
    name: "Red Bean",
    price: 100,
    image: "red-bean"
  }
};

const iceMenu = {
  none: { name: "No ice", image: null },
  less: { name: "Less ice", image: "less" },
  regular: { name: "Regular ice", image: "normal" }
};

const sweetnessMenu = {
  zero: "Zero sugar",
  half: "Half sweet",
  regular: "Regular sweet"
};

const order = {
  tea: null,
  milk: false,
  topping: null,
  ice: "regular",
  sweetness: "regular"
};

const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const container = document.getElementById("container");
const panel = document.getElementById("panel");
const polaroid = document.getElementById("polaroid-wrapper");
const drinkName = document.getElementById("drink-name");
const checkoutContainer = document.getElementById("checkout-container");
const checkoutButton = document.getElementById("checkout-button");
const checkoutOptions = document.getElementById("checkout-options");
const orderMessage = document.getElementById("order-message");
const orderAnotherButton = document.getElementById("order-another-button");
const confirmationPopup = document.getElementById("confirmation-popup");
const yesButton = document.getElementById("yes-button");
const noButton = document.getElementById("no-button");
const drinkBase = document.getElementById("drink-base");
const teaOverlay = document.getElementById("tea-overlay");
const iceOverlay = document.getElementById("ice-overlay");
const toppingOverlay = document.getElementById("topping-overlay");

let pendingTea = null;

function setOverlay(image, path, alt) {
  if (!path) {
    image.hidden = true;
    image.removeAttribute("src");
    image.alt = "";
    return;
  }

  image.src = path;
  image.alt = alt;
  image.hidden = false;
}

function renderDrink() {
  if (!order.tea) {
    setOverlay(teaOverlay, null);
    setOverlay(iceOverlay, null);
    setOverlay(toppingOverlay, null);
    return;
  }

  const tea = teaMenu[order.tea];
  const hasMilkArtwork = order.milk && tea.milkImage;
  const teaImage = hasMilkArtwork
    ? `img/with-milk/${tea.milkImage}.png`
    : `img/no-milk/${tea.image}.png`;
  setOverlay(
    teaOverlay,
    teaImage,
    `${tea.name}${order.milk ? " with milk" : ""}`
  );

  const ice = iceMenu[order.ice];
  setOverlay(iceOverlay, ice.image ? `img/ice/${ice.image}.png` : null, ice.name);

  const topping = order.topping ? toppingMenu[order.topping] : null;
  setOverlay(
    toppingOverlay,
    topping ? `img/toppings/${topping.image}.png` : null,
    topping ? topping.name : ""
  );
}

function renderReceipt() {
  if (!order.tea) {
    drinkName.innerHTML = "<p>YOUR QUEST BEGINS HERE...</p><p>SELECT A TEA TO GENERATE YOUR RECEIPT.</p>";
    return;
  }

  const tea = teaMenu[order.tea];
  const topping = order.topping ? toppingMenu[order.topping] : null;
  const ice = iceMenu[order.ice];
  const total = tea.price + (topping ? topping.price : 0);
  const milkLabel = order.milk ? "With milk" : "No milk";

  drinkName.innerHTML = `
    <p><strong>${tea.name.toUpperCase()} BOBA</strong></p>
    <div class="receipt-line"></div>
    <div class="receipt-details">
      <span>${tea.name} tea (${milkLabel}) <span>Rs. ${tea.price}</span></span>
      <span>${topping ? `${topping.name} topping` : "No topping"} <span>${topping ? `Rs. ${topping.price}` : "Free"}</span></span>
      <span>${ice.name}</span>
      <span>${sweetnessMenu[order.sweetness]}</span>
    </div>
    <div class="receipt-line"></div>
    <p class="receipt-total">TOTAL: Rs. ${total}</p>
  `;
}

function renderOrder() {
  renderDrink();
  renderReceipt();

  document.querySelectorAll(".option").forEach((option) => {
    const { type, value } = option.dataset;
    let selected = false;

    if (type === "tea") selected = value === order.tea;
    if (type === "topping") selected = value === (order.topping || "none");
    if (type === "ice") selected = value === (order.ice === "regular" ? "regular" : order.ice);
    if (type === "sweetness") selected = value === order.sweetness;

    option.classList.toggle("selected", selected);
    option.setAttribute("aria-pressed", String(selected));
  });

  const hasTea = Boolean(order.tea);
  checkoutContainer.classList.toggle("ready", hasTea);
  checkoutButton.disabled = !hasTea;
}

function showMilkConfirmation(teaValue) {
  pendingTea = teaValue;
  confirmationPopup.classList.add("show");
  yesButton.focus();
}

function confirmTea(withMilk) {
  if (!pendingTea) return;

  order.tea = pendingTea;
  order.milk = withMilk;
  pendingTea = null;
  confirmationPopup.classList.remove("show");
  renderOrder();
}

function selectTab(tabButton) {
  const tabId = tabButton.dataset.tab;
  document.querySelectorAll(".tab-button").forEach((button) => {
    const active = button === tabButton;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.toggle("active", content.id === tabId);
  });
}

startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  container.style.display = "flex";
});

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => selectTab(button));
});

document.querySelectorAll(".option").forEach((option) => {
  option.addEventListener("click", () => {
    const { type, value } = option.dataset;

    if (type === "tea") {
      showMilkConfirmation(value);
      return;
    }

    if (type === "topping") order.topping = value === "none" ? null : value;
    if (type === "ice") order.ice = value;
    if (type === "sweetness") order.sweetness = value;
    renderOrder();
  });
});

yesButton.addEventListener("click", () => confirmTea(true));
noButton.addEventListener("click", () => confirmTea(false));

confirmationPopup.addEventListener("click", (event) => {
  if (event.target === confirmationPopup) {
    pendingTea = null;
    confirmationPopup.classList.remove("show");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && confirmationPopup.classList.contains("show")) {
    pendingTea = null;
    confirmationPopup.classList.remove("show");
  }
});

checkoutButton.addEventListener("click", () => {
  if (!order.tea) return;

  orderMessage.textContent = `QUEST COMPLETE! YOUR ${teaMenu[order.tea].name.toUpperCase()} BOBA IS LOCKED IN!`;
  checkoutContainer.style.display = "none";
  panel.style.display = "none";
  checkoutOptions.style.display = "flex";
  polaroid.classList.add("polaroid-active");
});

orderAnotherButton.addEventListener("click", () => {
  order.tea = null;
  order.milk = false;
  order.topping = null;
  order.ice = "regular";
  order.sweetness = "regular";

  checkoutOptions.style.display = "none";
  checkoutContainer.style.display = "flex";
  panel.style.display = "flex";
  polaroid.classList.remove("polaroid-active");
  selectTab(document.querySelector('.tab-button[data-tab="tea-options"]'));
  renderOrder();
});

renderOrder();
