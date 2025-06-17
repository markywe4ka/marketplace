// Создайте новый файл AdminCategories.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    parent: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Замените на ваш API-вызов
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error);
      toast.error('Не удалось загрузить категории');
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      // Замените на ваш API-вызов
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCategory)
      });
      
      if (response.ok) {
        toast.success('Категория успешно создана');
        setNewCategory({
          name: '',
          slug: '',
          description: '',
          parent: ''
        });
        fetchCategories();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Не удалось создать категорию');
      }
    } catch (error) {
      console.error('Ошибка при создании категории:', error);
      toast.error('Не удалось создать категорию');
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      // Замените на ваш API-вызов
      const response = await fetch(`/api/categories/${editingCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingCategory)
      });
      
      if (response.ok) {
        toast.success('Категория успешно обновлена');
        setEditingCategory(null);
        fetchCategories();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Не удалось обновить категорию');
      }
    } catch (error) {
      console.error('Ошибка при обновлении категории:', error);
      toast.error('Не удалось обновить категорию');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту категорию? Это действие невозможно отменить.')) {
      try {
        // Замените на ваш API-вызов
        const response = await fetch(`/api/categories/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          toast.success('Категория успешно удалена');
          fetchCategories();
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || 'Не удалось удалить категорию');
        }
      } catch (error) {
        console.error('Ошибка при удалении категории:', error);
        toast.error('Не удалось удалить категорию');
      }
    }
  };

  // Рассчитываем slug автоматически из имени категории
  const handleNameChange = (e, isEditing = false) => {
    const name = e.target.value;
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    if (isEditing) {
      setEditingCategory({
        ...editingCategory,
        name,
        slug
      });
    } else {
      setNewCategory({
        ...newCategory,
        name,
        slug
      });
    }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Управление категориями</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin">Панель администратора</Link>
        </li>
        <li className="breadcrumb-item active">Категории</li>
      </ol>
      
      <div className="row">
        <div className="col-lg-6">
          <div className="card mb-4">
            <div className="card-header">
              <i className="fas fa-list me-1"></i>
              Список категорий
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-3">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                  </div>
                </div>
              ) : categories.length === 0 ? (
                <p className="text-center text-muted my-3">Нет категорий</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Название</th>
                        <th>Slug</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(category => (
                        <tr key={category._id}>
                          <td>{category.name}</td>
                          <td>{category.slug}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => setEditingCategory(category)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteCategory(category._id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          {editingCategory ? (
            <div className="card mb-4">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <i className="fas fa-edit me-1"></i>
                    Редактирование категории
                  </div>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setEditingCategory(null)}
                  >
                    Отмена
                  </button>
                </div>
              </div>
              <div className="card-body">
                <form onSubmit={handleUpdateCategory}>
                  <div className="mb-3">
                    <label htmlFor="editName" className="form-label">Название</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editName"
                      value={editingCategory.name}
                      onChange={(e) => handleNameChange(e, true)}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="editSlug" className="form-label">Slug</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editSlug"
                      value={editingCategory.slug}
                      onChange={(e) => setEditingCategory({
                        ...editingCategory,
                        slug: e.target.value
                      })}
                      required
                    />
                    <div className="form-text">Используется в URL</div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="editDescription" className="form-label">Описание</label>
                    <textarea
                      className="form-control"
                      id="editDescription"
                      rows="3"
                      value={editingCategory.description || ''}
                      onChange={(e) => setEditingCategory({
                        ...editingCategory,
                        description: e.target.value
                      })}
                    ></textarea>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="editParent" className="form-label">Родительская категория</label>
                    <select
                      className="form-select"
                      id="editParent"
                      value={editingCategory.parent || ''}
                      onChange={(e) => setEditingCategory({
                        ...editingCategory,
                        parent: e.target.value
                      })}
                    >
                      <option value="">Нет родительской категории</option>
                      {categories
                        .filter(c => c._id !== editingCategory._id) // Исключаем текущую категорию
                        .map(category => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                  
                  <button type="submit" className="btn btn-primary">
                    Сохранить изменения
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="card mb-4">
              <div className="card-header">
                <i className="fas fa-plus me-1"></i>
                Добавить новую категорию
              </div>
              <div className="card-body">
                <form onSubmit={handleCreateCategory}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Название</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={newCategory.name}
                      onChange={(e) => handleNameChange(e)}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="slug" className="form-label">Slug</label>
                    <input
                      type="text"
                      className="form-control"
                      id="slug"
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory({
                        ...newCategory,
                        slug: e.target.value
                      })}
                      required
                    />
                    <div className="form-text">Используется в URL</div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Описание</label>
                    <textarea
                      className="form-control"
                      id="description"
                      rows="3"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({
                        ...newCategory,
                        description: e.target.value
                      })}
                    ></textarea>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="parent" className="form-label">Родительская категория</label>
                    <select
                      className="form-select"
                      id="parent"
                      value={newCategory.parent}
                      onChange={(e) => setNewCategory({
                        ...newCategory,
                        parent: e.target.value
                      })}
                    >
                      <option value="">Нет родительской категории</option>
                      {categories.map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button type="submit" className="btn btn-success">
                    Создать категорию
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;