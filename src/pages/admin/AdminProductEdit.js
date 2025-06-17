import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI } from '../../api';
import '../../styles/AdminProductEdit.css';

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  // Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    stock: 'in-stock',
    tags: [],
    isNew: false,
    discountPercentage: '',
    originalPrice: '',
    color: '#000000',
    availableColors: [{ name: 'Black', code: '#000000' }],
    availableSizes: [],
  });
  
  // Состояние изображений
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [colorImages, setColorImages] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Состояние категорий
  const [categories, setCategories] = useState([]);
  
  // Состояние загрузки и ошибок
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Загрузка товара и категорий при редактировании
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Загрузка категорий
        try {
          const categoriesResponse = await categoryAPI.getCategories();
          setCategories(categoriesResponse.data);
        } catch (categoryError) {
          console.warn('Error loading categories, using fallback data:', categoryError);
          // Резервные данные в случае недоступности API
          setCategories([
            { _id: '1', name: 'Women\'s Clothing' },
            { _id: '2', name: 'Men\'s Clothing' },
            { _id: '3', name: 'Footwear' },
            { _id: '4', name: 'Accessories' }
          ]);
        }
        
        // Если это редактирование, загружаем данные товара
        if (isEditing) {
          const productResponse = await productAPI.getProductById(id);
          const product = productResponse.data;
          
          // Заполняем форму данными товара
          setFormData({
            name: product.name || '',
            category: product.category || '',
            description: product.description || '',
            price: product.price || '',
            stock: product.stock || 'in-stock',
            tags: product.tags || [],
            isNew: product.isNew || false,
            discountPercentage: product.discountPercentage || '',
            originalPrice: product.originalPrice || '',
            color: product.color || '#000000',
            availableColors: product.availableColors || [{ name: 'Black', code: '#000000' }],
            availableSizes: product.availableSizes || [],
          });
          
          // Загружаем изображения
          if (product.images && product.images.length > 0) {
            // Предполагаем, что первое изображение - главное
            setMainImage(product.images[0]);
            setAdditionalImages(product.images.slice(1));
          }
          
          // Загружаем изображения для разных цветов
          if (product.colorImages) {
            setColorImages(product.colorImages);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditing]);
  
  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Для чекбоксов используем checked, для остальных value
    const val = type === 'checkbox' ? checked : value;
    
    // Обновляем состояние формы
    setFormData({
      ...formData,
      [name]: val
    });
  };
  
  // Обработчик изменения тегов
  const handleTagsChange = (e) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
    
    setFormData({
      ...formData,
      tags: tagsArray
    });
  };
  
  // Обработчик изменения доступных размеров
  const handleSizesChange = (e) => {
    const sizesString = e.target.value;
    const sizesArray = sizesString.split(',').map(size => size.trim()).filter(Boolean);
    
    setFormData({
      ...formData,
      availableSizes: sizesArray
    });
  };
  
  // Обработчик добавления цвета
  const handleAddColor = () => {
    const newColor = { name: 'New Color', code: '#cccccc' };
    
    setFormData({
      ...formData,
      availableColors: [...formData.availableColors, newColor]
    });
  };
  
  // Обработчик изменения цвета
  const handleColorChange = (index, field, value) => {
    const updatedColors = [...formData.availableColors];
    updatedColors[index] = {
      ...updatedColors[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      availableColors: updatedColors
    });
  };
  
  // Обработчик удаления цвета
  const handleRemoveColor = (index) => {
    const updatedColors = formData.availableColors.filter((_, i) => i !== index);
    
    setFormData({
      ...formData,
      availableColors: updatedColors
    });
  };
  
  // Обработчик загрузки главного изображения
  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      // Создаем локальный URL для превью
      const imageUrl = URL.createObjectURL(file);
      setMainImage(imageUrl);
      
      // Загружаем файл на сервер
      // const formData = new FormData();
      // formData.append('image', file);
      
      // В реальном приложении здесь будет загрузка на сервер
      // const response = await productAPI.uploadImage(formData);
      // setMainImage(response.data.url);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    }
  };
  
  // Обработчик загрузки дополнительных изображений
  const handleAdditionalImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    try {
      // Создаем локальные URL для превью
      const imageUrls = files.map(file => URL.createObjectURL(file));
      setAdditionalImages([...additionalImages, ...imageUrls]);
      
      // Загружаем файлы на сервер
      // В реальном приложении здесь будет загрузка на сервер
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Failed to upload images. Please try again.');
    }
  };
  
  // Обработчик загрузки изображений для цвета
  const handleColorImageUpload = async (e, colorCode) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    try {
      // Создаем локальные URL для превью
      const imageUrls = files.map(file => URL.createObjectURL(file));
      
      setColorImages({
        ...colorImages,
        [colorCode]: [...(colorImages[colorCode] || []), ...imageUrls]
      });
      
      // Загружаем файлы на сервер
      // В реальном приложении здесь будет загрузка на сервер
    } catch (err) {
      console.error('Error uploading color images:', err);
      setError('Failed to upload color images. Please try again.');
    }
  };
  
  // Обработчик удаления изображения
  const handleRemoveImage = (type, index, colorCode = null) => {
    if (type === 'main') {
      setMainImage(null);
    } else if (type === 'additional') {
      setAdditionalImages(additionalImages.filter((_, i) => i !== index));
    } else if (type === 'color' && colorCode) {
      const updatedColorImages = {...colorImages};
      updatedColorImages[colorCode] = updatedColorImages[colorCode].filter((_, i) => i !== index);
      setColorImages(updatedColorImages);
    }
  };
  
  // Обработчик сохранения товара
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      // Подготовка данных товара
      const productData = {
        ...formData,
        price: parseInt(formData.price),
        originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : undefined,
        discountPercentage: formData.discountPercentage ? parseInt(formData.discountPercentage) : undefined,
        images: [mainImage, ...additionalImages].filter(Boolean),
        colorImages
      };
      
      if (isEditing) {
        // Обновление существующего товара
        await productAPI.updateProduct(id, productData);
      } else {
        // Создание нового товара
        await productAPI.createProduct(productData);
      }
      
      setSuccess(true);
      setSaving(false);
      
      // Перенаправление на страницу товаров через 2 секунды
      setTimeout(() => {
        navigate('/admin/products');
      }, 2000);
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Failed to save product. Please try again.');
      setSaving(false);
    }
  };
  
  // Если данные загружаются, показываем индикатор загрузки
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading product data...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-product-edit">
      <div className="page-header">
        <h1>{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
        <button 
          className="back-button"
          onClick={() => navigate('/admin/products')}
        >
          ← Back to Products
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="success-message">
          <p>Product {isEditing ? 'updated' : 'created'} successfully!</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          {/* Основная информация */}
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                required
              ></textarea>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="stock">Stock Status</label>
                <select
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                >
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isNew"
                  checked={formData.isNew}
                  onChange={handleInputChange}
                />
                Mark as New Product
              </label>
            </div>
          </div>
          
          {/* Секция скидок */}
          <div className="form-section">
            <h2>Discount Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="originalPrice">Original Price (before discount)</label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Optional"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="discountPercentage">Discount Percentage</label>
                <input
                  type="number"
                  id="discountPercentage"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  placeholder="e.g. 15 for 15%"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                value={formData.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="e.g. new, featured, sale"
              />
              <small>These tags are used for filtering products on the website.</small>
            </div>
          </div>
          
          {/* Изображения товара */}
          <div className="form-section">
            <h2>Product Images</h2>
            
            <div className="form-group">
              <label>Main Product Image *</label>
              <div className="image-upload-container">
                {mainImage ? (
                  <div className="image-preview">
                    <img src={mainImage} alt="Main product" />
                    <button 
                      type="button" 
                      className="remove-image" 
                      onClick={() => handleRemoveImage('main')}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      id="main-image"
                    />
                    <label htmlFor="main-image">Click to upload main image</label>
                  </div>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label>Additional Images</label>
              <div className="additional-images">
                {additionalImages.map((img, index) => (
                  <div key={index} className="image-preview">
                    <img src={img} alt={`Product view ${index + 1}`} />
                    <button 
                      type="button" 
                      className="remove-image" 
                      onClick={() => handleRemoveImage('additional', index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="upload-placeholder small">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImageUpload}
                    id="additional-images"
                  />
                  <label htmlFor="additional-images">+ Add more</label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Варианты цветов и размеров */}
          <div className="form-section">
            <h2>Product Variants</h2>
            
            <div className="form-group">
              <label>Available Colors</label>
              <div className="colors-container">
                {formData.availableColors.map((color, index) => (
                  <div key={index} className="color-item">
                    <div className="color-inputs">
                      <input
                        type="text"
                        value={color.name}
                        onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                        placeholder="Color name"
                      />
                      <input
                        type="color"
                        value={color.code}
                        onChange={(e) => handleColorChange(index, 'code', e.target.value)}
                      />
                      <button 
                        type="button" 
                        className="remove-color"
                        onClick={() => handleRemoveColor(index)}
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="color-images">
                      {colorImages[color.code]?.map((img, imgIndex) => (
                        <div key={imgIndex} className="image-preview small">
                          <img src={img} alt={`${color.name} view ${imgIndex + 1}`} />
                          <button 
                            type="button" 
                            className="remove-image" 
                            onClick={() => handleRemoveImage('color', imgIndex, color.code)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <div className="upload-placeholder tiny">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleColorImageUpload(e, color.code)}
                          id={`color-images-${index}`}
                        />
                        <label htmlFor={`color-images-${index}`}>+ Add</label>
                      </div>
                    </div>
                  </div>
                ))}
                <button 
                  type="button" 
                  className="add-color-btn"
                  onClick={handleAddColor}
                >
                  + Add Color
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="availableSizes">Available Sizes (comma-separated)</label>
              <input
                type="text"
                id="availableSizes"
                value={formData.availableSizes.join(', ')}
                onChange={handleSizesChange}
                placeholder="e.g. S, M, L, XL"
              />
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="save-btn"
            disabled={saving}
          >
            {saving ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductEdit;