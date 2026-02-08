import React, { useState, Children } from 'react';
import {
  CalendarIcon,
  UsersIcon,
  BedIcon,
  CreditCardIcon,
  CheckIcon,
  PlusIcon } from
'lucide-react';
const BookingForm = () => {
  const [step, setStep] = useState(1);
  // Form states
  const [formData, setFormData] = useState({
    // Guest Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idType: 'passport',
    idNumber: '',
    // Booking Details
    checkInDate: '',
    checkOutDate: '',
    adults: 1,
    children: 0,
    roomType: 'Standard',
    roomNumber: '',
    // Additional Services
    breakfast: false,
    parking: false,
    extraBed: false,
    // Special Requests
    specialRequests: '',
    // Payment
    paymentMethod: 'creditCard',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  const nextStep = () => {
    setStep(step + 1);
  };
  const prevStep = () => {
    setStep(step - 1);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Process booking submission
    alert('Booking submitted successfully!');
    // Reset form or redirect
  };
  // Room type options
  const roomTypes = [
  {
    id: 'standard',
    name: 'Standard',
    price: 99,
    description: 'Comfortable room with basic amenities'
  },
  {
    id: 'deluxe',
    name: 'Deluxe',
    price: 149,
    description: 'Spacious room with premium amenities'
  },
  {
    id: 'suite',
    name: 'Suite',
    price: 249,
    description: 'Luxury suite with separate living area'
  },
  {
    id: 'executive',
    name: 'Executive',
    price: 299,
    description: 'Premium suite with business facilities'
  }];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            New Booking
          </h2>
        </div>
        {/* Progress Steps */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div
              className={`flex flex-col items-center ${step >= 1 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>

              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'}`}>

                <UsersIcon className="h-4 w-4" />
              </div>
              <div className="text-xs mt-1">Guest Info</div>
            </div>
            <div
              className={`flex-1 h-0.5 ${step >= 2 ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'}`}>
            </div>
            <div
              className={`flex flex-col items-center ${step >= 2 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>

              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'}`}>

                <BedIcon className="h-4 w-4" />
              </div>
              <div className="text-xs mt-1">Room Details</div>
            </div>
            <div
              className={`flex-1 h-0.5 ${step >= 3 ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'}`}>
            </div>
            <div
              className={`flex flex-col items-center ${step >= 3 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>

              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'}`}>

                <PlusIcon className="h-4 w-4" />
              </div>
              <div className="text-xs mt-1">Extras</div>
            </div>
            <div
              className={`flex-1 h-0.5 ${step >= 4 ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'}`}>
            </div>
            <div
              className={`flex flex-col items-center ${step >= 4 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>

              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 4 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'}`}>

                <CreditCardIcon className="h-4 w-4" />
              </div>
              <div className="text-xs mt-1">Payment</div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Step 1: Guest Information */}
            {step === 1 &&
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Guest Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ID Type
                    </label>
                    <select
                    name="idType"
                    value={formData.idType}
                    onChange={handleChange}
                    className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">

                      <option value="passport">Passport</option>
                      <option value="drivingLicense">Driving License</option>
                      <option value="nationalId">National ID</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ID Number
                    </label>
                    <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required />

                  </div>
                </div>
              </div>
            }
            {/* Step 2: Booking Details */}
            {step === 2 &&
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Booking Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Check-In Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                      type="date"
                      name="checkInDate"
                      value={formData.checkInDate}
                      onChange={handleChange}
                      className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required />

                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Check-Out Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                      type="date"
                      name="checkOutDate"
                      value={formData.checkOutDate}
                      onChange={handleChange}
                      className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required />

                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Adults
                    </label>
                    <input
                    type="number"
                    name="adults"
                    value={formData.adults}
                    onChange={handleChange}
                    min="1"
                    className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Children
                    </label>
                    <input
                    type="number"
                    name="children"
                    value={formData.children}
                    onChange={handleChange}
                    min="0"
                    className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />

                  </div>
                </div>
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mt-6">
                  Room Selection
                </h4>
                <div className="space-y-4">
                  {roomTypes.map((room) =>
                <div
                  key={room.id}
                  className={`border rounded-md p-4 cursor-pointer ${formData.roomType === room.name ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' : 'border-gray-200 dark:border-gray-600'}`}
                  onClick={() =>
                  setFormData({
                    ...formData,
                    roomType: room.name
                  })
                  }>

                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium text-gray-800 dark:text-gray-200">
                            {room.name}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {room.description}
                          </p>
                        </div>
                        <div>
                          <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                            ${room.price}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            /night
                          </span>
                          {formData.roomType === room.name &&
                      <CheckIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 ml-2 inline-block" />
                      }
                        </div>
                      </div>
                    </div>
                )}
                </div>
              </div>
            }
            {/* Step 3: Additional Services */}
            {step === 3 &&
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Additional Services & Requests
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                    id="breakfast"
                    name="breakfast"
                    type="checkbox"
                    checked={formData.breakfast}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded" />

                    <label
                    htmlFor="breakfast"
                    className="ml-3 text-sm text-gray-700 dark:text-gray-300">

                      Breakfast ($15 per person per day)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                    id="parking"
                    name="parking"
                    type="checkbox"
                    checked={formData.parking}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded" />

                    <label
                    htmlFor="parking"
                    className="ml-3 text-sm text-gray-700 dark:text-gray-300">

                      Parking ($20 per day)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                    id="extraBed"
                    name="extraBed"
                    type="checkbox"
                    checked={formData.extraBed}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded" />

                    <label
                    htmlFor="extraBed"
                    className="ml-3 text-sm text-gray-700 dark:text-gray-300">

                      Extra Bed ($30 per night)
                    </label>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Special Requests
                  </label>
                  <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Any special requests or preferences...">
                </textarea>
                </div>
              </div>
            }
            {/* Step 4: Payment */}
            {step === 4 &&
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Payment Details
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-4">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Booking Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Room ({formData.roomType})
                      </span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        $
                        {roomTypes.find((r) => r.name === formData.roomType)?.
                      price || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Number of nights
                      </span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        3
                      </span>
                    </div>
                    {formData.breakfast &&
                  <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Breakfast
                        </span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          $45
                        </span>
                      </div>
                  }
                    {formData.parking &&
                  <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Parking
                        </span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          $60
                        </span>
                      </div>
                  }
                    {formData.extraBed &&
                  <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Extra Bed
                        </span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          $90
                        </span>
                      </div>
                  }
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Taxes & Fees
                      </span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        $42
                      </span>
                    </div>
                    <div className="border-t dark:border-gray-600 pt-2 mt-2 flex justify-between">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        Total
                      </span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">
                        $534
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                        id="creditCard"
                        name="paymentMethod"
                        type="radio"
                        value="creditCard"
                        checked={formData.paymentMethod === 'creditCard'}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" />

                        <label
                        htmlFor="creditCard"
                        className="ml-3 text-sm text-gray-700 dark:text-gray-300">

                          Credit Card
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                        id="debitCard"
                        name="paymentMethod"
                        type="radio"
                        value="debitCard"
                        checked={formData.paymentMethod === 'debitCard'}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" />

                        <label
                        htmlFor="debitCard"
                        className="ml-3 text-sm text-gray-700 dark:text-gray-300">

                          Debit Card
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                        id="payAtHotel"
                        name="paymentMethod"
                        type="radio"
                        value="payAtHotel"
                        checked={formData.paymentMethod === 'payAtHotel'}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" />

                        <label
                        htmlFor="payAtHotel"
                        className="ml-3 text-sm text-gray-700 dark:text-gray-300">

                          Pay at Hotel
                        </label>
                      </div>
                    </div>
                  </div>
                  {(formData.paymentMethod === 'creditCard' ||
                formData.paymentMethod === 'debitCard') &&
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Card Number
                        </label>
                        <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Card Holder
                        </label>
                        <input
                      type="text"
                      name="cardHolder"
                      value={formData.cardHolder}
                      onChange={handleChange}
                      placeholder="John Smith"
                      className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />

                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Expiry Date
                          </label>
                          <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />

                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            CVV
                          </label>
                          <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />

                        </div>
                      </div>
                    </div>
                }
                </div>
              </div>
            }
            <div className="mt-6 flex justify-between">
              {step > 1 &&
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">

                  Previous
                </button>
              }
              <div></div>
              {step < 4 ?
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">

                  Next
                </button> :

              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">

                  Complete Booking
                </button>
              }
            </div>
          </div>
        </form>
      </div>
    </div>);

};
export default BookingForm;