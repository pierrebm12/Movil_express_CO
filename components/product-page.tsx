import React, { useState, useEffect } from 'react';
import type { ProductoCompleto, ProductoImagen, ProductoCaracteristica, ProductoColor } from "@/types/database";

// Modal de compartir
interface ShareButtonModalProps {
  product: ProductoCompleto;
}
const ShareButtonModal: React.FC<ShareButtonModalProps> = ({ product }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleWhatsapp = () => {
    const text = encodeURIComponent(`¡Mira este producto! ${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <>
      <button
        className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-md"
        onClick={() => setOpen(true)}
      >
        <Share2 className="w-5 h-5" />
        <span>Compartir</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xs relative animate-fadeIn border-2 border-primary-500">
            <button className="absolute top-2 right-2 text-primary-500 hover:text-black" onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary-700"><Share2 className="w-5 h-5" /> Compartir producto</h2>
            <div className="flex flex-col gap-4">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary-100 hover:bg-primary-200 text-primary-800 font-semibold justify-center border border-primary-400"
              >
                <Copy className="w-5 h-5" />
                {copied ? "¡Copiado!" : "Copiar link"}
              </button>
              <button
                onClick={handleWhatsapp}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-black hover:bg-primary-700 text-white font-semibold justify-center border border-black"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


// Permitir recibir un productId como prop
interface ProductPageProps {
  productId?: string | number;
}
import { ChevronLeft, ChevronRight, ShoppingCart, Check, Heart, Share2, Star, Copy, X, MessageCircle, Facebook, Instagram, Youtube } from 'lucide-react';
import { Footer, redesSociales as footerRedesSociales } from "./footer";
import { useStore } from "@/lib/store"
import { fetchProductoById, fetchRelatedProducts } from "@/lib/api"

// Floating Bubbles Background
const FloatingBubbles = () => {
  // Lava lamp bubbles: warm colors, organic movement, infinite floating
  // Usar la paleta principal: primary-500, primary-600, primary-300, primary-400, primary-200
  const bubbleColors = [
    'bg-gradient-to-br from-primary-500 via-primary-300 to-primary-600',
    'bg-gradient-to-br from-primary-400 via-primary-500 to-primary-300',
    'bg-gradient-to-br from-primary-600 via-primary-400 to-primary-200',
    'bg-gradient-to-br from-primary-300 via-primary-500 to-primary-400',
    'bg-gradient-to-br from-primary-200 via-primary-400 to-primary-600',
  ];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(18)].map((_, i) => {
        const size = Math.random() * 80 + 40;
        const left = Math.random() * 90;
        const top = Math.random() * 80;
          // Más movimiento: duración más corta y mayor rango de delay
          const duration = Math.random() * 8 + 8; // más rápido y variado
          const delay = Math.random() * 12; // burbujas aparecen en distintos momentos
        const blur = Math.random() > 0.5 ? 'blur-2xl' : 'blur-md';
        const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
        return (
          <div
            key={i}
            className={`absolute rounded-full ${color} ${blur} opacity-60 animate-lava-bubble`}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              willChange: 'transform',
            }}
          />
        );
      })}
      <style jsx global>{`
        @keyframes lava-bubble {
            0% { transform: translateY(0) scale(1) rotate(0deg); border-radius: 50%; }
            15% { transform: translateY(-40px) scale(1.2) rotate(12deg); border-radius: 60% 40% 55% 45% / 55% 65% 35% 45%; }
            30% { transform: translateY(-80px) scale(1.3) rotate(-16deg); border-radius: 45% 65% 55% 35% / 65% 35% 55% 45%; }
            50% { transform: translateY(-120px) scale(1.4) rotate(20deg); border-radius: 70% 30% 60% 40% / 40% 70% 30% 60%; }
            70% { transform: translateY(-80px) scale(1.3) rotate(-16deg); border-radius: 45% 65% 55% 35% / 65% 35% 55% 45%; }
            85% { transform: translateY(-40px) scale(1.2) rotate(12deg); border-radius: 60% 40% 55% 45% / 55% 65% 35% 45%; }
            100% { transform: translateY(0) scale(1) rotate(0deg); border-radius: 50%; }
        }
        .animate-lava-bubble {
          animation-name: lava-bubble;
          animation-timing-function: cubic-bezier(.77,.2,.18,1.01);
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

// Image Carousel Component
interface ImageCarouselProps {
  images: string[];
}
const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length, isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative group">
      <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
        <img
          src={images[currentIndex]}
          alt="Product"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        
        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <ChevronRight size={24} />
        </button>

        {/* Auto-play indicator */}
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              index === currentIndex 
                ? 'border-primary-500 scale-110' 
                : 'border-gray-300 hover:border-primary-300'
            }`}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

// Floating Cart Button
interface FloatingCartButtonProps {
  isVisible: boolean;
}
const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ isVisible }) => {
  const handleGoToCart = () => {
    window.location.href = "/carrito";
  };
  return (
    <button
      onClick={handleGoToCart}
      className={`fixed bottom-6 right-6 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white p-4 rounded-full shadow-2xl transition-all duration-500 z-50 transform hover:scale-110 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <ShoppingCart size={24} />
      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
        1
      </div>
    </button>
  );
};

// Social Links Component reutilizando las redes del footer
const SocialLinks = () => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {footerRedesSociales.map((red) => {
        const Icon = red.icon;
        return (
          <a
            key={red.nombre}
            href={red.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-2xl p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 transform hover:scale-125 hover:rotate-12 ${red.colorClasses || ''}`}
            title={`Ir a ${red.nombre}`}
          >
            <Icon className="w-5 h-5" />
          </a>
        );
      })}
    </div>
  );
};

// Product Slider Component
interface ProductSliderProps {
  products: ProductoCompleto[];
  darkMode?: boolean;
}
const ProductSlider: React.FC<ProductSliderProps> = ({ products, darkMode = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  useEffect(() => {
    // Detectar tamaño de pantalla y ajustar items por slide
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerSlide(1);
      } else {
        setItemsPerSlide(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.max(products.length - (itemsPerSlide - 1), 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [products.length, itemsPerSlide]);

  return (
    <div className="overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * (100 / itemsPerSlide)}%)`
        }}
      >
        {products.map((product: ProductoCompleto) => (
          <div
            key={product.id}
            className={`flex-none px-2 ${itemsPerSlide === 1 ? 'w-full' : 'w-1/3'}`}
          >
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col justify-between h-[400px]`}>
              <img
                src={product.image || product.imagen_principal || (product.imagenes && product.imagenes[0]?.url_imagen) || '/placeholder.svg'}
                alt={product.name || product.nombre}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : ''}`}>{product.name || product.nombre}</h3>
                  <p className={`font-bold text-xl ${darkMode ? 'text-primary-300' : 'text-primary-600'}`}>{product.precio_actual ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.precio_actual) : ''}</p>
                </div>
                <a
                  href={`/producto/${product.id}`}
                  className="mt-4 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold shadow-lg transition-all duration-300 text-center block"
                  style={{ width: '100%' }}
                >Ver producto</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// En tu componente de producto
interface BotonAgregarAlCarritoProps {
  productoId: number;
  color?: string;
}
function BotonAgregarAlCarrito({ productoId, color }: BotonAgregarAlCarritoProps) {
  const agregarAlCarrito = useStore((s) => s.agregarAlCarrito)
  const [loading, setLoading] = useState(false)

  const handleAgregar = async () => {
    setLoading(true)
    try {
      const producto = await fetchProductoById(productoId)
      agregarAlCarrito(producto, 1, color)
      // Opcional: mostrar feedback de éxito
    } catch (err: any) {
      alert("Error al agregar al carrito: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleAgregar} disabled={loading}>
      {loading ? "Agregando..." : "Agregar al carrito"}
    </button>
  )
}


// function handleVerProducto(productoId) {
//   fetchProductoById(productoId)
//     .then((producto) => {
//       useStore.getState().abrirModalProducto(producto)
//     })
//     .catch((err) => {
//       alert("Error al cargar producto: " + err.message)
//     })
// }

// Main Product Page Component

const ProductPage: React.FC<ProductPageProps> = ({ productId }) => {
  const [product, setProduct] = useState<ProductoCompleto | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductoCompleto[]>([]);
  const [showFloatingCart, setShowFloatingCart] = useState(false);
  const [marcaLogo, setMarcaLogo] = useState<string>("");


  useEffect(() => {
    // Cargar producto y relacionados desde la base de datos
    const id = productId ? Number(productId) : 1;
    fetchProductoById(id).then((prod) => {
      setProduct(prod);
      if (prod && prod.marca_id) {
        fetch(`/api/admin/marcas`).then(async (res) => {
          if (!res.ok) return;
          const data = await res.json();
          if (!data.success || !Array.isArray(data.data)) return;
          const marca = data.data.find((m: any) => m.id === prod.marca_id);
          if (marca && marca.logo) setMarcaLogo(marca.logo);
          else setMarcaLogo("");
        }).catch(() => setMarcaLogo(""));
      }
    });
    fetchRelatedProducts(id).then(setRelatedProducts);

    // Handle scroll for floating cart
    const handleScroll = () => {
      setShowFloatingCart(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [productId]);

  // Agregar producto al carrito usando el store global
  const agregarAlCarrito = useStore((s) => s.agregarAlCarrito);
  const carrito = useStore((s) => s.carrito);
  const handleComprarAhora = () => {
    if (!product) return;
    // Buscar si el producto ya está en el carrito (por id)
    const existe = carrito.some((item) => item.producto.id === product.id);
    if (existe) {
      window.location.href = "/carrito";
    } else {
      agregarAlCarrito(product, 1);
      window.location.href = "/carrito";
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 relative">
        <FloatingBubbles />
        {/* Header con logo Movil Express */}
        <header className="w-full flex flex-col items-center justify-center py-2 mb-6 bg-gradient-to-r from-primary-600 via-black to-primary-600 shadow-2xl rounded-b-3xl relative">
          <img src="/assets/logos/logosinFondo.PNG" alt="Movil Express Logo" className="h-32 md:h-40 drop-shadow-2xl mb-4 animate-fadeIn" style={{objectFit: 'contain'}} />
        </header>
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* ATTENTION - Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
              <div className="relative">
                <ImageCarousel images={product.imagenes?.length ? product.imagenes.map((img: ProductoImagen) => img.url_imagen || "/placeholder.svg") : ["/placeholder.svg"]} />
                {/* Logo de la marca en la esquina inferior derecha de la imagen principal */}
                {marcaLogo && (
                  <div className="absolute bottom-20 right-4 z-20">
                    <img
                      src={marcaLogo}
                      alt={`Logo ${product.marca}`}
                      className="h-14 w-14 md:h-20 md:w-20 rounded-full bg-white shadow-2xl p-2 object-contain border border-gray-200 animate-fadeInUp"
                      onError={(e) => { e.currentTarget.src = '/placeholder-logo.png'; }}
                    />
                  </div>
                )}
              </div>
          </div>
          
          <div className="space-y-6">
            {/* INTEREST - Product Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary-400 text-primary-400" />
                ))}
                <span className="text-gray-600">(127 reseñas)</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {product.nombre}
              </h1>
              {/* Estado del producto: Nuevo, Usado, Reacondicionado */}
              {product.estado ? (
                <span
                  className={
                    'inline-block mb-4 px-4 py-1 rounded-full text-sm font-semibold ' +
                    (product.estado === 'nuevo'
                      ? 'bg-green-100 text-green-800'
                      : product.estado === 'usado'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800')
                  }
                >
                  {product.estado.charAt(0).toUpperCase() + product.estado.slice(1)}
                </span>
              ) : null}
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-primary-600">
                  {product.precio_actual ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.precio_actual) : ''}
                </span>
                {product.precio_anterior && product.precio_anterior > product.precio_actual && (
                  <span className="text-xl text-gray-500 line-through">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.precio_anterior)}
                  </span>
                )}
                {product.precio_anterior && product.precio_anterior > product.precio_actual && (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                    -{Math.round(((product.precio_anterior - product.precio_actual) / product.precio_anterior) * 100)}% OFF
                  </span>
                )}
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {product.descripcion}
              </p>

              {/* Categorías */}
              {product.categorias && product.categorias.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
              {product.categorias.map((cat) => (
                    <span 
                      key={cat.id}
                      className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      #{cat.nombre}
                    </span>
                  ))}
                </div>
              )}
              {/* Colores disponibles */}
              {product.colores && product.colores.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 items-center">
                  <span className="font-semibold text-gray-700 mr-2">Colores disponibles:</span>
                  {product.colores.map((color: ProductoColor) => (
                    <span
                      key={color.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-gray-300 bg-gray-100"
                    >
                      <span
                        className="w-4 h-4 rounded-full mr-2 border border-gray-400"
                        style={{ backgroundColor: color.codigo_hex || '#eee' }}
                      ></span>
                      {color.nombre_color}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* DESIRE - Características */}
            {product.caracteristicas && product.caracteristicas.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Características</h3>
                <ul className="space-y-3">
                  {product.caracteristicas.map((car: ProductoCaracteristica, index: number) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="bg-green-100 rounded-full p-1">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">{car.nombre}: {car.valor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ACTION - Purchase Button */}
            <div className="space-y-4">
            <button
              onClick={handleComprarAhora}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary -700 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              🛒 Comprar Ahora - {product.precio_actual ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.precio_actual) : ''}
            </button>
              
              <div className="flex space-x-4">
                <ShareButtonModal product={product} />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">Síguenos y Comparte</h3>
          <SocialLinks />
        </div>

        {/* Related Products Slider */}
        <div className="mb-16 bg-gray-900 rounded-3xl py-12 px-2 md:px-8 shadow-2xl">
          <h3 className="text-3xl font-bold text-center mb-8 text-white drop-shadow-lg tracking-wide animate-fadeInUp">
            Productos Similares
          </h3>
          <ProductSlider
            products={relatedProducts}
            darkMode={true}
          />
        </div>
      </div>

      {/* Floating Cart Button eliminado */}
      
      {/* Urgency Banner animado */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 text-center z-40 animate__animated animate__pulse animate__infinite animate__faster animate-bounce">
        <p className="font-semibold text-lg animate-pulse animate-infinite animate-duration-1000 animate-delay-200 animate-ease-in-out animate-bounce">
          <span className="inline-block animate-bounce mr-2">⏰</span>
          <span className="animate-pulse">¡Oferta por tiempo limitado! Solo quedan <span className="font-extrabold animate-pulse animate-infinite animate-duration-700 animate-delay-100 animate-ease-in-out animate-bounce">3</span> unidades disponibles</span>
        </p>
      </div>
      {/* Animaciones Tailwind y animate.css, si no tienes animate.css puedes instalarla o usar solo animate-bounce y animate-pulse de Tailwind */}
    </div>
  );
};

export default ProductPage;