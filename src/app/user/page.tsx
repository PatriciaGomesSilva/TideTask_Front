'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import axiosInstance from '../../../utils/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState('');
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User>({ id: '', firstName: '', lastName: '', email: '' });

  const notify = () => toast.success('Operação realizada com sucesso!');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setNewUser({ firstName: '', lastName: '', email: '', password: '' });
  };

  const handleSaveUser = () => {
    axiosInstance.post('/users', newUser)
      .then(response => {
        setUsers([...users, response.data]);
        handleCloseUserModal();
        notify();
      })
      .catch(error => {
        setError(error);
        toast.error('Falha ao adicionar usuário');
      });
  };

  const handleUpdateUser = async () => {
    try {
      const response = await axiosInstance.put(`/users/${editUser.id}`, editUser);
      setUsers(users.map(user => (user.id === editUser.id ? response.data : user)));
      setIsEditUserModalOpen(false);
      notify();
    } catch (err) {
      setError(err);
      toast.error('Falha ao atualizar usuário');
    }
  };

  const handleEditUser = (userId: string) => {
    const userToEdit = users.find(user => user.id === userId);
    if (userToEdit) {
      setEditUser(userToEdit);
      setIsEditUserModalOpen(true);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axiosInstance.delete(`/users/${userToDelete}`);
      setUsers(users.filter(user => user.id !== userToDelete));
      setIsDeleteUserModalOpen(false);
      notify();
    } catch (err) {
      setError(err);
      toast.error('Falha ao excluir usuário');
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro ao carregar usuários: {error.message}</p>;
  }

  return (
    <DashboardLayout>
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Usuários</h2>
        <button
          onClick={handleAddUser}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Adicionar
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/3 py-2">Nome Completo</th>
              <th className="w-1/3 py-2">E-mail</th>
              <th className="w-1/3 py-2">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.map(user => (
              <tr key={user.id}>
                <td className="w-1/3 py-2 border-b border-gray-200">{`${user.firstName} ${user.lastName}`}</td>
                <td className="w-1/3 py-2 border-b border-gray-200">{user.email}</td>
                <td className="w-1/3 py-2 border-b border-gray-200">
                  <button
                    onClick={() => handleEditUser(user.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setUserToDelete(user.id);
                      setIsDeleteUserModalOpen(true);
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
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Preencha os campos abaixo para criar uma conta.</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Nome</label>
                <input
                  type="text"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Sobrenome</label>
                <input
                  type="text"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Senha</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseUserModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveUser}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Criar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isEditUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Editar usuário</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Nome</label>
                <input
                  type="text"
                  value={editUser.firstName}
                  onChange={(e) =>
                    setEditUser({ ...editUser, firstName: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Sobrenome</label>
                <input
                  type="text"
                  value={editUser.lastName}
                  onChange={(e) =>
                    setEditUser({ ...editUser, lastName: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditUserModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleUpdateUser}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Atualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isDeleteUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Confirmar exclusão de usuário</h2>
            <p className="mb-4">Tem certeza que deseja excluir este usuário?</p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsDeleteUserModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
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

export default UsersPage;
