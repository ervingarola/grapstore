// Variables globales
let currentImageFile = null
let nextProductId = 100 // Empezamos desde 100 para evitar conflictos

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  setupFileUpload()
  setupFormPreview()
  loadExistingProducts()
})

// Configurar subida de archivos
function setupFileUpload() {
  const fileUpload = document.getElementById("fileUpload")
  const fileInput = document.getElementById("productImage")

  // Click para abrir selector
  fileUpload.addEventListener("click", () => fileInput.click())

  // Drag and drop
  fileUpload.addEventListener("dragover", (e) => {
    e.preventDefault()
    fileUpload.classList.add("dragover")
  })

  fileUpload.addEventListener("dragleave", () => {
    fileUpload.classList.remove("dragover")
  })

  fileUpload.addEventListener("drop", (e) => {
    e.preventDefault()
    fileUpload.classList.remove("dragover")
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  })

  // Selección de archivo
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0])
    }
  })
}

// Manejar selección de archivo
async function handleFileSelect(file) {
  if (!file.type.match('image.*')) {
    alert("❌ Solo se permiten archivos de imagen");
    return false;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("❌ La imagen no debe exceder 2MB");
    return false;
  }

  try {
    const base64Image = await fileToBase64(file);
    
    // Mostrar vista previa (esto reemplaza el código suelto)
    document.getElementById("previewImage").src = base64Image;
    updateFileUploadText(`✅ ${file.name} seleccionado`);
    currentImageFile = file; // Guardar referencia al archivo
    
    return base64Image;
  } catch (error) {
    console.error("Error al procesar imagen:", error);
    return false;
  }
}
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

  // Mostrar vista previa


function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}
// Actualizar texto de subida
function updateFileUploadText(text) {
  const fileUpload = document.getElementById("fileUpload")
  fileUpload.innerHTML = `<p class="file-upload-text">${text}</p>`
}

// Configurar vista previa en tiempo real
function setupFormPreview() {
  const inputs = ["productName", "productPrice", "productDescription"]
  const previews = ["previewName", "previewPrice", "previewDescription"]

  inputs.forEach((inputId, index) => {
    document.getElementById(inputId).addEventListener("input", (e) => {
      const value =
        e.target.value || (index === 0 ? "Nombre del Producto" : index === 1 ? "Precio" : "Descripción del producto...")
      document.getElementById(previews[index]).textContent = value
    })
  })
}

// Manejar envío del formulario

// Configurar vista previa en tiempo real
function setupFormPreview() {
  const inputs = ["productName", "productPrice", "productDescription"]
  const previews = ["previewName", "previewPrice", "previewDescription"]

  inputs.forEach((inputId, index) => {
    document.getElementById(inputId).addEventListener("input", (e) => {
      const value =
        e.target.value || (index === 0 ? "Nombre del Producto" : index === 1 ? "Precio" : "Descripción del producto...")
      document.getElementById(previews[index]).textContent = value
    })
  })
}

// Agregar esta función de validación
function validateForm() {
  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("productPrice").value.trim();
  const description = document.getElementById("productDescription").value.trim();
  const category = document.getElementById("category").value;
  
  if (!name || name.length < 3) {
    alert("El nombre del producto debe tener al menos 3 caracteres");
    return false;
  }
  
  if (!/^C\$\d{1,3}(,\d{3})*$/.test(price)) {
    alert("Por favor ingresa un precio válido en formato C$ (ej: C$1,500)");
    return false;
  }
  
  if (!description || description.length < 10) {
    alert("La descripción debe tener al menos 10 caracteres");
    return false;
  }
  
  if (!category) {
    alert("Por favor selecciona una categoría");
    return false;
  }
  
  if (!currentImageFile) {
    alert("Por favor selecciona una imagen");
    return false;
  }
  
  return true;
}

// Modificar el event listener del formulario
document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  try {
    const base64Image = await handleFileSelect(currentImageFile);
    if (!base64Image) return;
    
    const formData = {
      id: nextProductId++,
      category: document.getElementById("category").value,
      name: document.getElementById("productName").value,
      price: document.getElementById("productPrice").value,
      description: document.getElementById("productDescription").value,
      image: base64Image,
    };
    
    addProduct(formData);
  } catch (error) {
    console.error("Error al procesar el formulario:", error);
    alert("Ocurrió un error al procesar el formulario");
  }
});

// Agregar producto
function addProduct(productData) {
  // ... el resto de tu código existente ...
}
// Agregar producto
function addProduct(productData) {
  // Simular guardado (aquí conectarías con tu backend)
  const products = getStoredProducts()

  

  const newProduct = {
    id: productData.id,
    name: productData.name,
    price: productData.price,
    image: productData.image, // Ahora es Base64
    description: productData.description,
    category: productData.category,
  };

  products.push(newProduct);
  localStorage.setItem("grapeStoreProducts", JSON.stringify(products));
  // Mostrar mensaje de éxito
  showSuccessMessage()

  // Limpiar formulario
  resetForm()

  // Recargar lista
  loadExistingProducts()
}

