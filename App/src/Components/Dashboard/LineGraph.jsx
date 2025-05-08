import React, { memo, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useDashboard, useParameter } from '../../Context/DashboardContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineGraph = memo(() => {
  const { dashboardData, loading } = useDashboard();
  const { selectedParameter } = useParameter();

  const chartData = useMemo(() => {
    if (loading || !dashboardData || !selectedParameter) return null;

    const { chartData } = dashboardData;
    if (!chartData || !chartData[selectedParameter]) return null;

    return {
      labels: chartData.time,
      datasets: [
        {
          label: selectedParameter.charAt(0).toUpperCase() + selectedParameter.slice(1),
          data: chartData[selectedParameter],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.4,
        },
      ],
    };
  }, [dashboardData, loading, selectedParameter]);

  const options = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white'
        }
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  }), []);

  if (loading || !dashboardData || !chartData || !selectedParameter) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="w-full h-full p-4">
      <Line data={chartData} options={options} />
    </div>
  );
});

LineGraph.displayName = 'LineGraph';

export default LineGraph; 