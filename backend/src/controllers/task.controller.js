const pool = require('../config/db');

const getAllTasks = async (req, res) => {
  try {
    let result;
    if (req.user.role === 'admin') {
      result = await pool.query(
        'SELECT t.*, u.name as owner_name FROM tasks t JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC'
      );
    } else {
      result = await pool.query(
        'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
        [req.user.id]
      );
    }
    res.status(200).json({ success: true, tasks: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

const createTask = async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, status, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, status || 'pending', req.user.id]
    );
    res.status(201).json({ success: true, message: 'Task created.', task: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const existing = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    if (req.user.role !== 'admin' && existing.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task.' });
    }

    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *',
      [
        title || existing.rows[0].title,
        description || existing.rows[0].description,
        status || existing.rows[0].status,
        id
      ]
    );
    res.status(200).json({ success: true, message: 'Task updated.', task: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    if (req.user.role !== 'admin' && existing.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task.' });
    }

    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.status(200).json({ success: true, message: 'Task deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }
    if (req.user.role !== 'admin' && result.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    res.status(200).json({ success: true, task: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

module.exports = { getAllTasks, createTask, updateTask, deleteTask, getTaskById };