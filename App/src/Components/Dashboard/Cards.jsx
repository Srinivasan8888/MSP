import React, { useEffect, useRef } from "react";
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
};

const Card = ({
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

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      const gradient = ctx.createLinearGradient(0, 0, 0, 70);
      gradient.addColorStop(0, borderColor.replace(/[^,]+(?=\))/, "0.3")); // 30% opacity
      gradient.addColorStop(1, borderColor.replace(/[^,]+(?=\))/, "0.0")); // 0% opacity

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
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [title, chartData, borderColor]);

  return (
    <div className="w-full px-2 mb-4">
      <div className="rounded-lg bg-[#102d49] shadow-lg md:shadow-xl relative overflow-hidden lg:h-[120px] xl:h-24 2xl:h-28">
        <div className="px-3 xl:pt-3 pt-8 pb-10 text-center relative z-10">
          <p className="text-xs font-thin 2xl:text-sm xl:uppercase text-white flex items-center justify-center gap-1  ">
            {title} <span className="lowercase">({unit})</span>
          </p>
          <h3 className="xl:text-base 2xl:text-3xl text-white font-semibold leading-tight my-3 ">
            {icon && <span className="inline-block w-6 h-6 ">{icon}</span>}{" "}
            {typeof value === "number" ? value.toFixed(1) : value}
          </h3>
          {/* <p className={`text-xs ${change.color} leading-tight`}>
            {change.text}
          </p> */}
        </div> 
        <div className="absolute bottom-0 inset-x-0">
          <canvas ref={chartRef} height="70"></canvas>
        </div>
      </div>
    </div>
  );
};

