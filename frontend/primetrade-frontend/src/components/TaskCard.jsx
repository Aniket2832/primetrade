import { Pencil, Trash2, Clock, CheckCircle2, CircleDot, User } from 'lucide-react';

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  'in-progress': {
    label: 'In Progress',
    icon: CircleDot,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
};

const TaskCard = ({ task, onEdit, onDelete, isAdmin }) => {
  const status = statusConfig[task.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="glass-card glass-card-hover p-5 fade-up" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Glow accent top */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)' }}
      />

      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-display font-semibold text-slate-100 text-base leading-snug flex-1">
          {task.title}
        </h3>
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-slate-400 font-body leading-relaxed mb-4 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.bg} ${status.color}`}>
          <StatusIcon size={11} />
          {status.label}
        </span>

        <div className="flex items-center gap-3">
          {isAdmin && task.owner_name && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <User size={11} />
              {task.owner_name}
            </span>
          )}
          <span className="text-xs text-slate-600 font-body">
            {formatDate(task.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;