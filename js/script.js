// Variables globales
let currentIndex = 0
let carousel
let slides
let totalSlides
let indicators
let autoSlideInterval
let currentProduct = {}
let quantity = 1

// Inicializar carrito si no existe
if (!localStorage.getItem('cart')) {
  localStorage.setItem('cart', JSON.stringify([]));
}

// Actualizar el contador del carrito
// Esta función se llama al cargar la página y cada vez que se agrega un producto al carrito
function updateCartCounter() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const counter = document.getElementById('cart-counter');
  if (counter) {
    counter.textContent = cart.length;
  }
}

// Llama a esta función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  updateCartCounter();
});


// Inicialización cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  console.log("🌟 DOM cargado, iniciando aplicación...")

  // IMPORTANTE: Generar productos después de que todo esté cargado
  setTimeout(() => {
    if (typeof window.generateAllProducts === "function") {
      window.generateAllProducts()
    } else {
      console.error("❌ generateAllProducts no está disponible")
    }
  }, 200) // Aumentamos el delay para asegurar que todo se cargue

  initializeCarousel()
  initializeModal()
  initializeSmoothScroll()
  hideLoading()
  lazyLoadImages()
  animateOnScroll()

  // Mostrar la primera sección por defecto
  showSection("todo")

  // Event listeners para errores de imagen
  setTimeout(() => {
    const images = document.querySelectorAll("img")
    images.forEach((img) => {
      img.addEventListener("error", () => handleImageError(img))
    })
  }, 500)

  // Event listeners para botones de favoritos (se aplicarán a productos generados dinámicamente)
  document.addEventListener("click", (e) => {
    if (e.target.closest(".btn-heart")) {
      toggleFavorite(e.target.closest(".btn-heart"))
    }
  })
})

// Función para ocultar loading
function hideLoading() {
  const loading = document.getElementById("loading")
  if (loading) {
    setTimeout(() => {
      loading.classList.remove("show")
    }, 500)
  }
}

// Inicializar carrusel
function initializeCarousel() {
  carousel = document.getElementById("carousel")
  if (!carousel) return

  slides = carousel.querySelectorAll(".slide")
  totalSlides = slides.length

  if (totalSlides === 0) return

  createIndicators()
  updateIndicators()
  startAutoSlide()

  // Pausar auto-slide cuando el mouse está sobre el carrusel
  const carouselContainer = document.querySelector(".carousel-container")
  if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", stopAutoSlide)
    carouselContainer.addEventListener("mouseleave", startAutoSlide)
  }
}

// Crear indicadores del carrusel
function createIndicators() {
  const indicatorsContainer = document.getElementById("indicators")
  if (!indicatorsContainer) return

  indicatorsContainer.innerHTML = ""

  for (let i = 0; i < totalSlides; i++) {
    const indicator = document.createElement("div")
    indicator.className = "indicator"
    indicator.addEventListener("click", () => goToSlide(i))
    indicatorsContainer.appendChild(indicator)
  }

  indicators = indicatorsContainer.querySelectorAll(".indicator")
}

// Actualizar indicadores
function updateIndicators() {
  if (!indicators) return

  indicators.forEach((indicator, index) => {
    indicator.classList.toggle("active", index === currentIndex)
  })
}

// Mostrar slide específico
function showSlide(index) {
  if (!carousel || totalSlides === 0) return

  currentIndex = index
  const translateX = -currentIndex * 100
  carousel.style.transform = `translateX(${translateX}%)`
  updateIndicators()
}

// Ir a slide específico
function goToSlide(index) {
  showSlide(index)
  restartAutoSlide()
}

// Siguiente slide
function nextSlide() {
  const nextIndex = (currentIndex + 1) % totalSlides
  showSlide(nextIndex)
}

// Slide anterior
function prevSlide() {
  const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides
  showSlide(prevIndex)
}

// Iniciar auto-slide
function startAutoSlide() {
  stopAutoSlide()
  autoSlideInterval = setInterval(nextSlide, 5000)
}

// Detener auto-slide
function stopAutoSlide() {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
    autoSlideInterval = null
  }
}

// Reiniciar auto-slide
function restartAutoSlide() {
  stopAutoSlide()
  startAutoSlide()
}

