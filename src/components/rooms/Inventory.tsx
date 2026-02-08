import React, { useState } from 'react';
import {
  SearchIcon,
  FilterIcon,
  PlusIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  PackageIcon,
  ShoppingCartIcon } from
'lucide-react';
const Inventory = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const categories = [
  {
    id: 'all',
    name: 'All Items'
  },
  {
    id: 'linens',
    name: 'Linens & Towels'
  },
  {
    id: 'toiletries',
    name: 'Toiletries'
  },
  {
    id: 'cleaning',
    name: 'Cleaning Supplies'
  },
  {
    id: 'minibar',
    name: 'Mini Bar'
  }];

  const inventoryItems = [
  {
    id: 'INV-001',
    name: 'Bath Towel (White)',
    category: 'linens',
    stock: 145,
    minStock: 50,
    unit: 'pcs',
    status: 'in-stock',
    lastRestock: '2023-06-10'
  },
  {
    id: 'INV-002',
    name: 'Hand Towel (White)',
    category: 'linens',
    stock: 85,
    minStock: 40,
    unit: 'pcs',
    status: 'in-stock',
    lastRestock: '2023-06-10'
  },
  {
    id: 'INV-003',
    name: 'Shampoo (50ml)',
    category: 'toiletries',
    stock: 32,
    minStock: 100,
    unit: 'bottles',
    status: 'low-stock',
    lastRestock: '2023-05-20'
  },
  {
    id: 'INV-004',
    name: 'Conditioner (50ml)',
    category: 'toiletries',
    stock: 45,
    minStock: 100,
    unit: 'bottles',
    status: 'low-stock',
    lastRestock: '2023-05-20'
  },
  {
    id: 'INV-005',
    name: 'Soap Bar (25g)',
    category: 'toiletries',
    stock: 210,
    minStock: 100,
    unit: 'bars',
    status: 'in-stock',
    lastRestock: '2023-06-01'
  },
  {
    id: 'INV-006',
    name: 'All-Purpose Cleaner',
    category: 'cleaning',
    stock: 12,
    minStock: 10,
    unit: 'bottles',
    status: 'in-stock',
    lastRestock: '2023-06-05'
  },
  {
    id: 'INV-007',
    name: 'Cola Can (330ml)',
    category: 'minibar',
    stock: 5,
    minStock: 20,
    unit: 'cans',
    status: 'critical',
    lastRestock: '2023-05-15'
  },
  {
    id: 'INV-008',
    name: 'Mineral Water (500ml)',
    category: 'minibar',
    stock: 48,
    minStock: 30,
    unit: 'bottles',
    status: 'in-stock',
    lastRestock: '2023-06-12'
  },
  {
    id: 'INV-009',
    name: 'Bed Sheet (King)',
    category: 'linens',
    stock: 60,
    minStock: 40,
    unit: 'pcs',
    status: 'in-stock',
    lastRestock: '2023-05-25'
  }];

  const filteredItems = inventoryItems.filter((item) => {
    const matchesCategory =
    activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.
    toLowerCase().
    includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-stock':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            In Stock
          </span>);

      case 'low-stock':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <AlertTriangleIcon className="w-3 h-3 mr-1" />
            Low Stock
          </span>);

      case 'critical':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <AlertTriangleIcon className="w-3 h-3 mr-1" />
            Critical
          </span>);

      default:
        return null;
    }
  };
  const getStockPercentage = (current: number, min: number) => {
    // Arbitrary max for visualization: min * 3
    const max = min * 3;
    const percentage = Math.min(100, Math.max(0, current / max * 100));
    return percentage;
  };
  const getStockColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-500';
      case 'low-stock':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Items
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {inventoryItems.length}
              </p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <PackageIcon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                In Stock
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {inventoryItems.filter((i) => i.status === 'in-stock').length}
              </p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
              <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Low Stock
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {inventoryItems.filter((i) => i.status === 'low-stock').length}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <AlertTriangleIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Critical
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {inventoryItems.filter((i) => i.status === 'critical').length}
              </p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
              <AlertTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            Inventory Management
          </h2>
          <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Item
          </button>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 md:space-x-4 mb-6">
            <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((cat) =>
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${activeCategory === cat.id ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'}`}>

                  {cat.name}
                </button>
              )}
            </div>
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} />

            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Stock Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Last Restock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredItems.map((item) =>
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50">

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ID: {item.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {categories.find((c) => c.id === item.category)?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full max-w-xs">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-700 dark:text-gray-300">
                            {item.stock} {item.unit}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            Min: {item.minStock}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                          className={`h-2 rounded-full ${getStockColor(item.status)}`}
                          style={{
                            width: `${getStockPercentage(item.stock, item.minStock)}%`
                          }}>
                        </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {item.lastRestock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                        Edit
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center">
                        <ShoppingCartIcon className="w-4 h-4 mr-1" />
                        Order
                      </button>
                    </td>
                  </tr>
                )}
                {filteredItems.length === 0 &&
                <tr>
                    <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">

                      No items found matching your filters.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>);

};
export default Inventory;