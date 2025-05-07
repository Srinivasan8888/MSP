import React from "react";
import { GaugeComponent } from 'react-gauge-component'
import { useDashboard } from '../../Context/DashboardContext';

const Gauge = () => {
  const { dashboardData, loading } = useDashboard();

  if (loading || !dashboardData) {
    return <div className="text-white">Loading...</div>;
  }

  const { cardData } = dashboardData;
  const getLatestValue = (data) => {
    if (!data || data.length === 0) return 0;
    const value = parseFloat(data[0]);
    return isNaN(value) ? 0 : value;
  };

  const gauges = [
    {
      title: "RPM",
      value: getLatestValue(cardData.rpm),
      maxValue: 3000,
      minValue: 0,
      unit: "RPM"
    },
    {
      title: "Acoustics",
      value: getLatestValue(cardData.acoustics),
      maxValue: 100,
      minValue: 0,
      unit: "dB"
    },
    {
      title: "Humidity",
      value: getLatestValue(cardData.humidity),
      maxValue: 100,
      minValue: 0,
      unit: "%"
    },
    {
      title: "Pressure",
      value: getLatestValue(cardData.pressure),
      maxValue: 1200,
      minValue: 800,
      unit: "hPa"
    },
    {
      title: "Air Quality",
      value: getLatestValue(cardData.airquality),
      maxValue: 1000,
      minValue: 0,
      unit: "ppm"
    },
    {
      title: "Battery",
      value: getLatestValue(cardData.battery),
      maxValue: 100,
      minValue: 0,
      unit: "%"
    },
  ];

  return (
    <>
      {gauges.map((gauge, index) => (
        <div key={index} className="2xl:w-[155px] xl:w-[120px] h-full">
          <p className="text-white text-center text-xs 2xl:text-base">
            {gauge.title}
          </p>
          <GaugeComponent
            value={gauge.value}
            minValue={gauge.minValue}
            maxValue={gauge.maxValue}
            type="radial"
            labels={{
              tickLabels: {
                type: "inner",
                ticks: [
                  { value: gauge.minValue + (gauge.maxValue - gauge.minValue) * 0.2 },
                  { value: gauge.minValue + (gauge.maxValue - gauge.minValue) * 0.4 },
                  { value: gauge.minValue + (gauge.maxValue - gauge.minValue) * 0.6 },
                  { value: gauge.minValue + (gauge.maxValue - gauge.minValue) * 0.8 },
                  { value: gauge.maxValue },
                ],
              },
              valueLabel: {
                formatTextValue: value => `${value} ${gauge.unit}`,
                style: { textShadow: 'none' },
              },
            }}
            arc={{
              colorArray: ["#5BE12C", "#EA4228"],
              subArcs: [
                { limit: gauge.minValue + (gauge.maxValue - gauge.minValue) * 0.3 },
                { limit: gauge.minValue + (gauge.maxValue - gauge.minValue) * 0.6 },
                { limit: gauge.minValue + (gauge.maxValue - gauge.minValue) * 0.8 },
                { limit: gauge.maxValue },
              ],
              padding: 0.02,
              width: 0.3,
            }}
            pointer={{
              elastic: true,
              animationDelay: 0,
            }}
          />
        </div>
      ))}
    </>
  );
};

export default Gauge;
