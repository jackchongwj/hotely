import { EmptyTableRow } from '../common/EmptyState';
import { confirm as confirmDialog } from '../../lib/confirm';
import useEscapeKey from '../../hooks/useEscapeKey';
import React, { useState, useEffect } from 'react';
import { SearchIcon, PlusIcon, PencilIcon, TrashIcon, ShieldIcon, UserIcon, LogOutIcon } from 'lucide-react';
import { userApi, StaffUser } from '../../services/api';

const inputCls = 'block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 px-3 text-sm';
const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';
const EMPTY_FORM = { fname: '', lname: '', email: '', password: '', role: 'User' as 'User' | 'Administrator' };

const RoleBadge = ({ role }: { role: string }) => (
  role === 'Administrator'
    ? <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"><ShieldIcon className="w-3 h-3" />Admin</span>
    : <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"><UserIcon className="w-3 h-3" />Staff</span>
);

const UserManagement = () => {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  useEscapeKey(showModal, () => setShowModal(false));
  const [editing, setEditing] = useState<StaffUser | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    userApi.getAll()
      .then(({ users }) => setUsers(users))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = users.filter(u =>
    !searchQuery ||
    `${u.fname} ${u.lname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAdd = () => { setEditing(null); setForm({ ...EMPTY_FORM }); setError(''); setShowModal(true); };
  const openEdit = (u: StaffUser) => {
    setEditing(u);
    setForm({ fname: u.fname, lname: u.lname, email: u.email, password: '', role: u.role });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (editing) {
        const update: any = { fname: form.fname, lname: form.lname, email: form.email, role: form.role };
        if (form.password) update.password = form.password;
        await userApi.update(editing._id, update);
      } else {
        if (!form.password) { setError('Password is required'); setSubmitting(false); return; }
        await userApi.create(form);
      }
      setShowModal(false);
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (u: StaffUser) => {
    if (!(await confirmDialog(`Delete user ${u.fname} ${u.lname}? This cannot be undone.`))) return;
    await userApi.delete(u._id).catch(() => {});
    load();
  };

  const handleInvalidate = async (u: StaffUser) => {
    if (!(await confirmDialog(`Force log out ${u.fname} ${u.lname}? Their current session will end immediately.`))) return;
    await userApi.invalidateSessions(u._id).catch(() => {});
  };

  const handleInvalidateAll = async () => {
    if (!(await confirmDialog('Revoke all active sessions for every user? Everyone will be logged out immediately.'))) return;
    await userApi.invalidateAllSessions().catch(() => {});
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">User Management</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage staff accounts and roles</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleInvalidateAll}
              className="inline-flex items-center px-3 py-2 border border-red-300 dark:border-red-700 text-sm font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
              <LogOutIcon className="h-4 w-4 mr-1" />Revoke All Sessions
            </button>
            <button onClick={openAdd} className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <PlusIcon className="h-4 w-4 mr-1" />Add User
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" className="pl-10 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 text-sm" placeholder="Search by name or email…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>

          {loading ? (
            <p className="text-center text-sm text-gray-500 py-8">Loading…</p>
          ) : (
            <div className="overflow-x-auto scrollbar-hide">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                  <tr>
                    {['User', 'Email', 'Role', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filtered.length === 0 ? (
                    <EmptyTableRow colSpan={4} message="No users found." />
                  ) : filtered.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-bold text-blue-700 dark:text-blue-200">
                            {u.fname[0]}{u.lname[0]}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{u.fname} {u.lname}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{u.email}</td>
                      <td className="px-4 py-4"><RoleBadge role={u.role} /></td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(u)} className="p-1 text-blue-500 hover:text-blue-700" title="Edit user"><PencilIcon className="w-4 h-4" /></button>
                          <button onClick={() => handleInvalidate(u)} className="p-1 text-amber-500 hover:text-amber-700" title="Force log out"><LogOutIcon className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(u)} className="p-1 text-red-400 hover:text-red-600" title="Delete user"><TrashIcon className="w-4 h-4" /></button>
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">{editing ? 'Edit User' : 'Add Staff User'}</h3>
            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>First Name</label>
                  <input className={inputCls} value={form.fname} onChange={e => setForm(f => ({ ...f, fname: e.target.value }))} required />
                </div>
                <div>
                  <label className={labelCls}>Last Name</label>
                  <input className={inputCls} value={form.lname} onChange={e => setForm(f => ({ ...f, lname: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" className={inputCls} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div>
                <label className={labelCls}>{editing ? 'New Password (leave blank to keep current)' : 'Password'}</label>
                <input type="password" className={inputCls} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required={!editing} />
              </div>
              <div>
                <label className={labelCls}>Role</label>
                <select className={inputCls} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as any }))}>
                  <option value="User">Staff</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-60">
                  {submitting ? 'Saving…' : editing ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
