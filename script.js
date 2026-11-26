// SHOPPING CART DATA
let cart = JSON.parse(localStorage.getItem("gozeeCart")) || [];
let activeTenant = "";
let activeEventId = "";
let productNotificationTimer = null;

function saveCart() {
  localStorage.setItem("gozeeCart", JSON.stringify(cart));
}

const eventData = {
  music: {
    title: "Malang Music Festival",
    category: "Music & Concert",
    location: "Malang, Indonesia",
    description:
      "Enjoy live performances and discover your favorite products without leaving your spot.",
    tenants: ["Kopi Sudut", "Burger Lab", "Slice Society"],
  },

  food: {
    title: "Local Food Market",
    category: "Food & Culinary",
    location: "Malang, Indonesia",
    description:
      "Explore local culinary favorites, snacks, and refreshing drinks.",
    tenants: ["Nusantara Bowl", "Sweet Corner", "Kopi Lokal"],
  },

  auto: {
    title: "Auto & Lifestyle Expo",
    category: "Exhibition",
    location: "Malang, Indonesia",
    description:
      "Explore automotive showcases, lifestyle products, and event merchandise.",
    tenants: ["Drive Gear", "Streetwear Hub", "Fuel Station"],
  },
};

// DATA PRODUK SETIAP TENANT
const productData = {
  "Kopi Sudut": [
    {
      name: "Iced Latte",
      description: "Espresso with fresh milk",
      price: 22000,
    },
    { name: "Americano", description: "Classic espresso coffee", price: 18000 },
    {
      name: "Caramel Macchiato",
      description: "Coffee with caramel flavor",
      price: 27000,
    },
  ],

  "Burger Lab": [
    {
      name: "Classic Beef Burger",
      description: "Beef patty with fresh vegetables",
      price: 35000,
    },
    {
      name: "Cheese Burger",
      description: "Beef burger with melted cheese",
      price: 40000,
    },
    { name: "French Fries", description: "Crispy golden fries", price: 18000 },
  ],

  "Slice Society": [
    {
      name: "Pepperoni Pizza",
      description: "Pizza with pepperoni topping",
      price: 35000,
    },
    {
      name: "Cheese Pizza",
      description: "Classic cheesy pizza slice",
      price: 30000,
    },
  ],

  "Nusantara Bowl": [
    {
      name: "Chicken Rice Bowl",
      description: "Rice with seasoned chicken",
      price: 28000,
    },
    {
      name: "Beef Sambal Bowl",
      description: "Beef with Indonesian sambal",
      price: 32000,
    },
  ],

  "Sweet Corner": [
    {
      name: "Chocolate Brownies",
      description: "Rich chocolate brownies",
      price: 20000,
    },
    {
      name: "Strawberry Waffle",
      description: "Waffle with strawberry topping",
      price: 25000,
    },
  ],

  "Kopi Lokal": [
    {
      name: "Es Kopi Susu",
      description: "Local coffee with fresh milk",
      price: 18000,
    },
    { name: "Matcha Latte", description: "Creamy matcha drink", price: 25000 },
  ],

  "Drive Gear": [
    {
      name: "Car Miniature",
      description: "Collectible miniature vehicle",
      price: 85000,
    },
    {
      name: "Keychain",
      description: "Automotive-themed keychain",
      price: 25000,
    },
  ],

  "Streetwear Hub": [
    {
      name: "Graphic T-Shirt",
      description: "Limited event streetwear",
      price: 120000,
    },
    {
      name: "Canvas Tote Bag",
      description: "Everyday canvas tote bag",
      price: 65000,
    },
  ],

  "Fuel Station": [
    {
      name: "Water Bottle",
      description: "Reusable event bottle",
      price: 45000,
    },
    { name: "Event Cap", description: "Casual lifestyle cap", price: 75000 },
  ],
};

// MENAMPILKAN DETAIL EVENT
function showEvent(eventId) {
  const selectedEvent = eventData[eventId];

  if (!selectedEvent) return;

  // Menyimpan event yang sedang dibuka pengunjung
  activeEventId = eventId;

  document.getElementById("detail-title").textContent = selectedEvent.title;
  document.getElementById("detail-category").textContent =
    selectedEvent.category;
  document.getElementById("detail-location").textContent =
    selectedEvent.location;
  document.getElementById("detail-description").textContent =
    selectedEvent.description;

  const tenantList = document.getElementById("tenant-list");
  tenantList.innerHTML = "";

  selectedEvent.tenants.forEach(function (tenant) {
    const tenantButton = document.createElement("button");

    tenantButton.className = "tenant-item";
    tenantButton.type = "button";
    tenantButton.textContent = tenant;

    tenantButton.addEventListener("click", function () {
      showTenant(tenant);
    });

    tenantList.appendChild(tenantButton);
  });

  document.getElementById("upcoming-events").hidden = true;
  document.getElementById("event-detail").hidden = false;
  document.getElementById("tenant-products").hidden = true;

  document.getElementById("event-detail").scrollIntoView({
    behavior: "smooth",
  });
}

