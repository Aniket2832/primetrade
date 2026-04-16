import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Plus, ListTodo, CheckCircle2, Clock, CircleDot, Search, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.tasks);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  useEffect(() => {
    let result = tasks;
    if (statusFilter !== 'all') result = result.filter(t => t.status === statusFilter);
    if (search.trim()) result = result.filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [tasks, statusFilter, search]);

  const handleCreate = async (form) => {
    try {
      const { data } = await api.post('/tasks', form);
      setTasks(prev => [data.task, ...prev]);
      setModalOpen(false);
      toast.success('Task created! ✨');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdate = async (form) => {
    try {
      const { data } = await api.put(`/tasks/${editTask.id}`, form);
      setTasks(prev => prev.map(t => t.id === editTask.id ? data.task : t));
      setEditTask(null);
      setModalOpen(false);
      toast.success('Task updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const openEdit = (task) => { setEditTask(task); setModalOpen(true); };
  const openCreate = () => { setEditTask(null); setModalOpen(true); };

  const stats = [
    { label: 'Total', value: tasks.length, icon: ListTodo, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { label: 'Pending', value: tasks.filter(t => t.status === 'pending').length, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, icon: CircleDot, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  ];

  const filters = ['all', 'pending', 'in-progress', 'completed'];

  return (
    <div className="bg-animated min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-16 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 fade-up">
          <div>
            <h1 className="font-display font-bold text-3xl text-white mb-1">
              {isAdmin ? 'All Tasks' : 'My Tasks'}
            </h1>
            <p className="text-slate-500 text-sm font-body">
              {isAdmin ? 'Managing tasks across all users' : `Welcome back, ${user?.name}`}
            </p>
          </div>
          <button onClick={openCreate}
            className="btn-gradient px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
            <span className="flex items-center gap-2">
              <Plus size={16} />
              New Task
            </span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`glass-card p-4 border ${stat.bg} fade-up`}
              style={{ animationDelay: `${i * 0.08}s`, opacity: 0, animationFillMode: 'forwards' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                <stat.icon size={16} className={stat.color} />
              </div>
              <span className={`font-display font-bold text-3xl ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 fade-up fade-up-delay-2">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              className="glass-input pl-9 py-2.5 text-sm"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${
                  statusFilter === f
                    ? 'btn-gradient text-white'
                    : 'glass-card text-slate-400 hover:text-white border border-white/10'
                }`}>
                <span>{f === 'all' ? 'All' : f}</span>
              </button>
            ))}
            <button onClick={fetchTasks}
              className="p-2 glass-card rounded-lg text-slate-400 hover:text-white border border-white/10 transition-all">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Tasks Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-16 text-center fade-up">
            <ListTodo size={40} className="text-slate-600 mx-auto mb-4" />
            <p className="font-display font-semibold text-slate-400 text-lg">No tasks found</p>
            <p className="text-slate-600 text-sm font-body mt-1">
              {search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first task to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((task, i) => (
              <div key={task.id} style={{ animationDelay: `${i * 0.06}s` }}>
                <TaskCard task={task} onEdit={openEdit} onDelete={handleDelete} isAdmin={isAdmin} />
              </div>
            ))}
          </div>
        )}
      </main>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTask(null); }}
        onSubmit={editTask ? handleUpdate : handleCreate}
        editTask={editTask}
      />
    </div>
  );
};

export default Dashboard;