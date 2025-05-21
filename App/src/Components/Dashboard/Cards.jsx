import React, { useEffect, useRef, memo, useMemo, useCallback } from "react";
import Chart from "chart.js/auto";
import {
  Activity,
  Gauge,
  Radio,
  Volume2,
  Thermometer,
  Droplet,
  Wind,
  Mountain,
  Airplay,
  Signal,
} from "lucide-react";
import { useDashboard } from "../../Context/DashboardContext";

const chartOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  elements: {
    point: { radius: 0 },
    line: {
      tension: 0.4,
      cubicInterpolationMode: "monotone",
    },
  },
  scales: {
    x: { display: false },
    y: {
      display: false,
      suggestedMin: 0,
      suggestedMax: 10,
    },
  },
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart'
  }
};

const Card = memo(({
  title,
  value,
  unit,
  change,
  chartData,
  borderColor,
  backgroundColor,
  icon,
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const isMounted = useRef(true);
  const prevDataRef = useRef(chartData);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current || !isMounted.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    try {
      if (!chartInstance.current) {
        // Initial chart creation
        const gradient = ctx.createLinearGradient(0, 0, 0, 70);
        gradient.addColorStop(0, borderColor.replace(/[^,]+(?=\))/, "0.3"));
        gradient.addColorStop(1, borderColor.replace(/[^,]+(?=\))/, "0.0"));

        chartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: chartData.labels,
            datasets: [
              {
                label: title,
                backgroundColor: gradient,
                borderColor,
                borderWidth: 2,
                data: chartData.data,
                fill: true,
              },
            ],
          },
          options: chartOptions,
        });
      } else if (JSON.stringify(prevDataRef.current) !== JSON.stringify(chartData)) {
        // Update existing chart with new data
        chartInstance.current.data.labels = chartData.labels;
        chartInstance.current.data.datasets[0].data = chartData.data;
        chartInstance.current.update('none'); // Update without animation first
        chartInstance.current.update(); // Then update with animation
        prevDataRef.current = chartData;
      }
    } catch (error) {
      console.error('Chart error:', error);
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    }
  }, [title, chartData, borderColor]);

  return (
    <div className="w-full px-2 mb-4">
      <div className="rounded-lg bg-[#102d49] shadow-lg md:shadow-xl relative overflow-hidden lg:h-[120px] xl:h-24 2xl:h-28">
        <div className="relative z-10 px-3 pt-8 pb-10 text-center xl:pt-3">
          <p className="flex items-center justify-center gap-1 text-xs font-thin text-white 2xl:text-sm xl:uppercase">
            {title} <span className="lowercase">({unit})</span>
          </p>
          <h3 className="my-3 font-semibold leading-tight text-white xl:text-base 2xl:text-3xl">
            {icon && <span className="inline-block w-6 h-6">{icon}</span>}{" "}
            {typeof value === "number" ? value.toFixed(1) : value}
          </h3>
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <canvas ref={chartRef} height="70"></canvas>
        </div>
      </div>
    </div>
  );
});

Card.displayName = 'Card';