// MENAMPILKAN KATALOG PRODUK TENANT
function showTenant(tenantName) {
  activeTenant = tenantName;
  const products = productData[tenantName];

  if (!products) return;

  document.getElementById("tenant-title").textContent = tenantName;
  document.getElementById("tenant-description").textContent =
    "Explore available products from " + tenantName + ".";

  const productGrid = document.getElementById("product-grid");
  productGrid.innerHTML = "";

  products.forEach(function (product) {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    productCard.innerHTML = `
            <div class="product-placeholder">GOZEE</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <strong>Rp ${product.price.toLocaleString("id-ID")}</strong>
                <button class="add-cart-button">+ Add to Cart</button>
            </div>
        `;

    productCard
      .querySelector(".add-cart-button")
      .addEventListener("click", function () {
        addToCart(tenantName, product);
      });

    productGrid.appendChild(productCard);
  });

  document.getElementById("event-detail").hidden = true;
  document.getElementById("tenant-products").hidden = false;

  document.getElementById("tenant-products").scrollIntoView({
    behavior: "smooth",
  });
}

// SHOW PRODUCT ACTION NOTIFICATION
function showProductNotification(title, message, type) {
  const notification = document.getElementById("product-notification");

  window.clearTimeout(productNotificationTimer);
  notification.classList.remove("is-success", "is-error", "is-visible");
  notification.classList.add(
    type === "error" ? "is-error" : "is-success",
  );
  notification.setAttribute("role", type === "error" ? "alert" : "status");
  notification.setAttribute(
    "aria-live",
    type === "error" ? "assertive" : "polite",
  );
  notification.querySelector(".product-notification-title").textContent =
    title;
  notification.querySelector(".product-notification-message").textContent =
    message;
  notification.hidden = false;
  notification.classList.add("is-visible");

  productNotificationTimer = window.setTimeout(function () {
    notification.classList.remove("is-visible");
    productNotificationTimer = window.setTimeout(function () {
      notification.hidden = true;
      productNotificationTimer = null;
    }, 200);
  }, 3200);
}

// ADD PRODUCT TO CART
function addToCart(tenantName, product) {
  const selectedEvent = eventData[activeEventId];

  if (!selectedEvent) {
    showProductNotification(
      "Pilih event terlebih dahulu",
      "Barang hanya bisa ditambahkan setelah memilih event.",
      "error",
    );
    return;
  }

  const differentEvent = cart.some(function (item) {
    return item.eventId && item.eventId !== activeEventId;
  });

  if (differentEvent) {
    showProductNotification(
      "Keranjang berisi event lain",
      "Selesaikan atau kosongkan keranjang sebelum memilih barang dari event ini.",
      "error",
    );
    return;
  }

  const existingItem = cart.find(function (item) {
    return (
      item.name === product.name &&
      item.tenant === tenantName &&
      item.eventId === activeEventId
    );
  });

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      eventId: activeEventId,
      eventName: selectedEvent.title,
      tenant: tenantName,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  saveCart();
  showProductNotification(
    "Berhasil ditambahkan",
    product.name + " berhasil ditambahkan ke keranjang.",
    "success",
  );
}

