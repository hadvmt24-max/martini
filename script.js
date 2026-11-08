// CONFIGURACIÓN DE LA TIENDA Y PRODUCTOS
// Puedes modificar, agregar o quitar productos fácilmente aquí abajo cambiando las URLs de las fotos, nombres, precios y categorías ("joyeria", "ropa", "calzado", "accesorios")
const WHATSAPP_NUMBER = "584148946454";

const products = [
    {
        id: 1,
        title: "Collar Elegante de Plata",
        category: "joyeria",
        price: 15.00,
        description: "Collar fino con dije brillante enchapado.",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        title: "Pulsera de Acero y Circones",
        category: "joyeria",
        price: 12.50,
        description: "Pulsera ajustable con detalles finos.",
        image: "https://images.unsplash.com/photo-1611591475271-1559483321d5?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        title: "Vestido Casual Lila",
        category: "ropa",
        price: 25.00,
        description: "Vestido fresco en tendencia, ideal para ocasiones casuales.",
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        title: "Aretes Colgantes Dorados",
        category: "joyeria",
        price: 10.00,
        description: "Aretes modernos y ligeros para destacar tu rostro.",
        image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        title: "Zapatillas Urbanas Rosa",
        category: "calzado",
        price: 35.00,
        description: "Calzado cómodo y moderno con detalles en tonos pastel.",
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        title: "Relicario Corazón Vintage",
        category: "accesorios",
        price: 18.00,
        description: "Hermoso relicario para guardar tus fotos favoritas.",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=500&q=80"
    }
];

let cart = [];

// DOM ELEMENTS
const productsGrid = document.getElementById("products-grid");
const cartBtn = document.getElementById("cart-btn");
const closeCartBtn = document.getElementById("close-cart");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const checkoutWhatsappBtn = document.getElementById("checkout-whatsapp");
const themeToggleBtn = document.getElementById("theme-toggle");
const catButtons = document.querySelectorAll(".cat-btn");

// INICIALIZAR LA PÁGINA
document.addEventListener("DOMContentLoaded", () => {
    renderProducts(products);
    initSlider();
    initTheme();
});

// RENDERIZAR PRODUCTOS EN LA CUADRÍCULA
function renderProducts(itemsToRender) {
    productsGrid.innerHTML = "";
    if (itemsToRender.length === 0) {
        productsGrid.innerHTML = `<p style="grid-column: span 2; text-align:center; opacity:0.6;">No hay productos en esta categoría.</p>`;
        return;
    }

    itemsToRender.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        
        // Enlace directo a WhatsApp para producto individual
        const singleWaText = encodeURIComponent(`¡Hola MartiniStore! Me interesa comprar:\n*${product.title}*\nPrecio: $${product.price.toFixed(2)}`);
        const singleWaUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${singleWaText}`;

        card.innerHTML = `
            <div class="product-img-container">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
            </div>
            <div class="product-actions">
                <button class="btn-add-cart" onclick="addToCart(${product.id})">Agregar al Carrito</button>
                <a href="${singleWaUrl}" target="_blank" class="btn-wa-single">
                    <i class="fa-brands fa-whatsapp"></i> Pedir directo
                </a>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

// FILTRAR POR CATEGORÍAS
catButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        catButtons.forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        const filter = e.target.getAttribute("data-filter");
        
        if (filter === "all") {
            renderProducts(products);
        } else {
            const filtered = products.filter(p => p.category === filter);
            renderProducts(filtered);
        }
    });
});

// SLIDER ROTATIVO AUTOMÁTICO
function initSlider() {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove("active"));
        dots.forEach(d => d.classList.remove("active"));
        
        slides[index].classList.add("active");
        dots[index].classList.add("active");
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Cambiar cada 4 segundos de forma automática
    let slideInterval = setInterval(nextSlide, 4000);

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            currentSlide = index;
            showSlide(currentSlide);
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 4000);
        });
    });
}

// FUNCIONES DEL CARRITO Y FACTURA
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCartUI();
    
    // Animación visual rápida del botón de carrito
    cartBtn.style.transform = "scale(1.2)";
    setTimeout(() => cartBtn.style.transform = "scale(1)", 200);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    cartCount.textContent = cart.length;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart-text">Tu carrito está vacío</p>`;
        cartTotal.textContent = "$0.00";
        return;
    }

    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const row = document.createElement("div");
        row.className = "cart-item-row";
        row.innerHTML = `
            <div class="cart-item-details">
                <span class="cart-item-title">${item.title}</span>
                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(row);
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// ABRIR / CERRAR MODAL DEL CARRITO
cartBtn.addEventListener("click", () => cartModal.classList.add("active"));
closeCartBtn.addEventListener("click", () => cartModal.classList.remove("active"));
cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) cartModal.classList.remove("active");
});

// ENVIAR FACTURA POR WHATSAPP
checkoutWhatsappBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de enviar la factura.");
        return;
    }

    let facturaText = "🧾 *FACTURA DE COMPRA - MartiniStore* 🧾\n\nHola, deseo realizar el pedido de los siguientes productos:\n\n";
    let total = 0;

    cart.forEach((item, index) => {
        facturaText += `${index + 1}. *${item.title}* — $${item.price.toFixed(2)}\n`;
        total += item.price;
    });

    facturaText += `\n---------------------------\n*TOTAL A PAGAR: $${total.toFixed(2)}*\n---------------------------\n¡Quedo atento(a) para coordinar el pago y envío!`;

    const encodedMessage = encodeURIComponent(facturaText);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
});

// MODO NOCTURNO
function initTheme() {
    const savedTheme = localStorage.getItem("martini_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";
        
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("martini_theme", newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = themeToggleBtn.querySelector("i");
    if (theme === "dark") {
        icon.className = "fa-solid fa-sun";
    } else {
        icon.className = "fa-solid fa-moon";
    }
}