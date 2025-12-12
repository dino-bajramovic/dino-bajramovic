/**
 * Admin panel with login gate: enter admin key, then load/delete submissions.
 */
import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || '';
const DEFAULT_ERROR = 'Unable to load submissions. Check admin key and server.';
const MESSAGE_LIMIT = 1000;

const AdminPanel = () => {
  const [adminKey, setAdminKey] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ name: '', email: '', message: '' });

  const hasKey = useMemo(() => adminKey.trim().length > 0, [adminKey]);

  const fetchSubmissions = async (keyOverride) => {
    const key = (keyOverride || adminKey).trim();
    if (!key) {
      setError('Unesi admin key za pristup.');
      setAuthenticated(false);
      setSubmissions([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/submissions`, {
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': key,
        },
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok || !data.success) throw new Error(data.error || DEFAULT_ERROR);
      setSubmissions(data.submissions || []);
      setAuthenticated(true);
    } catch (err) {
      setError(err.message || DEFAULT_ERROR);
      setAuthenticated(false);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const removeSubmission = async (id) => {
    if (!hasKey) return;
    try {
      const res = await fetch(`${API_BASE}/api/submissions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey.trim(),
        },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Delete failed');
      setSubmissions((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setEditDraft({ name: '', email: '', message: '' });
      }
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  const startEdit = (entry) => {
    setEditingId(entry.id || entry._id || entry.mongoId);
    setEditDraft({ name: entry.name, email: entry.email, message: entry.message });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({ name: '', email: '', message: '' });
  };

  const saveEdit = async () => {
    if (!editingId || !hasKey) return;
    if (editDraft.message && editDraft.message.length > MESSAGE_LIMIT) {
      setError(`Message is too long (max ${MESSAGE_LIMIT} characters).`);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/submissions/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey.trim(),
        },
        body: JSON.stringify(editDraft),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Update failed');
      setSubmissions((prev) =>
        prev.map((item) => (item.id === editingId ? data.entry : item))
      );
      cancelEdit();
    } catch (err) {
      setError(err.message || 'Update failed');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetchSubmissions(adminKey);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setSubmissions([]);
    setAdminKey('');
  };

  useEffect(() => {
    // On mount keep admin key empty to avoid auto-login.
  }, []);

  return (
    <section
      id="admin"
      className="py-6 md:py-8"
    >
      <div className="container space-y-4 overflow-x-hidden">
        <div className="bg-zinc-850/60 border border-zinc-700/50 p-4 md:p-5 rounded-2xl shadow-lg shadow-black/30">
          <form
            className="flex flex-col sm:flex-row sm:items-end gap-3 md:gap-4"
            onSubmit={handleLogin}
          >
            <div className="w-full min-w-0">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Admin key</p>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Unesi admin ključ"
                className="text-field mt-1 w-full"
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto sm:pt-[18px]">
              <button
                type="submit"
                className="btn btn-secondary w-full sm:w-auto"
                disabled={loading || !hasKey}
              >
                {loading ? 'Loading...' : authenticated ? 'Refresh' : 'Login'}
              </button>
              {authenticated && (
                <button
                  type="button"
                  className="btn btn-ghost text-sm text-zinc-300 underline w-full sm:w-auto"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              )}
            </div>
          </form>
          {error && (
            <p className="text-sm text-red-400 mt-2">{error}</p>
          )}
          {authenticated && !error && (
            <p className="text-xs text-zinc-500 mt-2">
              Ulogovan si. Za osvježavanje upita klikni Refresh.
            </p>
          )}
        </div>

        {!authenticated && !error && (
          <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/40">
            <p className="text-zinc-300 font-medium">Prijavi se admin ključem da vidiš upite.</p>
            <p className="text-sm text-zinc-500 mt-1">Unesi ključ i klikni Login.</p>
          </div>
        )}

        {authenticated && submissions.length === 0 && !error && (
          <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/40">
            <p className="text-zinc-300">Nema pristiglih upita.</p>
          </div>
        )}

        <div className="grid gap-4 w-full">
        {submissions.map(({ id, name, email, message, createdAt }) => (
          <div
            key={id}
            className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/40 shadow-lg shadow-black/20 w-full"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
              <div>
                {editingId === id ? (
                  <>
                    <input
                      className="text-field mb-2 w-full"
                      value={editDraft.name}
                      onChange={(e) => setEditDraft((prev) => ({ ...prev, name: e.target.value }))}
                    />
                    <input
                      className="text-field w-full"
                      value={editDraft.email}
                      onChange={(e) => setEditDraft((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-zinc-100">{name}</p>
                    <p className="text-sm text-zinc-400 break-all">{email}</p>
                  </>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-zinc-500">{createdAt ? new Date(createdAt).toLocaleString() : ''}</span>
                {editingId === id ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="text-sm text-green-300 hover:text-green-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-sm text-zinc-300 hover:text-zinc-200"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit({ id, name, email, message })}
                      className="text-sm text-blue-300 hover:text-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeSubmission(id)}
                      className="text-sm text-red-300 hover:text-red-200"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
            {editingId === id ? (
              <textarea
                className="text-field w-full mt-3 min-h-40 max-h-[400px] resize-y overflow-y-auto"
                rows={6}
                value={editDraft.message}
                maxLength={MESSAGE_LIMIT}
                onChange={(e) => setEditDraft((prev) => ({ ...prev, message: e.target.value }))}
                onWheel={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="text-zinc-200 whitespace-pre-wrap break-words break-all overflow-x-hidden pr-1 w-full">
                {message}
              </div>
            )}
          </div>
        ))}
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;