const Cards = () => {
  const cardsData = [
    {
      title: "Vibration",
      unit: "mm/s",
      value: Math.random() * 5,
      icon: <Activity size={24} />,
      chartData: {
        labels: Array.from({ length: 8 }, (_, i) => i + 1),
        data: Array.from({ length: 8 }, () => (Math.random() * 5).toFixed(2)),
      },
      borderColor: "rgba(101, 116, 205, 0.8)",
      backgroundColor: "rgba(101, 116, 205, 0.1)",
      change: {
        text: `▲ ${(Math.random() * 5 + 1).toFixed(1)}%`,
        color: "text-green-500",
      },
    },
    {
      title: "Magneticflux",
      unit: "Gauss",
      value: Math.floor(Math.random() * 1000),
      icon: <Gauge size={24} />,
      chartData: {
        labels: Array.from({ length: 8 }, (_, i) => i + 1),
        data: Array.from({ length: 8 }, () => Math.floor(Math.random() * 1000)),
      },
      borderColor: "rgba(246, 109, 155, 0.8)",
      backgroundColor: "rgba(246, 109, 155, 0.1)",
      change: {
        text: `▼ ${(Math.random() * 5 + 1).toFixed(1)}%`,
        color: "text-red-500",
      },
    },
    {
      title: "RPM",
      unit: "RPM",
      value: Math.floor(Math.random() * 3000 + 500),
      icon: <Radio size={24} />,
      chartData: {
        labels: Array.from({ length: 8 }, (_, i) => i + 1),
        data: Array.from({ length: 8 }, () =>
          Math.floor(Math.random() * 3000 + 500)
        ),
      },
      borderColor: "rgba(246, 153, 63, 0.8)",
      backgroundColor: "rgba(246, 153, 63, 0.1)",
      change: {
        text: `▲ ${(Math.random() * 5 + 1).toFixed(1)}%`,
        color: "text-green-500",
      },
    },
    {
      title: "Acoustics",
      unit: "dB",
      value: Math.floor(Math.random() * 100),
      icon: <Volume2 size={24} />,
      chartData: {
        labels: Array.from({ length: 8 }, (_, i) => i + 1),
        data: Array.from({ length: 8 }, () => Math.floor(Math.random() * 100)),
      },
      borderColor: "rgba(75, 192, 192, 0.8)",
      backgroundColor: "rgba(75, 192, 192, 0.1)",
      change: {
        text: `▼ ${(Math.random() * 5 + 1).toFixed(1)}%`,
        color: "text-red-500",
      },
    },
    {
      title: "Temperature",
      unit: "°C",
      value: (Math.random() * 30 + 10).toFixed(1),
      icon: <Thermometer size={24} />,
      chartData: {
        labels: Array.from({ length: 8 }, (_, i) => i + 1),
        data: Array.from({ length: 8 }, () =>
          (Math.random() * 30 + 10).toFixed(1)
        ),
      },
      borderColor: "rgba(255, 99, 132, 0.8)",
      backgroundColor: "rgba(255, 99, 132, 0.1)",
      change: {
        text: `▲ ${(Math.random() * 5 + 1).toFixed(1)}%`,
        color: "text-green-500",
      },
    },
    {
      title: "Humidity",
      unit: "% r.H.",
      value: Math.floor(Math.random() * 100),
      icon: <Droplet size={24} />,
      chartData: {
        labels: Array.from({ length: 8 }, (_, i) => i + 1),
        data: Array.from({ length: 8 }, () => Math.floor(Math.random() * 100)),
      },
      borderColor: "rgba(54, 162, 235, 0.8)",
      backgroundColor: "rgba(54, 162, 235, 0.1)",
      change: {
        text: `▼ ${(Math.random() * 5 + 1).toFixed(1)}%`,
        color: "text-red-500",
      },
    },
    {
      title: "Pressure",
      unit: "hPa",
      value: Math.floor(Math.random() * 50 + 1000),
      icon: <Wind size={24} />,
      chartData: {
        labels: Array.from({ length: 8 }, (_, i) => i + 1),
        data: Array.from({ length: 8 }, () =>
          Math.floor(Math.random() * 50 + 1000)
        ),
      },
      borderColor: "rgba(153, 102, 255, 0.8)",
      backgroundColor: "rgba(153, 102, 255, 0.1)",
      change: {
        text: `▲ ${(Math.random() * 5 + 1).toFixed(1)}%`,
        color: "text-green-500",
      },
    },
    {
      title: "Altitude",
      unit: "m",
      value: Math.floor(Math.random() * 1000),
      icon: <Mountain size={24} />,
      chartData: {
        labels: Array.from({ length: 8 }, (_, i) => i + 1),
        data: Array.from({ length: 8 }, () => Math.floor(Math.random() * 1000)),
      },
      borderColor: "rgba(255, 206, 86, 0.8)",
      backgroundColor: "rgba(255, 206, 86, 0.1)",
      change: {
        text: `▼ ${(Math.random() * 5 + 1).toFixed(1)}%`,
        color: "text-red-500",
      },
    },
    {
      title: "Air Quality",
      unit: "ppm",
      value: Math.floor(Math.random() * 500),
      icon: <Airplay size={24} />,
      chartData: {
        labels: Array.from({ length: 8 }, (_, i) => i + 1),
        data: Array.from({ length: 8 }, () => Math.floor(Math.random() * 500)),
      },
      borderColor: "rgba(199, 199, 86, 0.8)",
      backgroundColor: "rgba(199, 199, 86, 0.1)",
      change: {
        text: `▲ ${(Math.random() * 5 + 1).toFixed(1)}%`,
        color: "text-green-500",
      },
    },
    {
      title: "Signal",
      unit: "dBm",
      value: Math.floor(Math.random() * 1000),
      icon: <Signal size={24} />,
      chartData: {
        labels: Array.from({ length: 8 }, (_, i) => i + 1),
        data: Array.from({ length: 8 }, () => Math.floor(Math.random() * 1000)),
      },
      borderColor: "rgba(246, 109, 155, 0.8)",
      backgroundColor: "rgba(246, 109, 155, 0.1)",
      change: {
        text: `▼ ${(Math.random() * 5 + 1).toFixed(1)}%`,
        color: "text-red-500",
      },
    },
  ];

  return (
    // <div className="min-w-screen min-h-screen bg-gray-200 px-5 py-5 overflow-y-auto">
    //   <div className="max-w-6xl mx-auto">
        <div className="-mx-2 lg:flex lg:flex-wrap md:grid md:grid-cols-2">
          {cardsData.map((card, index) => (
            <div key={index} className="w-full xl:w-1/6 px-2 ">
              <Card {...card} />
            </div>
          ))}

          <div className="w-full xl:w-1/6 px-3 mb-4 h-[152px] lg:h-[120px] xl:h-[90px] 2xl:h-28">
            <div className="rounded-lg bg-[#102d49]  shadow-lg md:shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
            <div className="px-3 xl:pt-3 pt-8 pb-10 text-center relative z-10">
                <h4 className="text-xs xl:text-sm uppercase text-white leading-tight ">
                  Battery

                </h4>
                <div className="w-48 my-3 ml-28 lg:ml-0  2xl:ml-6">
                  <div className="shadow w-1/2 rounded border-2 border-gray-400 flex my-1 relative">
                    <div className="border-r-8 h-6 rounded-r absolute flex border-gray-400 ml-24 mt-2 z-10" />
                    <div
                      className="cursor-default bg-green-400 text-xs font-bold leading-none flex items-center justify-center m-1 py-4 text-center text-white"
                      style={{ width: "100%" }}
                    >
                      <div className="absolute left-0 mx-8 text-gray-700">
                        100%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full xl:w-1/6 px-3 mb-4 h-[152px] lg:h-[120px] xl:h-[90px] 2xl:h-28">
            <div className="rounded-lg bg-[#102d49]  shadow-lg md:shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
            <div className="px-3 xl:pt-3 pt-8 pb-10 text-center relative z-10">
                <p className="text-xs xl:text-sm uppercase text-white leading-tight ">
                  System Status
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-sm xl:text-lg text-white">Online</span>
                </div>
                <p className=" text-base xl:text-medium text-white mt-1">4/29/25 12:43 PM</p>
              </div>
              
            </div>
          </div>
        </div>
    //   </div>
    // </div>
  );
};

export default Cards;
