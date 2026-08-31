import { EmptyTableRow } from '../common/EmptyState';
import { SkeletonTableRows } from '../common/Skeleton';
import useEscapeKey from '../../hooks/useEscapeKey';
import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, PlusIcon, AlertTriangleIcon, CheckCircleIcon, PackageIcon, TrashIcon, PencilIcon } from 'lucide-react';
import { inventoryApi, InventoryItem } from '../../services/api';
import Pagination from '../common/Pagination';

const inputCls = 'block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 px-3 text-sm';

function itemStatus(amount: number): 'critical' | 'low' | 'in-stock' {
  if (amount <= 10) return 'critical';
  if (amount <= 30) return 'low';
  return 'in-stock';
}

const StatusBadge = ({ amount }: { amount: number }) => {
  const s = itemStatus(amount);
  if (s === 'critical') return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
      <AlertTriangleIcon className="w-3 h-3 mr-1" />Critical
    </span>
  );
  if (s === 'low') return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
      <AlertTriangleIcon className="w-3 h-3 mr-1" />Low Stock
    </span>
  );
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
      <CheckCircleIcon className="w-3 h-3 mr-1" />In Stock
    </span>
  );
};

const EMPTY_FORM = { code: '', name: '', description: '', type: '', amount: 0, price: 0 };

const Inventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showModal, setShowModal] = useState(false);
  useEscapeKey(showModal, () => setShowModal(false));
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  // Summary counts fetched separately (unaffected by search/type filter)
  const [counts, setCounts] = useState({ total: 0, inStock: 0, low: 0, critical: 0 });

  const load = (p: number, l: number, search: string, type: string) => {
    setLoading(true);
    inventoryApi.getAll(p, l, search, type)
      .then(({ inventory, total, pages }) => {
        setItems(inventory);
        setTotal(total);
        setPages(pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const loadCounts = () => {
    inventoryApi.getAll(1, 1000)
      .then(({ inventory: all }) => setCounts({
        total: all.length,
        inStock: all.filter(i => itemStatus(i.amount) === 'in-stock').length,
        low:     all.filter(i => itemStatus(i.amount) === 'low').length,
        critical:all.filter(i => itemStatus(i.amount) === 'critical').length,
      })).catch(() => {});
  };

  useEffect(() => { load(page, limit, searchQuery, typeFilter); }, [page, limit, typeFilter]);
  useEffect(() => { loadCounts(); }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => { setPage(1); load(1, limit, value, typeFilter); }, 350);
  };

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
    setPage(1);
  };

  const paged = items;

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (item: InventoryItem) => { setEditing(item); setForm({ code: item.code, name: item.name, description: item.description, type: item.type, amount: item.amount, price: item.price }); setShowModal(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await inventoryApi.update(editing._id, form);
      } else {
        await inventoryApi.create(form);
      }
      setShowModal(false);
      load(page, limit, searchQuery, typeFilter);
      loadCounts();
    } catch {} finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await inventoryApi.delete(id);
    load(page, limit, searchQuery, typeFilter);
    loadCounts();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Items', value: counts.total, color: 'border-blue-500', icon: <PackageIcon className="w-6 h-6 text-blue-600 dark:text-blue-300" />, bg: 'bg-blue-100 dark:bg-blue-900' },
          { label: 'In Stock', value: counts.inStock, color: 'border-green-500', icon: <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-300" />, bg: 'bg-green-100 dark:bg-green-900' },
          { label: 'Low Stock', value: counts.low, color: 'border-yellow-500', icon: <AlertTriangleIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />, bg: 'bg-yellow-100 dark:bg-yellow-900' },
          { label: 'Critical', value: counts.critical, color: 'border-red-500', icon: <AlertTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-300" />, bg: 'bg-red-100 dark:bg-red-900' },
        ].map(c => (
          <div key={c.label} className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-l-4 ${c.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{c.label}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{c.value}</p>
              </div>
              <div className={`p-2 rounded-full ${c.bg}`}>{c.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">Inventory</h2>
          <button onClick={openAdd} className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="h-4 w-4 mr-1" />Add Item
          </button>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" className="pl-10 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 text-sm" placeholder="Search by name or code…" value={searchQuery} onChange={e => handleSearch(e.target.value)} />
            </div>
            <select className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm py-2 px-3 text-sm" value={typeFilter} onChange={e => handleTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              {['Amenities', 'Cleaning', 'Linen', 'Food & Beverage', 'Maintenance', 'Office', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {loading ? (
            <table className="min-w-full"><tbody><SkeletonTableRows rows={6} cols={7} /></tbody></table>
          ) : (
            <div className="overflow-x-auto scrollbar-hide">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                  <tr>
                    {['Code', 'Name', 'Type', 'Amount', 'Price', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paged.length === 0 ? (
                    <EmptyTableRow colSpan={7} message="No inventory items found." sub="Try a different search or type." />
                  ) : paged.map(item => (
                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-4 text-xs text-gray-500 dark:text-gray-400">{item.code}</td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                        {item.description && <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{item.type}</td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{item.amount}</td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-4"><StatusBadge amount={item.amount} /></td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(item)} className="p-1 text-blue-500 hover:text-blue-700"><PencilIcon className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(item._id)} className="p-1 text-red-400 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination
            page={page}
            pages={pages}
            total={total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(l) => { setLimit(l); setPage(1); }}
          />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">{editing ? 'Edit Item' : 'Add Inventory Item'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code</label>
                  <input className={inputCls} value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <input className={inputCls} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input className={inputCls} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                  <input type="number" min="0" className={inputCls} value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($)</label>
                  <input type="number" min="0" step="0.01" className={inputCls} value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} required />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-60">
                  {submitting ? 'Saving…' : editing ? 'Update' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