// Toggle del menú móvil
function toggleMenu() {
  const menu = document.getElementById("menu")
  if (menu) {
    menu.classList.toggle("show")
  }
}

// Cerrar menú
function closeMenu() {
  const menu = document.getElementById("menu")
  if (menu) {
    menu.classList.remove("show")
  }
}

// Mostrar sección específica
function showSection(sectionId) {
  // Ocultar todas las secciones
  const sections = document.querySelectorAll(".seccion-producto")
  sections.forEach((section) => {
    section.style.display = "none"
  })

  // Mostrar la sección seleccionada
  const targetSection = document.getElementById(sectionId)
  if (targetSection) {
    targetSection.style.display = "block"
  }
}

// Navegación suave
function initializeSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        // Mostrar la sección si es una sección de producto
        if (targetElement.classList.contains("seccion-producto")) {
          showSection(targetId)
        }

        // Scroll suave
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })

        // Cerrar menú móvil
        closeMenu()
      }
    })
  })
}

// Modal de imágenes
function initializeModal() {
  const modal = document.getElementById("imageModal")
  const productModal = document.getElementById("productModal")

  // Cerrar modal con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal()
      closeProductModal()
    }
  })
}

// Abrir modal de imagen
function openModal(imageSrc, caption) {
  const modal = document.getElementById("imageModal")
  const modalImage = document.getElementById("modalImage")
  const modalCaption = document.getElementById("modalCaption")

  if (modal && modalImage && modalCaption) {
    modalImage.src = imageSrc
    modalCaption.textContent = caption
    modal.classList.add("show")
    document.body.style.overflow = "hidden"
  }
}

// Cerrar modal de imagen
function closeModal() {
  const modal = document.getElementById("imageModal")
  if (modal) {
    modal.classList.remove("show")
    document.body.style.overflow = "auto"
  }
}

// ===== FUNCIONES PARA DETALLES DEL PRODUCTO =====

// Mostrar detalles del producto
function showProductDetails(name, price, image, description) {
  currentProduct = { name, price, image, description }
  quantity = 1

  const modal = document.getElementById("productModal")
  const modalImage = document.getElementById("productModalImage")
  const modalTitle = document.getElementById("productModalTitle")
  const modalPrice = document.getElementById("productModalPrice")
  const modalDescription = document.getElementById("productModalDescription")
  const quantitySpan = document.getElementById("quantity")

  if (modal && modalImage && modalTitle && modalPrice && modalDescription) {
    modalImage.src = image
    modalTitle.textContent = name
    modalPrice.textContent = price
    modalDescription.textContent = description
    quantitySpan.textContent = quantity

    modal.classList.add("show")
    document.body.style.overflow = "hidden"

    // Animación de entrada mejorada
    setTimeout(() => {
      const modalContent = modal.querySelector(".product-modal-content")
      if (modalContent) {
        modalContent.style.transform = "scale(1)"
        modalContent.style.opacity = "1"
      }
    }, 10)

    // Enfocar el botón de cerrar para accesibilidad
    setTimeout(() => {
      const closeButton = modal.querySelector(".modal-close")
      if (closeButton) {
        closeButton.focus()
      }
    }, 100)
  }
}

// Cerrar modal de producto con animación mejorada
function closeProductModal() {
  const modal = document.getElementById("productModal")
  if (modal) {
    const modalContent = modal.querySelector(".product-modal-content")

    // Animación de salida
    if (modalContent) {
      modalContent.style.transform = "scale(0.8)"
      modalContent.style.opacity = "0"
    }

    setTimeout(() => {
      modal.classList.remove("show")
      document.body.style.overflow = "auto"
    }, 200)
  }
}

// Cambiar cantidad
function changeQuantity(change) {
  quantity = Math.max(1, quantity + change)
  const quantityElement = document.getElementById("quantity")
  if (quantityElement) {
    quantityElement.textContent = quantity
  }
}

// Agregar al carrito (simulado)
function addToCart() {
  showNotification(
    `${currentProduct.name} agregado al carrito (${quantity} unidad${quantity > 1 ? "es" : ""})`,
    "success"
  );

  const item= {id: currentProduct.id,
    name: currentProduct.name,
    price: currentProduct.price,
    image: currentProduct.image,
    description: currentProduct.description,
    quantity: quantity,
  };
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart)); 

  // Enviar mensaje de WhatsApp

  const phoneNumber = "+50578940597"
  const message =`🛍️ *Nuevo pedido en Grape Store*:\n\n` +
                 `*Producto:* ${item.name}\n` +
                 `*Precio:* ${item.price}\n` +
                 `*Cantidad:* ${item.quantity}\n\n` +
                 `*Cliente:* Pendiente`; // Puedes añadir un input para el nombre luego

  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank")
  
   updateCartCounter();
  closeProductModal();
  
}

