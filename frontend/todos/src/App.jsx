import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const App = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // Edit modal states
  const [editTodoId, setEditTodoId] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchTodos = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/todos`);

      setTodos(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!text.trim()) return;

    try {
      await axios.post(`${API_URL}/todos`, {
        text: text.trim(),
      });

      setText("");
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);

      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const updateTodo = async (id, newText) => {
    if (newText === null) return;

    const trimmed = newText.trim();

    if (!trimmed) return;

    try {
      await axios.put(`${API_URL}/todos/${id}`, {
        text: trimmed,
      });

      setEditTodoId(null);
      setEditText("");

      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  // Open edit modal
  const openEditModal = (todo) => {
    setEditTodoId(todo._id);
    setEditText(todo.text);
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditTodoId(null);
    setEditText("");
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-10 sm:py-16">

      {/* Main Container */}
      <div className="mx-auto w-full max-w-3xl">

        {/* Header */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-medium text-indigo-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400"></span>
                Task Manager
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                My Todo List
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Organize your tasks and stay productive.
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl shadow-lg shadow-indigo-500/20">
              ✓
            </div>

          </div>
        </div>

        {/* Add Todo */}
        <section className="mb-6 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-6">

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Add a new task
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Enter your task below and press Enter or click Add Task.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <input
              type="text"
              className="flex-1 rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition duration-300 focus:border-indigo-500/60 focus:bg-slate-950/70 focus:ring-4 focus:ring-indigo-500/10"
              placeholder="What needs to be done?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTodo();
              }}
            />

            <button
              onClick={addTodo}
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition duration-300 hover:-translate-y-0.5 hover:from-indigo-400 hover:to-purple-500 hover:shadow-indigo-500/30 active:translate-y-0"
            >
              <span className="text-lg transition-transform duration-300 group-hover:rotate-90">
                +
              </span>

              Add Task
            </button>

          </div>
        </section>

        {/* Todo List */}
        <section className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-6">

          {/* List Header */}
          <div className="mb-5 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-white">
                Your Tasks
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Keep track of everything you need to do.
              </p>
            </div>

            <div className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-semibold text-indigo-300">
              {todos.length} {todos.length === 1 ? "Task" : "Tasks"}
            </div>

          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-14">

              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500"></div>

              <p className="mt-4 text-sm text-slate-400">
                Loading your tasks...
              </p>

            </div>
          ) : todos.length === 0 ? (

            /* Empty State */
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/20 px-5 py-14 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-3xl">
                📝
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                No tasks yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                Your task list is empty. Add your first task above and start
                getting things done.
              </p>

            </div>

          ) : (

            /* Todo List */
            <ul className="space-y-3">

              {todos.map((todo) => (
                <li
                  key={todo._id}
                  className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/30 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/20 hover:bg-slate-950/50 hover:shadow-xl hover:shadow-black/10 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div className="flex min-w-0 flex-1 items-start gap-4">

                    {/* Task Icon */}
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-300 transition duration-300 group-hover:scale-110">
                      ✓
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="break-words font-medium text-white">
                        {todo.text}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        ID: {todo._id}
                      </p>

                    </div>

                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">

                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(todo)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/30 hover:bg-indigo-500/10 hover:text-indigo-300"
                      title="Edit Todo"
                    >
                      ✏️
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-400"
                      title="Delete Todo"
                    >
                      🗑️
                    </button>

                  </div>

                </li>
              ))}

            </ul>
          )}

          {/* Footer */}
          <footer className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-slate-500">

            <span>
              Stay focused. One task at a time.
            </span>

            <span className="hidden sm:block">
              Press{" "}
              <span className="font-medium text-slate-300">
                Enter
              </span>{" "}
              to add
            </span>

          </footer>

        </section>

        {/* Bottom Branding */}
        <div className="mt-6 text-center text-xs text-slate-600">
          MERN Todo App • Built with React & Tailwind CSS
        </div>

      </div>

      {/* ================= EDIT MODAL ================= */}
      {editTodoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">

          <div className="w-full max-w-md animate-[fadeIn_0.2s_ease-out] rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/40">

            {/* Modal Header */}
            <div className="mb-6 flex items-start justify-between">

              <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-xl">
                  ✏️
                </div>

                <h2 className="text-xl font-bold text-white">
                  Edit Task
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Update your task and save the changes.
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={closeEditModal}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition duration-200 hover:bg-white/5 hover:text-white"
              >
                ✕
              </button>

            </div>

            {/* Input */}
            <div className="mb-6">

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Task description
              </label>

              <input
                autoFocus
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateTodo(editTodoId, editText);
                  }

                  if (e.key === "Escape") {
                    closeEditModal();
                  }
                }}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition duration-300 focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/10"
                placeholder="Enter your task..."
              />

            </div>

            {/* Modal Buttons */}
            <div className="flex gap-3">

              <button
                onClick={closeEditModal}
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-medium text-slate-300 transition duration-300 hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={() => updateTodo(editTodoId, editText)}
                className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition duration-300 hover:-translate-y-0.5 hover:from-indigo-400 hover:to-purple-500"
              >
                Save Changes
              </button>

            </div>

            {/* Keyboard Hint */}
            <div className="mt-4 text-center text-xs text-slate-600">
              Press Enter to save • Esc to cancel
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default App;
