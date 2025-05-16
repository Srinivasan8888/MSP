import React, { Fragment, useState, useRef } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpIcon, ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import ReportDropdown from '../../Components/Dashboard/ReportDropdown'
import { DashboardProvider, useParameter } from '../../Context/DashboardContext'
import * as XLSX from 'xlsx'

const ReportContent = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const startDateInputRef = useRef(null)
  const endDateInputRef = useRef(null)
  const [selectedParameter, setSelectedParameter] = useState({ id: 'all', name: 'All' })

  const handleDateChange = (e) => {
    const { name, value } = e.target
    if (name === 'startdate') {
      setStartDate(value)
    } else if (name === 'enddate') {
      setEndDate(value)
    }
  }

  const handleParameterChange = (parameter) => {
    setSelectedParameter(parameter)
  }

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates')
      return
    }

    setLoading(true)
    setError(null)

    try {
      let response;
      const headers = {};
      const id = localStorage.getItem('id');
      if (!id) {
        throw new Error('User ID is required in headers');
      }
      if(id){
        headers["x-user-id"] = id;
      }
      if (selectedParameter.id === 'all') {
        response = await fetch(
          `http://localhost:4000/api/v2/allgetChart?startdate=${startDate}&enddate=${endDate}`,
          {
            headers
          }
        )
      } else {
        response = await fetch(
          `http://localhost:4000/api/v2/getChart?parameter=${selectedParameter.id}&startdate=${startDate}&enddate=${endDate}`,
          {
            headers
          }
        )
      }

      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const data = await response.json()
      
      if (!data.chartData) {
        throw new Error('No data available for the selected date range')
      }

      // Prepare data for Excel
      let excelData = []
      
      if (selectedParameter.id === 'all') {
        // For "All" selection, create a row for each timestamp with all parameters
        const times = data.chartData.time
        excelData = times.map((time, index) => {
          const row = { Time: time }
          Object.keys(data.chartData).forEach(key => {
            if (key !== 'time') {
              row[key.charAt(0).toUpperCase() + key.slice(1)] = data.chartData[key][index]
            }
          })
          return row
        })
      } else {
        // For single parameter selection
        excelData = data.chartData.time.map((time, index) => ({
          Time: time,
          [selectedParameter.name]: data.chartData[selectedParameter.id][index]
        }))
      }

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData)
      
      // Create workbook
      const wb = XLSX.utils.book_new()
      const sheetName = selectedParameter.id === 'all' ? 'All Parameters' : selectedParameter.name
      XLSX.utils.book_append_sheet(wb, ws, sheetName)

      // Generate Excel file
      XLSX.writeFile(wb, `${selectedParameter.id}_data_${startDate}_to_${endDate}.xlsx`)

    } catch (err) {
      setError(err.message)
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const pdfSubmit = (data) => {
    // Add your PDF download logic here
    console.log('Downloading PDF with data:', data)
  }

  return (
    <div className="min-h-screen bg-[rgba(17,25,67,1)] p-4 md:p-8 flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-12 lg:px-16 lg:py-12 ">
      <div className="max-w-4xl mx-auto border border-gray-400 rounded-xl">
        <div className="bg-[#1a1f3c] rounded-xl shadow-2xl p-6 md:p-8 " >
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">
              Reports Page 📝
            </h1>
            <p className="text-gray-400">
              Select from two different dates!
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center">
              <ReportDropdown onParameterChange={handleParameterChange} />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

            {error && (
              <div className="text-sm text-center text-red-500">
                {error}
              </div>
            )}

            <div className="flex flex-col justify-center gap-4 mt-8 sm:flex-row">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a1f3c] ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Downloading...' : 'Download The Excel'}
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

const Report = () => {
  return (
    <DashboardProvider>
      <ReportContent />
    </DashboardProvider>
  )
}

export default Report