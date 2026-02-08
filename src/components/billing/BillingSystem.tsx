import React, { useState } from 'react';
import {
  SearchIcon,
  CreditCardIcon,
  DownloadIcon,
  FilterIcon,
  PlusIcon,
  DollarSignIcon } from
'lucide-react';
const BillingSystem = () => {
  const [activeTab, setActiveTab] = useState('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  // Mock data for invoices
  const invoices = [
  {
    id: 'INV-1001',
    guest: 'John Smith',
    room: '301',
    checkIn: '2023-06-10',
    checkOut: '2023-06-13',
    amount: 447,
    status: 'paid',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'INV-1002',
    guest: 'Sarah Johnson',
    room: '212',
    checkIn: '2023-06-12',
    checkOut: '2023-06-14',
    amount: 298,
    status: 'pending',
    paymentMethod: 'Pending'
  },
  {
    id: 'INV-1003',
    guest: 'Michael Brown',
    room: '105',
    checkIn: '2023-06-11',
    checkOut: '2023-06-12',
    amount: 149,
    status: 'paid',
    paymentMethod: 'Cash'
  },
  {
    id: 'INV-1004',
    guest: 'Emma Davis',
    room: '402',
    checkIn: '2023-06-09',
    checkOut: '2023-06-13',
    amount: 596,
    status: 'paid',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'INV-1005',
    guest: 'David Wilson',
    room: '203',
    checkIn: '2023-06-08',
    checkOut: '2023-06-10',
    amount: 298,
    status: 'refunded',
    paymentMethod: 'Credit Card'
  }];

  // Filter invoices based on search query and date filter
  const filteredInvoices = invoices.filter((invoice) => {
    if (
    searchQuery &&
    !invoice.guest.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !invoice.id.toLowerCase().includes(searchQuery.toLowerCase()))
    {
      return false;
    }
    // Apply date filter (this is just a mock implementation)
    if (dateFilter === 'today' && invoice.checkOut !== '2023-06-14') {
      return false;
    }
    if (dateFilter === 'yesterday' && invoice.checkOut !== '2023-06-13') {
      return false;
    }
    if (
    dateFilter === 'thisWeek' && (
    invoice.checkOut < '2023-06-08' || invoice.checkOut > '2023-06-14'))
    {
      return false;
    }
    return true;
  });
  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Paid
          </span>);

      case 'pending':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Pending
          </span>);

      case 'refunded':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            Refunded
          </span>);

      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            {status}
          </span>);

    }
  };
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'invoices' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>

              Invoices
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'payments' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>

              Payments
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'reports' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>

              Financial Reports
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search invoices or guests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} />

            </div>
            <div className="flex space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FilterIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}>

                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="thisWeek">This Week</option>
                  <option value="thisMonth">This Month</option>
                </select>
              </div>
              <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <PlusIcon className="h-4 w-4 mr-1" />
                New Invoice
              </button>
            </div>
          </div>
          {/* Invoices Tab */}
          {activeTab === 'invoices' &&
          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Invoice #
                    </th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Guest
                    </th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Check-In
                    </th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Check-Out
                    </th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredInvoices.map((invoice) =>
                <tr key={invoice.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {invoice.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {invoice.guest}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {invoice.room}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {invoice.checkIn}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {invoice.checkOut}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        ${invoice.amount}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {invoice.paymentMethod}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                            View
                          </button>
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                            <DownloadIcon className="h-4 w-4" />
                          </button>
                          {invoice.status === 'pending' &&
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                              Pay
                            </button>
                      }
                        </div>
                      </td>
                    </tr>
                )}
                  {filteredInvoices.length === 0 &&
                <tr>
                      <td
                    colSpan={9}
                    className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">

                        No invoices found matching your search.
                      </td>
                    </tr>
                }
                </tbody>
              </table>
            </div>
          }
          {/* Payments Tab */}
          {activeTab === 'payments' &&
          <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-green-100 dark:bg-green-800 p-3 rounded-full">
                      <DollarSignIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Today's Revenue
                      </h3>
                      <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                        $1,245
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full">
                      <CreditCardIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Pending Payments
                      </h3>
                      <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                        $298
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-purple-100 dark:bg-purple-800 p-3 rounded-full">
                      <DollarSignIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        This Week's Revenue
                      </h3>
                      <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                        $8,492
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    Recent Transactions
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <div className="flex items-center">
                        <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                          <CreditCardIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Payment from John Smith
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Credit Card •••• 4242 • June 13, 2023
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          $447.00
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          Successful
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <div className="flex items-center">
                        <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                          <DollarSignIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Payment from Michael Brown
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Cash • June 12, 2023
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          $149.00
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          Successful
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <div className="flex items-center">
                        <div className="bg-red-100 dark:bg-red-800 p-2 rounded-full">
                          <CreditCardIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Refund to David Wilson
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Credit Card •••• 7890 • June 10, 2023
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          -$298.00
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-400">
                          Refunded
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          {/* Financial Reports Tab */}
          {activeTab === 'reports' &&
          <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      Revenue by Room Type
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                          <div
                          className="bg-blue-600 h-4 rounded-full"
                          style={{
                            width: '45%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Standard (45%)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                          <div
                          className="bg-green-600 h-4 rounded-full"
                          style={{
                            width: '30%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Deluxe (30%)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                          <div
                          className="bg-purple-600 h-4 rounded-full"
                          style={{
                            width: '15%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Suite (15%)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                          <div
                          className="bg-yellow-600 h-4 rounded-full"
                          style={{
                            width: '10%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Executive (10%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      Payment Methods
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                          <div
                          className="bg-blue-600 h-4 rounded-full"
                          style={{
                            width: '65%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Credit Card (65%)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                          <div
                          className="bg-green-600 h-4 rounded-full"
                          style={{
                            width: '20%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Cash (20%)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                          <div
                          className="bg-purple-600 h-4 rounded-full"
                          style={{
                            width: '10%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Bank Transfer (10%)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                          <div
                          className="bg-yellow-600 h-4 rounded-full"
                          style={{
                            width: '5%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Other (5%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    Monthly Revenue
                  </h3>
                </div>
                <div className="p-6">
                  <div className="h-64 flex items-end space-x-2">
                    <div className="w-1/12 bg-blue-500 h-[30%] rounded-t"></div>
                    <div className="w-1/12 bg-blue-500 h-[40%] rounded-t"></div>
                    <div className="w-1/12 bg-blue-500 h-[35%] rounded-t"></div>
                    <div className="w-1/12 bg-blue-500 h-[50%] rounded-t"></div>
                    <div className="w-1/12 bg-blue-500 h-[45%] rounded-t"></div>
                    <div className="w-1/12 bg-blue-500 h-[60%] rounded-t"></div>
                    <div className="w-1/12 bg-blue-500 h-[80%] rounded-t"></div>
                    <div className="w-1/12 bg-blue-500 h-[75%] rounded-t"></div>
                    <div className="w-1/12 bg-blue-500 h-[65%] rounded-t"></div>
                    <div className="w-1/12 bg-blue-500 h-[90%] rounded-t"></div>
                    <div className="w-1/12 bg-blue-500 h-[85%] rounded-t"></div>
                    <div className="w-1/12 bg-blue-500 h-[70%] rounded-t"></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <div>Jan</div>
                    <div>Feb</div>
                    <div>Mar</div>
                    <div>Apr</div>
                    <div>May</div>
                    <div>Jun</div>
                    <div>Jul</div>
                    <div>Aug</div>
                    <div>Sep</div>
                    <div>Oct</div>
                    <div>Nov</div>
                    <div>Dec</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <DownloadIcon className="h-4 w-4 mr-1" />
                  Export Reports
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>);

};
export default BillingSystem;