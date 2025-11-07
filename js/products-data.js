// ===== DATOS DE PRODUCTOS REALES DE GRAPE STORE =====
// Usamos 'window' para hacer la variable global y evitar conflictos
window.productsData = {
  brazaletes: [
    {
      id: 1,
      name: "Brazalete Elegante Unisex",
      price: "C$1,700",
      image: "img/braszalete_unisex.jpg",
      description: "Hermoso brazalete elegante con acabados únicos. Tallas disponibles: 18cm, 19cm, 20cm y 21cm.",
    },
    {
      id: 2,
      name: "Candado De Corazón",
      price: "C$1,850",
      image: "img/Candado_de_Corazon.jpg",
      description: "Elegante brazalete perfecto para ocasiones especiales. Tallas disponibles: 17cm y 18cm.",
    },
    {
      id: 3,
      name: "Brazalete Elegante",
      price: "$45.99",
      image: "img/brazalete1.jpg",
      description: "Hermoso brazalete elegante con acabados únicos.",
    },
    {
      id: 4,
      name: "Brazalete Dorado",
      price: "$52.99",
      image: "img/brazalete2.jpg",
      description: "Elegante brazalete dorado perfecto para ocasiones especiales.",
    },
    {
      id: 5,
      name: "Brazalete Plata",
      price: "$38.99",
      image: "img/brazalete3.jpg",
      description: "Brazalete de plata con diseño moderno y versátil.",
    },
  ],

  anillos: [
    {
      id: 6,
      name: "Anillo Ariel",
      price: "C$1,500",
      image: "img/Anillo_ariel.jpg",
      description: "Hermoso anillo inspirado en Ariel con detalles únicos.",
    },
    {
      id: 7,
      name: "Anillo Blancanieves",
      price: "$35.99",
      image: "img/Anillo_blancanieves.jpg",
      description: "Elegante anillo inspirado en Blancanieves con acabados únicos.",
    },
    {
      id: 8,
      name: "Anillo Corazón",
      price: "$42.99",
      image: "img/Anillo_corazon_rosado.jpg",
      description: "Romántico anillo con corazón rosado perfecto para regalar.",
    },
    {
      id: 9,
      name: "Anillo Lazo",
      price: "C$1,600",
      image: "img/Anillo_lazo_blanco.jpg",
      description:
        "Delicado anillo con lazo blanco de diseño elegante. Tallas disponibles: 5, 6, 7, 8, 9. Cada pieza es de plata 925.",
    },
  ],

  cadenas: [
    {
      id: 10,
      name: "Cadena Oro",
      price: "C$2,500",
      image: "img/cadena1.jpg",
      description: "Elegante cadena de oro con acabados premium.",
    },
    {
      id: 11,
      name: "Cadena Plata",
      price: "$48.99",
      image: "img/cadena2.jpg",
      description: "Hermosa cadena de plata con diseño moderno.",
    },
    {
      id: 12,
      name: "Cadena Delicada",
      price: "$55.99",
      image: "img/cadena3.jpg",
      description: "Delicada cadena perfecta para uso diario.",
    },
  ],

  charms: [
    {
      id: 13,
      name: "Charm Corazón",
      price: "C$800",
      image: "img/charm1.jpg",
      description: "Adorable charm en forma de corazón.",
    },
    {
      id: 14,
      name: "Charm Estrella",
      price: "$18.99",
      image: "img/charm2.jpg",
      description: "Brillante charm en forma de estrella.",
    },
    {
      id: 15,
      name: "Charm Luna",
      price: "$22.99",
      image: "img/charm3.jpg",
      description: "Místico charm en forma de luna.",
    },
  ],

  clips: [
    {
      id: 16,
      name: "Clip Dorado",
      price: "C$650",
      image: "img/clip1.jpg",
      description: "Elegante clip dorado para el cabello.",
    },
    {
      id: 17,
      name: "Clip Plateado",
      price: "$14.99",
      image: "img/clip2.jpg",
      description: "Moderno clip plateado con acabado brillante.",
    },
    {
      id: 18,
      name: "Clip Cristal",
      price: "C$750",
      image: "img/clip3.jpg",
      description: "Brillante clip con cristales que reflejan la luz.",
    },
    
  ],

  aretes: [
    {
      id: 19,
      name: "Aretes Perla",
      price: "C$1,200",
      image: "img/arete1.jpg",
      description: "Clásicos aretes de perla para cualquier ocasión.",
    },
    {
      id: 20,
      name: "Aretes Cristal",
      price: "$29.99",
      image: "img/arete2.jpg",
      description: "Brillantes aretes de cristal que capturan la luz.",
    },
    {
      id: 21,
      name: "Aretes Dorados",
      price: "$33.99",
      image: "img/arete3.jpg",
      description: "Elegantes aretes dorados con diseño sofisticado.",
    },
  ],
}

// Función para obtener productos destacados para la sección "Todo"
window.getFeaturedProducts = () => {
  const featured = []

  // Verificar que los datos existen antes de acceder
  if (window.productsData.brazaletes) {
    featured.push(window.productsData.brazaletes[0])
    featured.push(window.productsData.brazaletes[1])
  }

  if (window.productsData.anillos) {
    featured.push(window.productsData.anillos[0])
    featured.push(window.productsData.anillos[3])
  }

  if (window.productsData.cadenas) {
    featured.push(window.productsData.cadenas[0])
  }

  if (window.productsData.charms) {
    featured.push(window.productsData.charms[0])
  }

  if (window.productsData.clips) {
    featured.push(window.productsData.clips[0])
  }

  if (window.productsData.aretes) {
    featured.push(window.productsData.aretes[0])
  }

  return featured
}

console.log("✅ Datos de productos cargados correctamente para web")
