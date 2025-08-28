// AddProduct.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft, Plus, X } from 'lucide-react';

interface ProductData {
  name: string;
  description: string;
  features: string;
  tech_spec: string;
  capacity: string;
  price: string;
  tags: string;
  images: File[];
}

interface ValidationErrors {
  name?: string;
  description?: string;
  features?: string;
  tech_spec?: string;
  capacity?: string;
  price?: string;
  tags?: string;
  images?: string;
}

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    description: '',
    features: '',
    tech_spec: '',
    capacity: '',
    price: '',
    tags: '',
    images: []
  });

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validar nombre
    if (!productData.name.trim()) {
      newErrors.name = 'El nombre del producto es obligatorio';
    }

    // Validar descripción
    if (!productData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }

    // Validar precio
    if (!productData.price.trim()) {
      newErrors.price = 'El precio es obligatorio';
    } else if (isNaN(Number(productData.price)) || Number(productData.price) <= 0) {
      newErrors.price = 'El precio debe ser un número válido mayor a 0';
    }

    // Validar imágenes
    if (productData.images.length === 0) {
      newErrors.images = 'Debe agregar al menos una imagen';
    } else {
      const validFormats = ['image/jpeg', 'image/png', 'image/jpg'];
      const invalidImages = productData.images.some(img => !validFormats.includes(img.type));
      if (invalidImages) {
        newErrors.images = 'Solo se permiten imágenes en formato JPG, JPEG o PNG';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setProductData(prev => ({
        ...prev,
        images: [...prev.images, ...filesArray]
      }));
      
      // Crear previsualizaciones
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
      
      if (errors.images) {
        setErrors(prev => ({
          ...prev,
          images: undefined
        }));
      }
    }
  };

  const removeImage = (index: number) => {
    setProductData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('features', productData.features);
      formData.append('tech_spec', productData.tech_spec);
      formData.append('capacity', productData.capacity);
      formData.append('price', productData.price);
      formData.append('tags', productData.tags);
      
      // Agregar imágenes
      productData.images.forEach((image, index) => {
        formData.append('images', image);
      });

      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage('Producto agregado exitosamente');
        // Resetear formulario
        setProductData({
          name: '',
          description: '',
          features: '',
          tech_spec: '',
          capacity: '',
          price: '',
          tags: '',
          images: []
        });
        setImagePreview([]);
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      } else {
        setErrorMessage(result.message || 'Error al agregar el producto');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al Panel de Administración
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Agregar Nuevo Producto</h1>
          <p className="text-gray-600 mt-2">Complete la información del producto para agregarlo al catálogo</p>
        </div>

        {/* Mensajes de éxito/error */}
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errorMessage}
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Información Básica */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nombre del Producto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: iPhone 15 Pro Max"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Precio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio del Producto *
                </label>
                <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: 1200000"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
            </div>

            {/* Capacidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacidad del Producto
              </label>
              <input
                type="text"
                name="capacity"
                value={productData.capacity}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 256GB, 8GB RAM, etc."
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Producto *
              </label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe el producto de manera atractiva para los clientes"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Características */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Características Principales
              </label>
              <textarea
                name="features"
                value={productData.features}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Lista las características principales (una por línea o separadas por comas)"
              />
            </div>

            {/* Ficha Técnica */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ficha Técnica
              </label>
              <textarea
                name="tech_spec"
                value={productData.tech_spec}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Especificaciones técnicas detalladas del producto"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Etiquetas)
              </label>
              <input
                type="text"
                name="tags"
                value={productData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Celular, Samsung, 5G, Android (separados por comas)"
              />
              <p className="text-gray-500 text-sm mt-1">Separa los tags con comas</p>
            </div>

            {/* Imágenes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imágenes del Producto *
              </label>
              
              {/* Zona de subida */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Haz clic para subir imágenes o arrastra y suelta</p>
                  <p className="text-sm text-gray-500">PNG, JPG, JPEG hasta 10MB cada una</p>
                </label>
              </div>
              
              {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
              
              {/* Vista previa de imágenes */}
              {imagePreview.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={preview} 
                        alt={`Preview ${index}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Agregando Producto...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Agregar Producto
                  </div>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="flex-1 sm:flex-none bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;