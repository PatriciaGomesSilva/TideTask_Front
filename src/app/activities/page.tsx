'use client';

import React, { useEffect, useState, useRef } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import axiosInstance from '../../../utils/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputMask from 'react-input-mask';

interface Category {
  id: string;
  description: string;
}

interface Activity {
  id: string;
  description: string;
  dt_inicial: string;
  dt_final: string;
  category_id: string;
  category: Category; // Categoria completa
}

const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({ description: '', dt_inicial: '', dt_final: '', category_id: '' });
  const [isDeleteActivityModalOpen, setIsDeleteActivityModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState('');
  const [isEditActivityModalOpen, setIsEditActivityModalOpen] = useState(false);
  const [editActivity, setEditActivity] = useState<Activity>({ id: '', description: '', dt_inicial: '', dt_final: '', category_id: '', category: { id: '', description: '' } });

  const notify = () => toast.success('Operação realizada com sucesso!');

  useEffect(() => {
    fetchActivities();
    fetchCategories();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axiosInstance.get('/activities');
      const activitiesWithCategories = response.data.map((activity: Activity) => ({
        ...activity,
        category: categories.find(category => category.id === activity.category_id) || { id: '', description: 'Sem Categoria' }
      }));
      setActivities(activitiesWithCategories);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

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

  const handleAddActivity = () => {
    setIsActivityModalOpen(true);
  };

  const handleCloseActivityModal = () => {
    setIsActivityModalOpen(false);
    setNewActivity({ description: '', dt_inicial: '', dt_final: '', category_id: '' });
  };

  const handleSaveActivity = () => {
    axiosInstance.post('/activities', newActivity)
      .then(response => {
        setActivities([...activities, response.data]);
        handleCloseActivityModal();
        notify();
      })
      .catch(error => {
        setError(error);
        toast.error('Falha ao adicionar atividade');
      });
  };

  const handleUpdateActivity = async () => {
    try {
      const response = await axiosInstance.put(`/activities/${editActivity.id}`, editActivity);
      setActivities(activities.map(activity => (activity.id === editActivity.id ? response.data : activity)));
      setIsEditActivityModalOpen(false);
      notify();
    } catch (err) {
      setError(err);
      toast.error('Falha ao atualizar atividade');
    }
  };

  const handleEditActivity = (activityId: string) => {
    const activityToEdit = activities.find(activity => activity.id === activityId);
    if (activityToEdit) {
      setEditActivity({
        ...activityToEdit,
        category: categories.find(category => category.id === activityToEdit.category_id) || { id: '', description: 'Sem Categoria' }
      });
      setIsEditActivityModalOpen(true);
    }
  };

  const handleDeleteActivity = async () => {
    try {
      await axiosInstance.delete(`/activities/${activityToDelete}`);
      setActivities(activities.filter(activity => activity.id !== activityToDelete));
      setIsDeleteActivityModalOpen(false);
      notify();
    } catch (err) {
      setError(err);
      toast.error('Falha ao excluir atividade');
    }
  };

  const inputMaskRef = useRef(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, activityId: string, field: string) => {
    // Example: using ref with input mask
    const value = e.target.value;
    if (inputMaskRef.current) {
      // You can access the input element like this
      const inputElement = inputMaskRef.current.inputElement.current;
      console.log('Input element:', inputElement);
    }
    // Your logic for date change handling
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro ao carregar atividades: {error.message}</p>;
  }

  return (
    <DashboardLayout>
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Atividades</h2>
        <button
          onClick={handleAddActivity}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Adicionar
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/3 py-2">Descrição</th>
              <th className="w-1/3 py-2">Data Inicial</th>
              <th className="w-1/3 py-2">Data Final</th>
              <th className="w-1/3 py-2">Categoria</th>
              <th className="w-1/6 py-2">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {activities.map(activity => (
              <tr key={activity.id}>
                <td className="w-1/3 py-2 border-b border-gray-200">{activity.description}</td>
                <td className="w-1/3 py-2 border-b border-gray-200">
                  <InputMask
                    mask="9999-99-99"
                    value={activity.dt_inicial}
                    onChange={(e) => handleDateChange(e, activity.id, 'dt_inicial')}
                    className="w-full p-2 border border-gray-300 rounded"
                    ref={inputMaskRef} // Example of using ref
                  />
                </td>
                <td className="w-1/3 py-2 border-b border-gray-200">
                  <InputMask
                    mask="9999-99-99"
                    value={activity.dt_final}
                    onChange={(e) => handleDateChange(e, activity.id, 'dt_final')}
                    className="w-full p-2 border border-gray-300 rounded"
                    ref={inputMaskRef} // Example of using ref
                  />
                </td>
                <td className="w-1/3 py-2 border-b border-gray-200">
                  {activity.category.description}
                </td>
                <td className="w-1/6 py-2 border-b border-gray-200">
                  <button
                    onClick={() => handleEditActivity(activity.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => { setIsDeleteActivityModalOpen(true); setActivityToDelete(activity.id); }}
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
      {/* Modal de adição de atividade, edição, exclusão e toast containers aqui */}
    </DashboardLayout>
  );
};

export default ActivitiesPage;