const Cards = memo(() => {
  const { dashboardData, loading } = useDashboard();

  const convertToIST = useCallback((utcDate) => {
    const date = new Date(utcDate);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }, []);

  const cardData = useMemo(() => {
    if (loading || !dashboardData) return null;
    return dashboardData.cardData;
  }, [dashboardData, loading]);

  const getLatestValue = useCallback((data) => data[0], []);
  
  const getChange = useCallback((data) => {
    const latest = data[0];
    const previous = data[1];
    const change = ((latest - previous) / previous) * 100;
    return {
      text: `${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(1)}%`,
      color: change >= 0 ? 'text-green-500' : 'text-red-500'
    };
  }, []);

  const cardsData = useMemo(() => {
    if (!cardData) return [];
    
    return [
      {
        title: "Vibration",
        unit: "mm/s",
        value: getLatestValue(cardData.vibration),
        icon: <Activity size={24} />,
        chartData: {
          labels: cardData.time,
          data: cardData.vibration,
        },
        borderColor: "rgba(101, 116, 205, 0.8)",
        backgroundColor: "rgba(101, 116, 205, 0.1)",
        change: getChange(cardData.vibration),
      },
      {
        title: "Magneticflux",
        unit: "Gauss",
        value: getLatestValue(cardData.magneticflux),
        icon: <Gauge size={24} />,
        chartData: {
          labels: cardData.time,
          data: cardData.magneticflux,
        },
        borderColor: "rgba(246, 109, 155, 0.8)",
        backgroundColor: "rgba(246, 109, 155, 0.1)",
        change: getChange(cardData.magneticflux),
      },
      {
        title: "RPM",
        unit: "RPM",
        value: getLatestValue(cardData.rpm),
        icon: <Radio size={24} />,
        chartData: {
          labels: cardData.time,
          data: cardData.rpm,
        },
        borderColor: "rgba(246, 153, 63, 0.8)",
        backgroundColor: "rgba(246, 153, 63, 0.1)",
        change: getChange(cardData.rpm),
      },
      {
        title: "Acoustics",
        unit: "dB",
        value: getLatestValue(cardData.acoustics),
        icon: <Volume2 size={24} />,
        chartData: {
          labels: cardData.time,
          data: cardData.acoustics,
        },
        borderColor: "rgba(75, 192, 192, 0.8)",
        backgroundColor: "rgba(75, 192, 192, 0.1)",
        change: getChange(cardData.acoustics),
      },
      {
        title: "Temperature",
        unit: "°C",
        value: getLatestValue(cardData.temperature),
        icon: <Thermometer size={24} />,
        chartData: {
          labels: cardData.time,
          data: cardData.temperature,
        },
        borderColor: "rgba(255, 99, 132, 0.8)",
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        change: getChange(cardData.temperature),
      },
      {
        title: "Humidity",
        unit: "% r.H.",
        value: getLatestValue(cardData.humidity),
        icon: <Droplet size={24} />,
        chartData: {
          labels: cardData.time,
          data: cardData.humidity,
        },
        borderColor: "rgba(54, 162, 235, 0.8)",
        backgroundColor: "rgba(54, 162, 235, 0.1)",
        change: getChange(cardData.humidity),
      },
      {
        title: "Pressure",
        unit: "hPa",
        value: getLatestValue(cardData.pressure),
        icon: <Wind size={24} />,
        chartData: {
          labels: cardData.time,
          data: cardData.pressure,
        },
        borderColor: "rgba(153, 102, 255, 0.8)",
        backgroundColor: "rgba(153, 102, 255, 0.1)",
        change: getChange(cardData.pressure),
      },
      {
        title: "Altitude",
        unit: "m",
        value: getLatestValue(cardData.altitude),
        icon: <Mountain size={24} />,
        chartData: {
          labels: cardData.time,
          data: cardData.altitude,
        },
        borderColor: "rgba(255, 206, 86, 0.8)",
        backgroundColor: "rgba(255, 206, 86, 0.1)",
        change: getChange(cardData.altitude),
      },
      {
        title: "Air Quality",
        unit: "ppm",
        value: getLatestValue(cardData.airquality),
        icon: <Airplay size={24} />,
        chartData: {
          labels: cardData.time,
          data: cardData.airquality,
        },
        borderColor: "rgba(199, 199, 86, 0.8)",
        backgroundColor: "rgba(199, 199, 86, 0.1)",
        change: getChange(cardData.airquality),
      },
      {
        title: "Signal",
        unit: "dBm",
        value: getLatestValue(cardData.signal),
        icon: <Signal size={24} />,
        chartData: {
          labels: cardData.time,
          data: cardData.signal,
        },
        borderColor: "rgba(246, 109, 155, 0.8)",
        backgroundColor: "rgba(246, 109, 155, 0.1)",
        change: getChange(cardData.signal),
      },
    ];
  }, [cardData, getLatestValue, getChange]);

  if (loading || !dashboardData || !cardData) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="-mx-2 lg:flex lg:flex-wrap md:grid md:grid-cols-2">
      {cardsData.map((card, index) => (
        <div key={index} className="w-full px-2 xl:w-1/6">
          <Card {...card} />
        </div>
      ))}

      <div className="w-full xl:w-1/6 px-3 mb-4 h-[152px] lg:h-[120px] xl:h-[90px] 2xl:h-28">
        <div className="rounded-lg bg-[#102d49] shadow-lg md:shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
          <div className="relative z-10 px-3 pt-8 pb-10 text-center xl:pt-3">
            <h4 className="flex items-center justify-center gap-1 text-xs font-thin text-white 2xl:text-sm xl:uppercase">
              Battery
            </h4>
            <div className="w-48 my-3 ml-28 lg:ml-0 2xl:ml-6">
              <div className="relative flex w-1/2 my-1 border-2 border-gray-400 rounded shadow">
                <div className="absolute z-10 flex h-6 mt-2 ml-24 border-r-8 border-gray-400 rounded-r" />
                <div
                  className="flex items-center justify-center py-4 m-1 text-xs font-bold leading-none text-center text-white bg-green-400 cursor-default"
                  style={{ width: `${getLatestValue(cardData.battery)}%` }}
                >
                  <div className="absolute left-0 mx-8 text-gray-700">
                    {getLatestValue(cardData.battery)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full xl:w-1/6 px-3 mb-4 h-[152px] lg:h-[120px] xl:h-[90px] 2xl:h-28">
        <div className="rounded-lg bg-[#102d49] shadow-lg md:shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
          <div className="relative z-10 px-3 pt-8 pb-10 text-center xl:pt-3">
            <p className="flex items-center justify-center gap-1 text-xs font-thin text-white 2xl:text-sm xl:uppercase">
              System Status
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-sm text-white xl:text-sm">Online</span>
            </div>
            <p className="mt-1 text-base text-white xl:text-sm">
              {convertToIST(getLatestValue(cardData.time))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

Cards.displayName = 'Cards';

export default Cards;