// Contactar por WhatsApp
function contactWhatsApp() {
  const message = `Hola! Me interesa el producto: ${currentProduct.name} (${currentProduct.price}). ¿Podrían darme más información?`
  const whatsappUrl = `https://wa.me/message/CLXFT5A2NSRPE1?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, "_blank")
  closeProductModal()
}

// Efectos de scroll
window.addEventListener("scroll", () => {
  const header = document.querySelector("header")
  if (header) {
    if (window.scrollY > 100) {
      header.style.background = "rgba(144, 6, 230, 0.95)"
    } else {
      header.style.background = "var(--primary-color)"
    }
  }
})

// Animaciones al hacer scroll
function animateOnScroll() {
  const elements = document.querySelectorAll(".product-card, .section-header")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  )

  elements.forEach((element) => {
    element.style.opacity = "0"
    element.style.transform = "translateY(30px)"
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(element)
  })
}

// Función para manejar errores de imágenes
function handleImageError(img) {
  img.src =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3Lm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNFNUY1Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwQzEyNy45MSAxMDAgMTEwIDExNy45MSAxMTAgMTQwQzExMCAxNjIuMDkgMTI3LjkxIDE4MCAxNTAgMTgwQzE3Mi4wOSAxODAgMTkwIDE2Mi4wOSAxOTAgMTQwQzE5MCAxMTcuOTEgMTcyLjA5IDEwMCAxNTAgMTAwWiIgZmlsbD0iIzlBMDZFNiIvPgo8L3N2Zz4K"
  img.alt = "Imagen no disponible"
}

// Función para lazy loading de imágenes
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Función para mostrar notificaciones
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#25d366" : "var(--primary-color)"};
        color: white;
        padding: 15px 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        z-index: 10001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// Función para manejar favoritos
function toggleFavorite(button) {
  const icon = button.querySelector("i")
  const isFavorite = icon.classList.contains("fas")

  if (isFavorite) {
    icon.classList.remove("fas")
    icon.classList.add("far")
    showNotification("Eliminado de favoritos", "info")
  } else {
    icon.classList.remove("far")
    icon.classList.add("fas")
    showNotification("Agregado a favoritos", "success")
  }
}

console.log("✅ Script principal cargado correctamente")
// Función para mostrar el modal del carrito
function showCart() {
  const modal = document.getElementById("cartModal");
  const cartItems = document.getElementById("cartItems");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Tu carrito está vacío</p>";
  } else {
    let html = "<ul>";
    cart.forEach(item => {
      html += `
        <li class="cart-item">
          <img src="${item.image}" alt="${item.name}" width="50">
          <div>
            <h4>${item.name}</h4>
            <p>${item.price} × ${item.quantity}</p>
          </div>
          <button onclick="removeFromCart(${item.id})">
            <i class="fas fa-trash"></i>
          </button>
        </li>
      `;
    });
    html += "</ul>";
    cartItems.innerHTML = html;
  }

  modal.style.display = "block";
}

// Función para cerrar el modal
function closeCartModal() {
  document.getElementById("cartModal").style.display = "none";
}

// Función para eliminar items
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  
  updateCartCounter();
  showCart(); // Refrescar el modal
}

// Función para enviar pedido a WhatsApp
function checkoutWhatsApp() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) return;

  let message = "🛍️ *Pedido de Grape Store*:\n\n";
  cart.forEach(item => {
    message += `➤ ${item.name} - ${item.price} (${item.quantity}x)\n`;
  });
  message += `\nTotal: ${calculateTotal()}`;

  window.open(`https://wa.me/50578940597?text=${encodeURIComponent(message)}`, "_blank");
}

// Función para calcular el total
function calculateTotal() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart.reduce((total, item) => {
    const price = Number(item.price.replace(/[^0-9]/g, ""));
    return total + (price * item.quantity);
  }, 0);
}