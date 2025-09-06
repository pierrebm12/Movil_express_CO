
import React, { useState, useEffect } from 'react';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { useStore } from "@/lib/store";

const ProductCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const agregarAlCarrito = useStore((s) => s.agregarAlCarrito);
    const carrito = useStore((s) => s.carrito);

    const products = [
        {
            id: 1,
            name: "iPhone 14 Pro Max",
            price: 3750000,
            storage: "128GB",
            condition: "91%",
            image: "/assets/productos/celulares/usado/iphone/14promax_128g_91.jpg"
        },
        {
            id: 2,
            name: "iPhone 13",
            price: 2090000,
            storage: "128GB",
            condition: "86%",
            image: "/assets/productos/celulares/usado/iphone/13_128gb_98.jpg"
        },
        {
            id: 3,
            name: "iPhone 12",
            price: 1730000,
            storage: "64GB",
            condition: "91%",
            image: "/assets/productos/celulares/usado/iphone/iphone1264gb.jpg"
        },
        {
            id: 4,
            name: "iPhone 12 Pro",
            price: 2500000,
            storage: "128GB",
            condition: "100%",
            image: "/assets/productos/celulares/usado/iphone/12promax_128gb_100.jpg"
        },
        {
            id: 5,
            name: "iPhone 15 Pro",
            price: 4170000,
            storage: "256GB",
            condition: "92%",
            image: "/assets/productos/celulares/usado/iphone/15pro_256_92.jpg"
        },
        {
            id: 6,
            name: "iPhone 16",
            price: 3650000,
            storage: "128GB",
            condition: "100%",
            image: "/assets/productos/celulares/usado/iphone/16_128gb_100.jpg"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [products.length]);


    const handleWhatsApp = () => {
        const message = `Hola, estoy interesado en el ${products[currentIndex].name} ${products[currentIndex].storage} de la Seccion de Promociones de la Pagina por un Valor de ${products[currentIndex].price}`;
        const phoneNumber = "573102147638"; // Reemplaza con tu número de WhatsApp
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };


    // Convierte el producto del banner al formato esperado por el store
    const mapBannerProductToStore = (bannerProduct: any) => {
        // Genera un producto compatible con la interfaz Producto del store
        return {
            id: bannerProduct.id,
            codigo_producto: bannerProduct.name.replace(/ /g, "-").toLowerCase(),
            nombre: bannerProduct.name,
            descripcion: bannerProduct.name + ' ' + (bannerProduct.storage || "") + ' ' + (bannerProduct.condition || ""),
            precio_anterior: null,
            precio_actual: Number((bannerProduct.price || "").replace(/[^\d]/g, "")) || 0,
            precioNuevo: Number((bannerProduct.price || "").replace(/[^\d]/g, "")) || 0,
            precioAnterior: null,
            imagen: bannerProduct.image,
            estado: "usado",
            marca: "Apple",
            modelo: bannerProduct.name,
            capacidad: bannerProduct.storage,
            stock: 10,
            stock_minimo: 1,
            en_oferta: false,
            porcentaje_descuento: 0,
            rating: 5,
            imagen_principal: bannerProduct.image,
            categoria_principal: "Celulares",
            garantia_meses: 6,
            activo: true,
            destacado: true,
            peso: "0.5kg",
            dimensiones: "15x7x1cm",
            color_principal: "Negro",
            fecha_creacion: new Date().toISOString(),
            fecha_actualizacion: new Date().toISOString(),
            imagenes: [{ url_imagen: bannerProduct.image }],
            caracteristicas: [bannerProduct.storage, bannerProduct.condition],
            colores: ["Negro"],
            categorias: [{ id: 1, nombre: "Celulares" }],
        };
    };

    const handleBuy = () => {
        const bannerProduct = products[currentIndex];
        const product = mapBannerProductToStore(bannerProduct);
        const existe = carrito.some((item) => item.producto.id === product.id);
        if (existe) {
            window.location.href = "/carrito";
        } else {
            agregarAlCarrito(product, 1);
            window.location.href = "/carrito";
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
            {/* Carousel Container */}
            <div className="relative h-full">
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentIndex
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-105'
                            }`}
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay con gradiente */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-gray-800/50 to-black/70"></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 h-full flex items-center justify-center">
                            <div className="text-center text-white max-w-md mx-auto px-6">
                                {/* Product Name */}
                                <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                                    {product.name}
                                </h2>

                                {/* Product Info */}
                                <div className="mb-6 space-y-2">
                                    <p className="text-xl text-gray-300">{product.storage}</p>
                                    <p className="text-lg text-gray-400">Condición: {product.condition}</p>
                                </div>

                                {/* Price */}
                                <div className="mb-8">
                                    <p className="text-3xl md:text-4xl font-bold text-[#988443]">
                                        {product.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
                                    </p>
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={handleBuy}
                                        className="bg-[#988443] text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#a89653] transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        Comprar
                                    </button>

                                    <button
                                        onClick={handleWhatsApp}
                                        className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {products.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-[#988443] scale-125' : 'bg-white bg-opacity-50'
                            }`}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white bg-opacity-20 z-20">
                <div
                    className="h-full bg-[#988443] transition-all duration-100 ease-linear"
                    style={{
                        width: `${((currentIndex + 1) / products.length) * 100}%`
                    }}
                />
            </div>
        </div>
    );
};

export default ProductCarousel;