// SIMULATE PAYMENT
function processPayment() {
  const customerName = document.getElementById("customer-name").value.trim();

  const customerContact = document
    .getElementById("customer-contact")
    .value.trim();

  const deliveryLocation = document
    .getElementById("delivery-location")
    .value.trim();

  const deliveryNotes = document.getElementById("delivery-notes").value.trim();

  const selectedPayment = document.querySelector(
    'input[name="payment-method"]:checked',
  );

  if (!customerName || !customerContact || !deliveryLocation) {
    alert("Please complete your name, phone number, and delivery location.");
    return;
  }

  if (!selectedPayment) {
    alert("Please select a payment method.");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const eventId = cart[0].eventId;
  const selectedEvent = eventData[eventId];

  if (!selectedEvent) {
    alert("Event information not found. Please select an event again.");
    return;
  }

  let subtotal = 0;

  cart.forEach(function (item) {
    subtotal += item.price * item.quantity;
  });

  const fee = Math.round(subtotal * 0.1);
  const total = subtotal + fee;

  const orderNumber = "GZ-" + Date.now().toString().slice(-8);

  // Membuat status terpisah untuk setiap tenant
  const tenantStatuses = {};

  cart.forEach(function (item) {
    tenantStatuses[item.tenant] = "Order Received";
  });

  const order = {
    orderNumber: orderNumber,

    eventId: eventId,
    eventName: selectedEvent.title,

    customerName: customerName,
    customerContact: customerContact,
    deliveryLocation: deliveryLocation,
    deliveryNotes: deliveryNotes,

    paymentMethod: selectedPayment.value,
    items: [...cart],

    tenantStatuses: tenantStatuses,

    status: "Order Received",
    assignedCrew: "",

    subtotal: subtotal,
    serviceFee: fee,
    total: total,

    paymentStatus: "Paid (Simulation)",
    createdAt: new Date().toLocaleString("id-ID"),
  };

  const savedOrders = JSON.parse(localStorage.getItem("gozeeOrders")) || [];

  savedOrders.push(order);

  localStorage.setItem("gozeeOrders", JSON.stringify(savedOrders));

  localStorage.setItem("gozeeCurrentOrder", JSON.stringify(order));

  // DISPLAY PAYMENT SUCCESS
  document.getElementById("checkout-page").hidden = true;
  document.getElementById("payment-success").hidden = false;

  document.getElementById("order-number").textContent = orderNumber;

  document.getElementById("success-total").textContent =
    "Rp " + total.toLocaleString("id-ID");

  document.getElementById("success-method").textContent = selectedPayment.value;

  document.getElementById("payment-success").scrollIntoView({
    behavior: "smooth",
  });
}

// FINISH ORDER
function finishOrder() {
  const currentOrder = JSON.parse(localStorage.getItem("gozeeCurrentOrder"));

  if (!currentOrder) {
    alert("Order information not found.");
    return;
  }

  cart = [];
  saveCart();

  document.getElementById("payment-success").hidden = true;
  document.getElementById("tracking-page").hidden = false;

  showTracking(currentOrder);

  document.getElementById("tracking-page").scrollIntoView({
    behavior: "smooth",
  });
}

// ORDER TRACKING
function showTracking(order) {
  const statuses = [
    "Order Received",
    "Preparing Your Order",
    "Ready for Pickup",
    "On Delivery",
    "Delivered",
  ];

  const currentStatus = statuses.indexOf(order.status);
  const activeIndex = currentStatus >= 0 ? currentStatus : 0;

  document.getElementById("tracking-order-number").textContent =
    order.orderNumber;

  document.getElementById("tracking-status").textContent = order.status;

  const steps = document.querySelectorAll(".tracking-step");

  steps.forEach(function (step, index) {
    step.classList.toggle("active", index <= activeIndex);
  });
}

function loadTenantOrders() {
  const selectedTenant = document.getElementById("tenant-selector").value;

  const orders = JSON.parse(localStorage.getItem("gozeeOrders")) || [];

  const tenantOrders = orders.filter((order) =>
    order.items.some((item) => item.tenant === selectedTenant),
  );

  const orderList = document.getElementById("tenant-order-list");

  if (!selectedTenant) {
    document.getElementById("tenant-total-orders").textContent = 0;
    document.getElementById("tenant-new-orders").textContent = 0;
    document.getElementById("tenant-completed-orders").textContent = 0;

    orderList.innerHTML = "<p>Select your tenant to view incoming orders.</p>";
    return;
  }

  const getTenantStatus = function (order) {
    return order.tenantStatuses?.[selectedTenant] || order.status;
  };

  document.getElementById("tenant-total-orders").textContent =
    tenantOrders.length;

  document.getElementById("tenant-new-orders").textContent =
    tenantOrders.filter(
      (order) => getTenantStatus(order) === "Order Received",
    ).length;

  document.getElementById("tenant-completed-orders").textContent =
    tenantOrders.filter((order) => order.status === "Delivered").length;

  if (tenantOrders.length === 0) {
    orderList.innerHTML = "<p>No orders received yet.</p>";
    return;
  }

  orderList.innerHTML = tenantOrders
    .map((order) => {
      const tenantItems = order.items.filter(
        (item) => item.tenant === selectedTenant,
      );

      const tenantSubtotal = tenantItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const tenantStatus = getTenantStatus(order);

      return `
            <div class="tenant-stat-card">
                <h3>${order.orderNumber}</h3>

                <p>Event: ${order.eventName || "Previous Event"}</p>
                <p>Customer: ${order.customerName}</p>
                <p>Location: ${order.deliveryLocation}</p>
                <p>Tenant Order Status: ${tenantStatus}</p>

                <p>Products:</p>

                ${tenantItems
                  .map(
                    (item) => `
                    <p>${item.name} × ${item.quantity}</p>
                `,
                  )
                  .join("")}

                <p>Product Subtotal: Rp ${tenantSubtotal.toLocaleString("id-ID")}</p>

                ${
                  tenantStatus === "Order Received"
                    ? `
                    <button onclick="updateTenantOrderStatus('${order.orderNumber}', '${selectedTenant}', 'Preparing Your Order')">
                        Start Preparing
                    </button>
                `
                    : tenantStatus === "Preparing Your Order"
                      ? `
                    <button onclick="updateTenantOrderStatus('${order.orderNumber}', '${selectedTenant}', 'Ready for Pickup')">
                        Ready for Pickup
                    </button>
                `
                      : ""
                }
            </div>
        `;
    })
    .join("");
}

function updateTenantOrderStatus(orderNumber, tenantName, newStatus) {
  let orders = JSON.parse(localStorage.getItem("gozeeOrders")) || [];

  const order = orders.find((item) => item.orderNumber === orderNumber);

  if (!order) {
    alert("Order tidak ditemukan.");
    return;
  }

  if (!order.tenantStatuses) {
    order.tenantStatuses = {};
  }

  const tenantExists = order.items.some((item) => item.tenant === tenantName);

  if (!tenantExists) {
    alert("Tenant tidak ditemukan dalam pesanan ini.");
    return;
  }

  // Update status tenant yang dipilih
  order.tenantStatuses[tenantName] = newStatus;

  // Ambil semua tenant unik dalam pesanan
  const allTenants = [...new Set(order.items.map((item) => item.tenant))];

  const allTenantsReady = allTenants.every(
    (tenant) => order.tenantStatuses[tenant] === "Ready for Pickup",
  );

  const anyTenantPreparing = allTenants.some(
    (tenant) => order.tenantStatuses[tenant] === "Preparing Your Order",
  );

  // Sinkronisasi status utama pesanan
  if (order.status !== "On Delivery" && order.status !== "Delivered") {
    if (allTenantsReady) {
      order.status = "Ready for Pickup";
    } else if (anyTenantPreparing) {
      order.status = "Preparing Your Order";
    } else {
      order.status = "Order Received";
    }
  }

  // Simpan perubahan
  localStorage.setItem("gozeeOrders", JSON.stringify(orders));

  // Sinkronisasi pesanan yang sedang aktif
  let currentOrder = JSON.parse(localStorage.getItem("gozeeCurrentOrder"));

  if (currentOrder && currentOrder.orderNumber === orderNumber) {
    currentOrder.tenantStatuses = order.tenantStatuses;
    currentOrder.status = order.status;

    localStorage.setItem("gozeeCurrentOrder", JSON.stringify(currentOrder));
  }

  alert("Order status berhasil diperbarui!");

  loadTenantOrders();
}

// LOAD OPERATIONS ORDERS
function loadOperationsOrders() {
  const orders = JSON.parse(localStorage.getItem("gozeeOrders")) || [];

  const pickupOrders = orders.filter(
    (order) => order.status === "Ready for Pickup",
  );

  const deliveryOrders = orders.filter(
    (order) => order.status === "On Delivery",
  );

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered",
  );

  document.getElementById("ops-pickup-count").textContent = pickupOrders.length;

  document.getElementById("ops-delivery-count").textContent =
    deliveryOrders.length;

  document.getElementById("ops-delivered-count").textContent =
    deliveredOrders.length;

  const orderList = document.getElementById("operations-order-list");

  // Tampilkan seluruh pesanan
  const allOrders = [...orders].reverse();

  if (allOrders.length === 0) {
    orderList.innerHTML = "<p>No orders yet.</p>";
    return;
  }

  orderList.innerHTML = allOrders
    .map(
      (order) => `
        <div class="operations-order-card">
            <h3>${order.orderNumber}</h3>

            <p>Customer: ${order.customerName}</p>
            <p>Delivery Location: ${order.deliveryLocation}</p>
            <p>
                Order Status:
                <span class="order-status status-${order.status.toLowerCase().replaceAll(" ", "-")}">
                    ${order.status}
                </span>
            </p>

            <p>Tenant: ${[
              ...new Set(order.items.map((item) => item.tenant)),
            ].join(", ")}</p>

            <p>Total: Rp${order.total.toLocaleString("id-ID")}</p>

            ${
              order.assignedCrew
                ? `
                <p>Assigned Crew: ${order.assignedCrew}</p>
            `
                : ""
            }

            ${
              order.status === "Order Received"
                ? `
                <p>Waiting for tenant to prepare the order.</p>
            `
                : ""
            }

            ${
              order.status === "Preparing Your Order"
                ? `
                <p>Tenant is preparing the order.</p>
            `
                : ""
            }

            ${
              order.status === "Ready for Pickup"
                ? `
                <label for="crew-${order.orderNumber}">
                    Assign Delivery Crew
                </label>

                <input
                    type="text"
                    id="crew-${order.orderNumber}"
                    placeholder="Enter crew name"
                >

                <button onclick="assignCrewAndStartDelivery('${order.orderNumber}')">
                    Assign & Start Delivery
                </button>
            `
                : ""
            }

            ${
              order.status === "On Delivery"
                ? `
                <button onclick="updateOperationsOrderStatus('${order.orderNumber}', 'Delivered')">
                    Confirm Delivered
                </button>
            `
                : ""
            }

            ${
              order.status === "Delivered"
                ? `
                <p>Order successfully delivered.</p>
            `
                : ""
            }
        </div>
    `,
    )
    .join("");
}

