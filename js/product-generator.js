// ===== GENERADOR DE PRODUCTOS =====
// Este archivo genera automáticamente el HTML de los productos

// ❌ ANTES: let productsData (esto causaba el conflicto)
// ✅ AHORA: No declaramos productsData, usamos window.productsData

function createProductCard(product) {
  return `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-overlay">
          <button class="btn-heart" onclick="toggleFavorite(this)" aria-label="Agregar a favoritos">
            <i class="far fa-heart"></i>
          </button>
          <button class="btn-view" onclick="openModal('${product.image}', '${product.name}')" 
                  aria-label="Ver imagen ampliada de ${product.name}" title="Ver imagen ampliada">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="product-rating">
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
        </div>
        <div class="product-price">${product.price}</div>
        <button class="btn btn-primary btn-full" 
                onclick="showProductDetails('${product.name}', '${product.price}', '${product.image}', '${product.description.replace(/'/g, "\\'")}')">
          <i class="fas fa-shopping-cart"></i> Ver Detalles
        </button>
      </div>
    </div>
  `
}

function generateProductSection(sectionId, products) {
  const container = document.querySelector(`#${sectionId} .galeria`)
  if (!container) {
    console.log(`❌ No se encontró el contenedor para la sección: ${sectionId}`)
    return
  }

  console.log(`✅ Generando ${products.length} productos para la sección: ${sectionId}`)
  container.innerHTML = products.map((product) => createProductCard(product)).join("")
}

// Hacemos esta función global también
window.generateAllProducts = () => {
  console.log("🚀 Iniciando generación de productos...")

  // Verificar que los datos existen
  if (typeof window.productsData === "undefined") {
    console.error("❌ productsData no está definido. Asegúrate de cargar products-data.js primero.")
    return
  }

  // Generar sección "Todo" con productos destacados
  const featuredProducts = window.getFeaturedProducts()
  console.log("⭐ Productos destacados:", featuredProducts.length)
  generateProductSection("todo", featuredProducts)

  // Generar cada categoría
  generateProductSection("brazaletes", window.productsData.brazaletes)
  generateProductSection("anillos", window.productsData.anillos)
  generateProductSection("cadenas", window.productsData.cadenas)
  generateProductSection("charms", window.productsData.charms)
  generateProductSection("clip", window.productsData.clips)
  generateProductSection("aretes", window.productsData.aretes)

  console.log("🎉 Generación de productos completada!")
}

// Función para agregar más productos dinámicamente
window.addNewProduct = (category, productData) => {
  if (window.productsData[category]) {
    window.productsData[category].push(productData)
    generateProductSection(category, window.productsData[category])
    console.log(`✅ Producto agregado a ${category}:`, productData)
  }
}

// Función para buscar productos
window.searchProducts = (query) => {
  const allProducts = Object.values(window.productsData).flat()
  return allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()),
  )
}

console.log("✅ Generador de productos cargado correctamente")
