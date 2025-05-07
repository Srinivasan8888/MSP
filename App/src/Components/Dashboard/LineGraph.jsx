import React, { memo, useEffect } from 'react';
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
import { useLineGraph } from '../../Context/LineGraphContext';

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
  const { lineGraphData, loading, selectedParameter, fetchLineGraphData } = useLineGraph();

  useEffect(() => {
    fetchLineGraphData(selectedParameter);
    const interval = setInterval(() => {
      fetchLineGraphData(selectedParameter);
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedParameter, fetchLineGraphData]);

  if (loading || !lineGraphData) {
    return <div className="text-white">Loading...</div>;
  }

  const { chartData } = lineGraphData;
  const data = {
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

  const options = {
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
  };

  return (
    <div className="w-full h-full p-4">
      <Line data={data} options={options} />
    </div>
  );
});

LineGraph.displayName = 'LineGraph';

export default LineGraph; 