// ASSIGN CREW AND START DELIVERY
function assignCrewAndStartDelivery(orderNumber) {
  const crewInput = document.getElementById("crew-" + orderNumber);

  const crewName = crewInput.value.trim();

  if (!crewName) {
    alert("Please enter the delivery crew name.");
    return;
  }

  let orders = JSON.parse(localStorage.getItem("gozeeOrders")) || [];

  const order = orders.find((item) => item.orderNumber === orderNumber);

  if (!order) {
    alert("Order not found.");
    return;
  }

  order.assignedCrew = crewName;
  order.status = "On Delivery";

  localStorage.setItem("gozeeOrders", JSON.stringify(orders));

  const currentOrder = JSON.parse(localStorage.getItem("gozeeCurrentOrder"));

  if (currentOrder && currentOrder.orderNumber === orderNumber) {
    currentOrder.assignedCrew = crewName;
    currentOrder.status = "On Delivery";

    localStorage.setItem("gozeeCurrentOrder", JSON.stringify(currentOrder));
  }

  alert("Crew assigned! Order is now on delivery.");

  loadOperationsOrders();
}

// UPDATE OPERATIONS ORDER STATUS
function updateOperationsOrderStatus(orderNumber, newStatus) {
  let orders = JSON.parse(localStorage.getItem("gozeeOrders")) || [];

  const order = orders.find((item) => item.orderNumber === orderNumber);

  if (!order) {
    alert("Order not found.");
    return;
  }

  order.status = newStatus;

  localStorage.setItem("gozeeOrders", JSON.stringify(orders));

  const currentOrder = JSON.parse(localStorage.getItem("gozeeCurrentOrder"));

  if (currentOrder && currentOrder.orderNumber === orderNumber) {
    currentOrder.status = newStatus;

    localStorage.setItem("gozeeCurrentOrder", JSON.stringify(currentOrder));
  }

  alert("Order status updated!");

  loadOperationsOrders();
}

