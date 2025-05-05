import React, { Fragment, useState, useRef } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpIcon, ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import Dropdown from '../../Components/Dashboard/Dropdown'

const Report = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const startDateInputRef = useRef(null)
  const endDateInputRef = useRef(null)

  const handleDateChange = (e) => {
    const { name, value } = e.target
    if (name === 'startdate') {
      setStartDate(value)
    } else if (name === 'enddate') {
      setEndDate(value)
    }
  }

  const handleSubmit = () => {
    // Add your Excel download logic here
    console.log('Downloading Excel with dates:', { startDate, endDate })
  }

  const pdfSubmit = (data) => {
    // Add your PDF download logic here
    console.log('Downloading PDF with data:', data)
  }

  return (
    <div className="min-h-screen bg-[rgba(17,25,67,1)] p-4 md:p-8 flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-12 lg:px-16 lg:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1a1f3c] rounded-xl shadow-2xl p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Reports Page 📝
            </h1>
            <p className="text-gray-400">
              Select from two different dates!
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center">
              <Dropdown />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="StartDate"
                  className="block text-sm font-medium text-gray-300"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startdate"
                  name="startdate"
                  onChange={handleDateChange}
                  value={startDate}
                  className="w-full rounded-lg bg-[#2a2f4c] border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ref={startDateInputRef}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="EndDate"
                  className="block text-sm font-medium text-gray-300"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="enddate"
                  name="enddate"
                  onChange={handleDateChange}
                  value={endDate}
                  className="w-full rounded-lg bg-[#2a2f4c] border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ref={endDateInputRef}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a1f3c]"
              >
                Download The Excel
              </button>

              {/* <button
                onClick={() => pdfSubmit([])}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a1f3c]"
              >
                Download The PDF
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Report