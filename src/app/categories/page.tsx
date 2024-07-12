"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import axiosInstance from '../../../utils/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Category {
  id: number;
  description: string;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ description: '' });
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category>({ id: 0, description: '' });

  const notify = () => toast.success('Operação realizada com sucesso!');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setNewCategory({ description: '' });
  };

  const handleSaveCategory = () => {
    axiosInstance.post('/categories', newCategory)
      .then(response => {
        setCategories([...categories, response.data]);
        handleCloseCategoryModal();
        notify();
      })
      .catch(error => {
        setError(error);
        toast.error('Falha ao adicionar categoria');
      });
  };

  const handleUpdateCategory = async () => {
    try {
      const response = await axiosInstance.put(`/categories/${editCategory.id}`, editCategory);
      setCategories(categories.map(category => (category.id === editCategory.id ? response.data : category)));
      setIsEditCategoryModalOpen(false);
      notify();
    } catch (err) {
      setError(err);
      toast.error('Falha ao atualizar categoria');
    }
  };

  const handleEditCategory = (categoryId: number) => {
    const categoryToEdit = categories.find(category => category.id === categoryId);
    if (categoryToEdit) {
      setEditCategory(categoryToEdit);
      setIsEditCategoryModalOpen(true);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await axiosInstance.delete(`/categories/${categoryToDelete}`);
      setCategories(categories.filter(category => category.id !== categoryToDelete));
      setIsDeleteCategoryModalOpen(false);
      notify();
    } catch (err) {
      setError(err);
      toast.error('Falha ao excluir categoria');
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro ao carregar categorias: {error.message}</p>;
  }

  return (
    <DashboardLayout>
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Categorias</h2>
        <button
          onClick={handleAddCategory}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Adicionar
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/2 py-2">Descrição</th>
              <th className="w-1/2 py-2">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {categories.map(category => (
              <tr key={category.id}>
                <td className="w-1/2 py-2 border-b border-gray-200">{category.description}</td>
                <td className="w-1/2 py-2 border-b border-gray-200">
                  <button
                    onClick={() => handleEditCategory(category.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setCategoryToDelete(category.id);
                      setIsDeleteCategoryModalOpen(true);
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Adicionar Nova Categoria</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Descrição</label>
                <input
                  type="text"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseCategoryModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveCategory}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isEditCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Editar Categoria</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Descrição</label>
                <input
                  type="text"
                  value={editCategory.description}
                  onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditCategoryModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleUpdateCategory}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Atualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isDeleteCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Confirmar Exclusão de Categoria</h2>
            <p className="mb-4">Tem certeza que deseja excluir esta categoria?</p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsDeleteCategoryModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteCategory}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CategoriesPage;
