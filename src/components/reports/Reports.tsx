import React, { useState } from 'react';
import {
  DownloadIcon,
  FilterIcon,
  BarChartIcon,
  PieChartIcon,
  TrendingUpIcon,
  CalendarIcon } from
'lucide-react';
const Reports = () => {
  const [reportType, setReportType] = useState('occupancy');
  const [dateRange, setDateRange] = useState('month');
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Reports & Analytics
          </h2>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <DownloadIcon className="h-4 w-4 mr-1" />
            Export Data
          </button>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BarChartIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}>

                <option value="occupancy">Occupancy Rate</option>
                <option value="revenue">Revenue Analysis</option>
                <option value="guests">Guest Statistics</option>
                <option value="housekeeping">Housekeeping</option>
              </select>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}>

                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
          {/* Occupancy Rate Report */}
          {reportType === 'occupancy' &&
          <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full">
                      <BarChartIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Average Occupancy
                      </h3>
                      <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        72%
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                  <div className="flex items-center">
                    <div className="bg-green-100 dark:bg-green-800 p-3 rounded-full">
                      <TrendingUpIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Peak Occupancy
                      </h3>
                      <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        94%
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                  <div className="flex items-center">
                    <div className="bg-amber-100 dark:bg-amber-800 p-3 rounded-full">
                      <PieChartIcon className="h-6 w-6 text-amber-600 dark:text-amber-300" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Lowest Occupancy
                      </h3>
                      <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        45%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b dark:border-gray-600">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    Occupancy by Day
                  </h3>
                </div>
                <div className="p-6">
                  <div className="h-64 flex items-end space-x-2">
                    <div className="w-1/7 bg-blue-500 h-[65%] rounded-t"></div>
                    <div className="w-1/7 bg-blue-500 h-[70%] rounded-t"></div>
                    <div className="w-1/7 bg-blue-500 h-[60%] rounded-t"></div>
                    <div className="w-1/7 bg-blue-500 h-[80%] rounded-t"></div>
                    <div className="w-1/7 bg-blue-500 h-[90%] rounded-t"></div>
                    <div className="w-1/7 bg-blue-500 h-[85%] rounded-t"></div>
                    <div className="w-1/7 bg-blue-500 h-[75%] rounded-t"></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                    <div>Sun</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b dark:border-gray-600">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      Occupancy by Room Type
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                          <div
                          className="bg-blue-600 h-4 rounded-full"
                          style={{
                            width: '85%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Standard (85%)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                          <div
                          className="bg-green-600 h-4 rounded-full"
                          style={{
                            width: '75%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Deluxe (75%)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                          <div
                          className="bg-purple-600 h-4 rounded-full"
                          style={{
                            width: '60%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Suite (60%)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                          <div
                          className="bg-yellow-600 h-4 rounded-full"
                          style={{
                            width: '50%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Executive (50%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b dark:border-gray-600">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      Occupancy Forecast
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                          <div
                          className="bg-blue-600 h-4 rounded-full"
                          style={{
                            width: '75%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Next Week (75%)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                          <div
                          className="bg-blue-600 h-4 rounded-full"
                          style={{
                            width: '65%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Next Month (65%)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                          <div
                          className="bg-blue-600 h-4 rounded-full"
                          style={{
                            width: '40%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Next Quarter (40%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          {/* Revenue Analysis Report */}
          {reportType === 'revenue' &&
          <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                  <div className="flex items-center">
                    <div className="bg-green-100 dark:bg-green-800 p-3 rounded-full">
                      <TrendingUpIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Revenue
                      </h3>
                      <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        $42,896
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full">
                      <BarChartIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Average Daily Rate
                      </h3>
                      <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        $185
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                  <div className="flex items-center">
                    <div className="bg-purple-100 dark:bg-purple-800 p-3 rounded-full">
                      <PieChartIcon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        RevPAR
                      </h3>
                      <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        $133
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg overflow-hidden mb-6">
                <div className="px-6 py-4 border-b dark:border-gray-600">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    Revenue by Day
                  </h3>
                </div>
                <div className="p-6">
                  <div className="h-64 flex items-end space-x-2">
                    <div className="w-1/7 bg-green-500 h-[45%] rounded-t"></div>
                    <div className="w-1/7 bg-green-500 h-[60%] rounded-t"></div>
                    <div className="w-1/7 bg-green-500 h-[55%] rounded-t"></div>
                    <div className="w-1/7 bg-green-500 h-[70%] rounded-t"></div>
                    <div className="w-1/7 bg-green-500 h-[85%] rounded-t"></div>
                    <div className="w-1/7 bg-green-500 h-[90%] rounded-t"></div>
                    <div className="w-1/7 bg-green-500 h-[75%] rounded-t"></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                    <div>Sun</div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b dark:border-gray-600">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    Revenue Breakdown
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                        <div
                        className="bg-blue-600 h-4 rounded-full"
                        style={{
                          width: '80%'
                        }}>
                      </div>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Room Charges (80%)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                        <div
                        className="bg-green-600 h-4 rounded-full"
                        style={{
                          width: '10%'
                        }}>
                      </div>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Food & Beverage (10%)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                        <div
                        className="bg-purple-600 h-4 rounded-full"
                        style={{
                          width: '5%'
                        }}>
                      </div>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Additional Services (5%)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
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
          }
          {/* Guest Statistics Report */}
          {reportType === 'guests' &&
          <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                  <div className="flex items-center">
                    <div className="bg-purple-100 dark:bg-purple-800 p-3 rounded-full">
                      <PieChartIcon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Guests
                      </h3>
                      <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        248
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full">
                      <BarChartIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        New Guests
                      </h3>
                      <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        87
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                  <div className="flex items-center">
                    <div className="bg-green-100 dark:bg-green-800 p-3 rounded-full">
                      <TrendingUpIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Return Rate
                      </h3>
                      <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        32%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b dark:border-gray-600">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      Guest Demographics
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                          <div
                          className="bg-blue-600 h-4 rounded-full"
                          style={{
                            width: '45%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Business (45%)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                          <div
                          className="bg-green-600 h-4 rounded-full"
                          style={{
                            width: '35%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Leisure (35%)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                          <div
                          className="bg-purple-600 h-4 rounded-full"
                          style={{
                            width: '15%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Family (15%)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
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
                <div className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b dark:border-gray-600">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      Guest Origin
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                          <div
                          className="bg-blue-600 h-4 rounded-full"
                          style={{
                            width: '60%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Domestic (60%)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                          <div
                          className="bg-green-600 h-4 rounded-full"
                          style={{
                            width: '25%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Europe (25%)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                          <div
                          className="bg-purple-600 h-4 rounded-full"
                          style={{
                            width: '10%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Asia (10%)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
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
              <div className="mt-6 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b dark:border-gray-600">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    Average Length of Stay
                  </h3>
                </div>
                <div className="p-6">
                  <div className="h-64 flex items-end space-x-2">
                    <div className="w-1/5 bg-purple-500 h-[80%] rounded-t"></div>
                    <div className="w-1/5 bg-purple-500 h-[60%] rounded-t"></div>
                    <div className="w-1/5 bg-purple-500 h-[30%] rounded-t"></div>
                    <div className="w-1/5 bg-purple-500 h-[20%] rounded-t"></div>
                    <div className="w-1/5 bg-purple-500 h-[10%] rounded-t"></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <div>1-2 nights</div>
                    <div>3-4 nights</div>
                    <div>5-7 nights</div>
                    <div>8-14 nights</div>
                    <div>15+ nights</div>
                  </div>
                </div>
              </div>
            </div>
          }
          {/* Housekeeping Report */}
          {reportType === 'housekeeping' &&
          <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                  <div className="flex items-center">
                    <div className="bg-green-100 dark:bg-green-800 p-3 rounded-full">
                      <PieChartIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Clean Rooms
                      </h3>
                      <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        32
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                  <div className="flex items-center">
                    <div className="bg-amber-100 dark:bg-amber-800 p-3 rounded-full">
                      <BarChartIcon className="h-6 w-6 text-amber-600 dark:text-amber-300" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Pending Cleaning
                      </h3>
                      <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        12
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                  <div className="flex items-center">
                    <div className="bg-red-100 dark:bg-red-800 p-3 rounded-full">
                      <FilterIcon className="h-6 w-6 text-red-600 dark:text-red-300" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Maintenance Issues
                      </h3>
                      <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        5
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b dark:border-gray-600">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    Housekeeping Efficiency
                  </h3>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 bg-gray-50 dark:bg-gray-600 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Staff Member
                          </th>
                          <th className="px-4 py-3 bg-gray-50 dark:bg-gray-600 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Rooms Cleaned
                          </th>
                          <th className="px-4 py-3 bg-gray-50 dark:bg-gray-600 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Avg. Time per Room
                          </th>
                          <th className="px-4 py-3 bg-gray-50 dark:bg-gray-600 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Quality Score
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                        <tr>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            Maria Rodriguez
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            18
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            22 min
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                                <div
                                className="bg-green-600 h-2.5 rounded-full"
                                style={{
                                  width: '95%'
                                }}>
                              </div>
                              </div>
                              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                95%
                              </span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            John Davis
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            15
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            25 min
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                                <div
                                className="bg-green-600 h-2.5 rounded-full"
                                style={{
                                  width: '90%'
                                }}>
                              </div>
                              </div>
                              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                90%
                              </span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            Sarah Johnson
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            12
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            28 min
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                                <div
                                className="bg-green-600 h-2.5 rounded-full"
                                style={{
                                  width: '88%'
                                }}>
                              </div>
                              </div>
                              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                88%
                              </span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b dark:border-gray-600">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      Maintenance Requests
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-600 rounded-md">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              Room 202 - AC not working
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Reported: June 12, 2023
                            </p>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200">
                            In Progress
                          </span>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-600 rounded-md">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              Room 305 - Leaking faucet
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Reported: June 13, 2023
                            </p>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200">
                            In Progress
                          </span>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-600 rounded-md">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              Room 118 - TV remote missing
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Reported: June 14, 2023
                            </p>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200">
                            Pending
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b dark:border-gray-600">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      Inventory Status
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                          <div
                          className="bg-green-600 h-4 rounded-full"
                          style={{
                            width: '85%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Towels (85%)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                          <div
                          className="bg-yellow-600 h-4 rounded-full"
                          style={{
                            width: '40%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Toiletries (40%)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                          <div
                          className="bg-red-600 h-4 rounded-full"
                          style={{
                            width: '15%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Bed Sheets (15%)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                          <div
                          className="bg-green-600 h-4 rounded-full"
                          style={{
                            width: '70%'
                          }}>
                        </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Cleaning Supplies (70%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>);

};
export default Reports;