// Mostrar mensaje de éxito
function showSuccessMessage() {
  const message = document.getElementById("successMessage")
  message.style.display = "block"
  setTimeout(() => {
    message.style.display = "none"
  }, 3000)
}

// Limpiar formulario
function resetForm() {
  document.getElementById("productForm").reset()
  document.getElementById("previewImage").src =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3Lm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNFNUY1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTAwNkU2IiBmb250LXNpemU9IjE2Ij5TaW4gSW1hZ2VuPC90ZXh0Pgo8L3N2Zz4K"
  document.getElementById("previewName").textContent = "Nombre del Producto"
  document.getElementById("previewPrice").textContent = "Precio"
  document.getElementById("previewDescription").textContent = "Descripción del producto..."
  updateFileUploadText("📁 Arrastra tu foto aquí o haz clic para seleccionar")
  currentImageFile = null
}

// Obtener productos guardados
function getStoredProducts() {
  const stored = localStorage.getItem("grapeStoreProducts")
  return stored ? JSON.parse(stored) : []
}
 
function sanitizeInput(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}

// Cargar productos existentes
function loadExistingProducts() {
  const products = getStoredProducts()
  const container = document.getElementById("productsList")

  if (products.length === 0) {
    container.innerHTML = '<p class="empty-products">No hay productos agregados aún</p>'
    return
  }

  container.innerHTML = products
    .map(
  (product) => `
    <div class="product-item">
        <img src="${sanitizeInput(product.image)}" alt="${sanitizeInput(product.name)}">
        <div class="product-details">
            <h4>${sanitizeInput(product.name)}</h4>
            <p><strong>${sanitizeInput(product.price)}</strong> - ${sanitizeInput(product.category)}</p>
            <p style="font-size: 14px; color: #666;">${sanitizeInput(product.description)}</p>
        </div>
        <div class="product-actions">
            <button class="btn btn-small btn-danger" onclick="deleteProduct(${product.id})">
                🗑️ Eliminar
            </button>
        </div>
    </div>
  `
)
    .join("")
}

// Eliminar producto
function deleteProduct(productId) {
  if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
    let products = getStoredProducts()
    products = products.filter((p) => p.id !== productId)
    localStorage.setItem("grapeStoreProducts", JSON.stringify(products))
    loadExistingProducts()
  }
}

// Generar código para copiar
function generateCode() {
  const products = getStoredProducts()
  if (products.length === 0) {
    alert("❌ No hay productos para generar código")
    return
  }

  const code = generateProductsCode(products)

  // Crear modal para mostrar el código
  showCodeModal(code)
}

// Generar código JavaScript
function generateProductsCode(products) {
  const groupedProducts = {}

  products.forEach((product) => {
    if (!groupedProducts[product.category]) {
      groupedProducts[product.category] = []
    }
    groupedProducts[product.category].push(product)
  })

  let code = "// Código generado automáticamente\n"
  code += "// Copia este código y pégalo en tu archivo products-data.js\n\n"

  Object.keys(groupedProducts).forEach((category) => {
    code += `${category}: [\n`
    groupedProducts[category].forEach((product) => {
      code += `  {\n`
      code += `    id: ${product.id},\n`
      code += `    name: "${product.name}",\n`
      code += `    price: "${product.price}",\n`
      code += `    image: "${product.image}",\n`
      code += `    description: "${product.description}",\n`
      code += `  },\n`
    })
    code += `],\n\n`
  })

  return code
}

// Mostrar modal con código
function showCodeModal(code) {
  const modal = document.createElement("div")
  modal.className = "modal"

  modal.innerHTML = `
        <div class="modal-content">
            <h3>📋 Código Generado</h3>
            <p class="modal-description">Copia este código y pégalo en tu archivo products-data.js</p>
            <textarea class="modal-textarea" readonly>${code}</textarea>
            <div class="modal-buttons">
                <button class="modal-btn modal-btn-copy" onclick="copyToClipboard('${code.replace(/'/g, "\\'")}'); this.textContent='✅ Copiado!'">
                    📋 Copiar Código
                </button>
                <button class="modal-btn modal-btn-close" onclick="closeModal(this)">
                    ❌ Cerrar
                </button>
            </div>
        </div>
    `

  document.body.appendChild(modal)

  // Cerrar al hacer clic fuera
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove()
    }
  })
}

// Cerrar modal
function closeModal(button) {
  const modal = button.closest(".modal")
  if (modal) {
    modal.remove()
  }
}

// Copiar al portapapeles
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Código copiado al portapapeles")
    })
    .catch((err) => {
      console.error("Error al copiar:", err)
      // Fallback para navegadores más antiguos
      const textArea = document.createElement("textarea")
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    })
}
