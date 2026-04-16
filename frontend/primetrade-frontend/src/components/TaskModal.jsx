import { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSubmit, editTask }) => {
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' });

  useEffect(() => {
    if (editTask) {
      setForm({ title: editTask.title, description: editTask.description || '', status: editTask.status });
    } else {
      setForm({ title: '', description: '', status: 'pending' });
    }
  }, [editTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="glass-card w-full max-w-md fade-up" style={{
        background: 'rgba(10, 15, 40, 0.95)',
        border: '1px solid rgba(99,102,241,0.3)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)'
      }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="font-display font-bold text-lg gradient-text">
            {editTask ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Title *
            </label>
            <input
              className="glass-input"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Description
            </label>
            <textarea
              className="glass-input resize-none"
              placeholder="Add more details..."
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ paddingTop: '12px' }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Status
            </label>
            <select
              className="glass-input"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={{ cursor: 'pointer' }}
            >
              <option value="pending" style={{ background: '#0a0f28' }}>⏳ Pending</option>
              <option value="in-progress" style={{ background: '#0a0f28' }}>🔄 In Progress</option>
              <option value="completed" style={{ background: '#0a0f28' }}>✅ Completed</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 border border-white/10 hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button type="submit"
              className="flex-1 btn-gradient px-4 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
            >
              <span className="flex items-center gap-2">
                {editTask ? <Save size={15} /> : <Plus size={15} />}
                {editTask ? 'Save Changes' : 'Create Task'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;