function toggleDashboardMenu() {
  const menu = document.getElementById("dashboard-menu");

  menu.hidden = !menu.hidden;
}

function openTenantDashboard() {
  document.querySelectorAll("section").forEach((section) => {
    section.hidden = true;
  });

  document.getElementById("tenant-dashboard").hidden = false;
  document.getElementById("dashboard-menu").hidden = true;

  loadTenantOrders();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openOperationsDashboard() {
  document.querySelectorAll("section").forEach((section) => {
    section.hidden = true;
  });

  document.getElementById("operations-dashboard").hidden = false;
  document.getElementById("dashboard-menu").hidden = true;

  loadOperationsOrders();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// BACK TO HOME
function goToHome() {
  document.querySelectorAll("section").forEach((section) => {
    section.hidden = true;
  });

  document.getElementById("hero").hidden = false;
  document.getElementById("events").hidden = false;
  document.getElementById("upcoming-events").hidden = false;
  document.getElementById("about").hidden = false;

  document.getElementById("dashboard-menu").hidden = true;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// CLOSE EVENT DETAIL
function closeEvent() {
  document.getElementById("event-detail").hidden = true;
  document.getElementById("upcoming-events").hidden = false;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// BACK TO EVENT DETAIL
function backToEventDetail() {
  document.getElementById("tenant-products").hidden = true;
  document.getElementById("event-detail").hidden = false;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// EXPLORE EVENTS
function exploreEvents() {
  document.getElementById("upcoming-events").scrollIntoView({
    behavior: "smooth",
  });
}

function goToEvents() {
  const sectionsToHide = [
    "event-detail",
    "tenant-products",
    "shopping-cart",
    "checkout-page",
    "payment-success",
    "tracking-page",
    "tenant-dashboard",
    "operations-dashboard",
    "organizer-dashboard",
  ];

  sectionsToHide.forEach((id) => {
    document.getElementById(id).hidden = true;
  });

  document.getElementById("hero").hidden = false;
  document.getElementById("events").hidden = false;
  document.getElementById("upcoming-events").hidden = false;

  document.getElementById("dashboard-menu").hidden = true;

  document.getElementById("upcoming-events").scrollIntoView({
    behavior: "smooth",
  });
}

// SHOW SHOPPING CART
function showCart() {
  document.getElementById("tenant-products").hidden = true;
  document.getElementById("shopping-cart").hidden = false;

  renderCart();

  document.getElementById("shopping-cart").scrollIntoView({
    behavior: "smooth",
  });
}

// BACK TO PRODUCT CATALOG
function backToProducts() {
  document.getElementById("shopping-cart").hidden = true;
  document.getElementById("tenant-products").hidden = false;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// DISPLAY CART ITEMS
function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const subtotalElement = document.getElementById("cart-subtotal");
  const feeElement = document.getElementById("cart-fee");
  const totalElement = document.getElementById("cart-total");

  if (!cartItems || !subtotalElement || !feeElement || !totalElement) {
    console.error("Shopping cart elements not found in HTML.");
    return;
  }

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty. Add some products first.</p>";
    subtotalElement.textContent = "Rp 0";
    feeElement.textContent = "Rp 0";
    totalElement.textContent = "Rp 0";
    return;
  }

  let subtotal = 0;

  cartItems.innerHTML = cart
    .map(function (item, index) {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      return `
            <div class="cart-item">
                <div>
                    <h3>${item.name}</h3>
                    <p>${item.tenant}</p>
                    <p>Rp ${item.price.toLocaleString("id-ID")}</p>
                    <p>Item total: Rp ${itemTotal.toLocaleString("id-ID")}</p>
                </div>

                <div class="cart-controls">
                    <button onclick="changeCartQuantity(${index}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeCartQuantity(${index}, 1)">+</button>
                    <button class="cart-remove-button" onclick="removeCartItem(${index})">Remove</button>
                </div>
            </div>
        `;
    })
    .join("");

  const fee = Math.round(subtotal * 0.1);
  const total = subtotal + fee;

  subtotalElement.textContent = "Rp " + subtotal.toLocaleString("id-ID");
  feeElement.textContent = "Rp " + fee.toLocaleString("id-ID");
  totalElement.textContent = "Rp " + total.toLocaleString("id-ID");
}

// CHANGE PRODUCT QUANTITY
function changeCartQuantity(index, change) {
  if (!cart[index]) return;

  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
}

// REMOVE PRODUCT FROM CART
function removeCartItem(index) {
  if (!cart[index]) return;

  cart.splice(index, 1);

  saveCart();
  renderCart();
}

// GO TO CHECKOUT
function goToCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  document.getElementById("shopping-cart").hidden = true;
  document.getElementById("checkout-page").hidden = false;

  renderCheckout();

  document.getElementById("checkout-page").scrollIntoView({
    behavior: "smooth",
  });
}

// DISPLAY CHECKOUT SUMMARY
function renderCheckout() {
  const checkoutItems = document.getElementById("checkout-items");

  let subtotal = 0;

  checkoutItems.innerHTML = cart
    .map(function (item) {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      return `
            <div class="checkout-product">
                <span>${item.name} × ${item.quantity}</span>
                <strong>Rp ${itemTotal.toLocaleString("id-ID")}</strong>
            </div>
        `;
    })
    .join("");

  const fee = Math.round(subtotal * 0.1);
  const total = subtotal + fee;

  document.getElementById("checkout-subtotal").textContent =
    "Rp " + subtotal.toLocaleString("id-ID");

  document.getElementById("checkout-fee").textContent =
    "Rp " + fee.toLocaleString("id-ID");

  document.getElementById("checkout-total").textContent =
    "Rp " + total.toLocaleString("id-ID");
}

// BACK TO SHOPPING CART
function backToCart() {
  document.getElementById("checkout-page").hidden = true;
  document.getElementById("shopping-cart").hidden = false;

  renderCart();

  document.getElementById("shopping-cart").scrollIntoView({
    behavior: "smooth",
  });
}

// =================================
// EVENT ORGANIZER DASHBOARD
// =================================

function openEventOrganizerDashboard() {
  const sectionsToHide = [
    "hero",
    "events",
    "upcoming-events",
    "event-detail",
    "tenant-products",
    "shopping-cart",
    "checkout-page",
    "payment-success",
    "tracking-page",
    "tenant-dashboard",
    "operations-dashboard",
  ];

  sectionsToHide.forEach((id) => {
    const section = document.getElementById(id);
    if (section) section.hidden = true;
  });

  document.getElementById("organizer-dashboard").hidden = false;

  toggleDashboardMenu();

  document.getElementById("organizer-event-selector").value = "";

  document.getElementById("organizer-event-name").textContent =
    "Event Information";

  document.getElementById("organizer-event-category").textContent =
    "Event category will appear here.";

  document.getElementById("organizer-event-location").textContent =
    "Event location will appear here.";

  document.getElementById("organizer-total-orders").textContent = "0";
  document.getElementById("organizer-total-tenants").textContent = "0";
  document.getElementById("organizer-completed-orders").textContent = "0";
  document.getElementById("organizer-total-transaction").textContent = "Rp0";

  document.getElementById("organizer-tenant-list").innerHTML =
    "<p>Select an event to view its tenants.</p>";

  document.getElementById("organizer-order-list").innerHTML =
    "<p>Select an event to view its orders.</p>";

  window.scrollTo(0, 0);
}

function loadOrganizerDashboard() {
  const eventId = document.getElementById("organizer-event-selector").value;

  const event = eventData[eventId];

  const orders = JSON.parse(localStorage.getItem("gozeeOrders")) || [];

  const eventOrders = orders.filter((order) => order.eventId === eventId);

  if (!event) return;

  const tenants = event.tenants || [];

  // EVENT INFORMATION
  document.getElementById("organizer-event-name").textContent = event.title;

  document.getElementById("organizer-event-category").textContent =
    event.category;

  document.getElementById("organizer-event-location").textContent =
    event.location || "Location not specified";

  // EVENT STATISTICS
  const completedOrders = eventOrders.filter(
    (order) => order.status === "Delivered",
  );

  const totalGMV = eventOrders.reduce(
    (total, order) => total + Number(order.subtotal || 0),
    0,
  );

  const totalServiceRevenue = eventOrders.reduce(
    (total, order) => total + Number(order.serviceFee || 0),
    0,
  );

  const totalTransaction = eventOrders.reduce(
    (total, order) => total + Number(order.total || 0),
    0,
  );

  document.getElementById("organizer-total-orders").textContent =
    eventOrders.length;

  document.getElementById("organizer-total-tenants").textContent =
    tenants.length;

  document.getElementById("organizer-completed-orders").textContent =
    completedOrders.length;

  document.getElementById("organizer-total-transaction").textContent =
    "Rp" + totalTransaction.toLocaleString("id-ID");
  document.getElementById("report-gmv").textContent =
    "Rp" + totalGMV.toLocaleString("id-ID");

  document.getElementById("report-service-revenue").textContent =
    "Rp" + totalServiceRevenue.toLocaleString("id-ID");

  document.getElementById("report-total-transaction").textContent =
    "Rp" + totalTransaction.toLocaleString("id-ID");

  // REGISTERED TENANTS
  document.getElementById("organizer-tenant-list").innerHTML = tenants.length
    ? tenants
        .map(
          (tenant) => `
                <div class="organizer-tenant-item">
                    <p>${tenant}</p>
                </div>
            `,
        )
        .join("")
    : "<p>No registered tenants.</p>";

  // EVENT ORDERS
  const orderList = document.getElementById("organizer-order-list");

  if (eventOrders.length === 0) {
    orderList.innerHTML = "<p>No orders for this event yet.</p>";
  } else {
    orderList.innerHTML = eventOrders
      .map(
        (order) => `
            <div class="organizer-order-item">
                <h4>${order.orderNumber}</h4>
                <p>Customer: ${order.customerName}</p>
                <p>Tenant: ${[
                  ...new Set(order.items.map((item) => item.tenant)),
                ].join(", ")}</p>
                <p>Status: <strong>${order.status}</strong></p>
                <p>Total: Rp${Number(order.total || 0).toLocaleString("id-ID")}</p>
            </div>
        `,
      )
      .join("");
  }

  // ORDER OVERVIEW
  const statusCounts = {
    received: 0,
    preparing: 0,
    ready: 0,
    delivery: 0,
    delivered: 0,
  };

  eventOrders.forEach((order) => {
    if (order.status === "Order Received") {
      statusCounts.received++;
    } else if (order.status === "Preparing Your Order") {
      statusCounts.preparing++;
    } else if (order.status === "Ready for Pickup") {
      statusCounts.ready++;
    } else if (order.status === "On Delivery") {
      statusCounts.delivery++;
    } else if (order.status === "Delivered") {
      statusCounts.delivered++;
    }
  });

  document.getElementById("report-order-received").textContent =
    statusCounts.received;

  document.getElementById("report-preparing").textContent =
    statusCounts.preparing;

  document.getElementById("report-ready").textContent = statusCounts.ready;

  document.getElementById("report-delivery").textContent =
    statusCounts.delivery;

  document.getElementById("report-delivered").textContent =
    statusCounts.delivered;

  // TENANT PERFORMANCE
  const tenantPerformance = tenants
    .map((tenant) => {
      const tenantOrders = eventOrders.filter((order) =>
        order.items.some((item) => item.tenant === tenant),
      );

      const tenantRevenue = tenantOrders.reduce((total, order) => {
        const tenantItems = order.items.filter(
          (item) => item.tenant === tenant,
        );

        return (
          total +
          tenantItems.reduce(
            (sum, item) => sum + Number(item.price) * Number(item.quantity),
            0,
          )
        );
      }, 0);

      return {
        name: tenant,
        orders: tenantOrders.length,
        revenue: tenantRevenue,
      };
    })
    .sort((a, b) => b.orders - a.orders);

  const performanceList = document.getElementById(
    "organizer-tenant-performance",
  );

  const maxTenantOrders = Math.max(
    ...tenantPerformance.map((tenant) => tenant.orders),
    1,
  );

  if (tenantPerformance.length === 0) {
    performanceList.innerHTML = "<p>No tenant data available.</p>";
  } else {
    performanceList.innerHTML = tenantPerformance
      .map((tenant, index) => {
        const percentage = (tenant.orders / maxTenantOrders) * 100;

        return `
            <div class="organizer-performance-card">

                <div class="organizer-performance-top">
                    <div>
                        <span class="organizer-rank">#${index + 1}</span>
                        <strong>${tenant.name}</strong>
                    </div>

                    <span>${tenant.orders} Orders</span>
                </div>

                <div class="organizer-performance-bar">
                    <div style="width: ${percentage}%"></div>
                </div>

                <p>Product Sales: Rp${tenant.revenue.toLocaleString("id-ID")}</p>

            </div>
        `;
      })
      .join("");
  }
}

// DOWNLOAD EVENT REPORT
function downloadOrganizerReport() {
  const eventId = document.getElementById("organizer-event-selector").value;

  const event = eventData[eventId];

  if (!event) {
    alert("Please select an event first.");
    return;
  }

  const orders = JSON.parse(localStorage.getItem("gozeeOrders")) || [];

  const eventOrders = orders.filter((order) => order.eventId === eventId);

  const csvEscape = (value) =>
    '"' + String(value ?? "").replace(/"/g, '""') + '"';

  const rows = [
    ["GOZEE EVENT PERFORMANCE REPORT"],
    ["Event", event.title],
    ["Category", event.category],
    ["Location", event.location || "Not specified"],
    [],
    [
      "Order Number",
      "Customer",
      "Tenant",
      "Status",
      "Product Sales (GMV)",
      "GOZEE Service Revenue",
      "Total Transaction",
    ],
  ];

  eventOrders.forEach((order) => {
    rows.push([
      order.orderNumber,
      order.customerName,
      [...new Set(order.items.map((item) => item.tenant))].join(", "),
      order.status,
      order.subtotal || 0,
      order.serviceFee || 0,
      order.total || 0,
    ]);
  });

  const csvContent = rows.map((row) => row.map(csvEscape).join(",")).join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `GOZEE-${eventId}-Report.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function goToAbout() {
  const sectionsToHide = [
    "event-detail",
    "tenant-products",
    "shopping-cart",
    "checkout-page",
    "payment-success",
    "tracking-page",
    "tenant-dashboard",
    "operations-dashboard",
    "organizer-dashboard",
  ];

  sectionsToHide.forEach((id) => {
    document.getElementById(id).hidden = true;
  });

  document.getElementById("hero").hidden = false;
  document.getElementById("events").hidden = false;
  document.getElementById("upcoming-events").hidden = false;
  document.getElementById("about").hidden = false;
  document.getElementById("about").scrollIntoView({
    behavior: "smooth",
  });

  document.getElementById("dashboard-menu").hidden = true;
}
