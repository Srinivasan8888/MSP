import React, { useState, useEffect, useRef } from "react";
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
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Switch } from "@headlessui/react";
import { DashboardProvider, useParameter } from "../../Context/DashboardContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartContent = () => {
  const [enabled, setEnabled] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { selectedParameter } = useParameter();
  const previousDataRef = useRef(null);
  const chartRef = useRef(null);
  const dataPointCountRef = useRef(0);

  const updateDataPointCount = (count) => {
    dataPointCountRef.current = count;
    const countElement = document.getElementById('data-point-count');
    if (countElement) {
      countElement.textContent = count;
    }
  };

  const fetchChartData = async (parameter, start, end) => {
    try {
      setLoading(true);
      setError(null);
      
      const formatDate = (date) => {
        return date.toISOString().split('T')[0];
      };

      const response = await fetch(
        `http://localhost:4000/api/v2/getChart?parameter=${parameter}&startdate=${formatDate(start)}&enddate=${formatDate(end)}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch chart data');
      }
      
      const data = await response.json();
      
      if (!data.chartData || data.chartData[parameter].length === 0) {
        setError('No data available for the selected date range');
        setChartData(null);
      } else {
        setChartData(data.chartData);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching chart data:', err);
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveData = async (parameter) => {
    try {
      setError(null);

      const response = await fetch(
        `http://localhost:4000/api/v2/getLiveChart?parameter=${parameter}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch live data');
      }
      
      const data = await response.json();
      
      if (!data.chartData || data.chartData[parameter].length === 0) {
        setError('No live data available');
        return;
      }

      // Check if we have previous data
      if (previousDataRef.current) {
        // Get the last timestamp from previous data
        const lastTimestamp = previousDataRef.current.time[previousDataRef.current.time.length - 1];
        
        // Find new data points (those with timestamps after our last known timestamp)
        const newDataPoints = [];
        const newTimePoints = [];
        
        data.chartData.time.forEach((time, index) => {
          if (new Date(time) > new Date(lastTimestamp)) {
            newDataPoints.push(data.chartData[parameter][index]);
            newTimePoints.push(time);
          }
        });

        if (newDataPoints.length > 0) {
          // Append only new data points
          const newData = {
            [parameter]: [...previousDataRef.current[parameter], ...newDataPoints],
            time: [...previousDataRef.current.time, ...newTimePoints]
          };
          
          // Keep only the last 100 data points
          if (newData[parameter].length > 100) {
            newData[parameter] = newData[parameter].slice(-100);
            newData.time = newData.time.slice(-100);
          }
          
          // Update chart directly using chartRef
          if (chartRef.current) {
            const chart = chartRef.current;
            chart.data.labels = newData.time;
            chart.data.datasets[0].data = newData[parameter];
            chart.update('none'); // Update without animation
          }
          
          // Update data point count
          updateDataPointCount(newData[parameter].length);
          
          previousDataRef.current = newData;
        }
      } else {
        // First time data
        const initialData = {
          [parameter]: data.chartData[parameter],
          time: data.chartData.time
        };
        setChartData(initialData);
        previousDataRef.current = initialData;
        updateDataPointCount(initialData[parameter].length);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching live data:', err);
    }
  };

  // Effect for live data updates
  useEffect(() => {
    let intervalId;

    if (enabled) {
      // Reset previous data when switching to live mode
      previousDataRef.current = null;
      setChartData(null); // Clear existing chart data
      // Initial fetch
      fetchLiveData(selectedParameter);
      
      // Set up interval for live updates
      intervalId = setInterval(() => {
        fetchLiveData(selectedParameter);
      }, 1000); // Update every second
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [enabled, selectedParameter]);

  const handleSubmit = () => {
    if (!enabled) {
      fetchChartData(selectedParameter, startDate, endDate);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0 // Disable animations for live updates
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
        },
      },
      title: {
        display: true,
        text: "Parameter Chart",
        color: "white",
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
      },
    },
  };

  const getDataPointCount = () => {
    if (!chartData || !chartData[selectedParameter]) return 0;
    return chartData[selectedParameter].length;
  };

  return (
    <div className="h-screen bg-[rgba(17,25,67,1)] p-4">
      <div className="xl:h-[95%] flex flex-col">
        <div className="flex items-center justify-evenly gap-4 p-4 border rounded-2xl border-gray-400 ">
          <div className="w-56">
            <label className="text-white text-sm mb-1 ">Select Parameter</label>
            <Dropdown />
          </div>

          <div>
            <label className="text-white text-sm mb-1">
              Live Data / Date Filter Toggle
            </label>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-white text-xs">Date Filter</span>
                <Switch
                  checked={enabled}
                  onChange={setEnabled}
                  className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-white/10 data-focus:outline data-focus:outline-white"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7"
                  />
                </Switch>
                <span className="text-white text-xs">Live Data</span>
              </div>
            </div>
          </div>
          {!enabled && (
            <>
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
            disabled={enabled}
            className={`mt-6 px-4 py-2 rounded transition-colors ${
              enabled 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            Submit
          </button> </>
          )}

          <div className='text-white text-center'>
            Total Data Points: <span id="data-point-count" className="font-semibold">{dataPointCountRef.current}</span>
          </div>
        </div>
        <div className="flex-1 p-4 bg-white/5 rounded-lg m-4 border border-gray-400">
          <div className="h-[92%] w-full">
            {loading ? (
              <div className="text-white text-center">Loading...</div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : chartData ? (
              <Line
                ref={chartRef}
                data={{
                  labels: chartData.time,
                  datasets: [
                    {
                      label: Object.keys(chartData)[0].charAt(0).toUpperCase() + 
                             Object.keys(chartData)[0].slice(1),
                      data: chartData[Object.keys(chartData)[0]],
                      borderColor: "rgb(75, 192, 192)",
                      backgroundColor: "rgba(75, 192, 192, 0.5)",
                      tension: 0.4,
                    },
                  ],
                }}
                options={options}
              />
            ) : (
              <div className="text-white text-center">Select a date range and parameter to view data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Chart = () => {
  return (
    <DashboardProvider>
      <ChartContent />
    </DashboardProvider>
  );
};

export default Chart;
