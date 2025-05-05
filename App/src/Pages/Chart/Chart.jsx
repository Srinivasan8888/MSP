import React, { useState } from "react";
import Dropdown from "../../Components/Dashboard/Dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleSubmit = () => {
    // Handle date range submission here
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
  };

  // Sample data for the chart
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Dataset 2',
        data: [28, 48, 40, 19, 86, 27],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
        },
      },
      title: {
        display: true,
        text: 'Chart Title',
        color: 'white',
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'white',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'white',
        },
      },
    },
  };

  return (
    <div className="h-screen bg-[rgba(17,25,67,1)]">
      <div className="xl:h-full flex flex-col">
        <div className="flex items-center justify-evenly gap-4 p-4">
         
            <div className="mt-5">
             
              <Dropdown />
            </div>
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="px-3 py-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="px-3 py-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          
        </div>
        <div className="flex-1 p-4 bg-white/5 rounded-lg m-4">
          <div className="h-[94%] w-full">
            <Line data={chartData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;
