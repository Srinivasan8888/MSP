import React, { useState, useEffect, memo } from "react";
import Cards from "../../Components/Dashboard/Cards";
import Gauge from "../../Components/Dashboard/Gauge";
import LineGraph from "../../Components/Dashboard/LineGraph";
import Table from "../../Components/Dashboard/Table";
import { Description, Field, Input, Button } from "@headlessui/react";
import clsx from "clsx";
import Dropdown from "../../Components/Dashboard/Dropdown";
import { GaugeComponent } from "react-gauge-component";
import { DashboardProvider, useDashboard } from "../../Context/DashboardContext";

const people = [
  { id: 1, name: "Tom Cook" },
  { id: 2, name: "Wade Cooper" },
  { id: 3, name: "Tanya Fox" },
  { id: 4, name: "Arlene Mccoy" },
  { id: 5, name: "Devon Webb" },
];

const getSignalIcon = (strength) => {
  if (strength >= 80) return "📶"; // Strong signal
  if (strength >= 60) return "📶"; // Good signal
  if (strength >= 40) return "📶"; // Fair signal
  if (strength >= 20) return "📶"; // Weak signal
  return "📶"; // Very weak signal
};

const getSignalColor = (strength) => {
  if (strength >= 80) return "text-green-500";
  if (strength >= 60) return "text-green-400";
  if (strength >= 40) return "text-yellow-500";
  if (strength >= 20) return "text-orange-500";
  return "text-red-500";
};

const SignalStrength = memo(({ signalData }) => (
  <div className="w-full grid grid-cols-4 gap-4 p-2 mt-4 h-[70%]">
    {signalData.map((data, index) => (
      <div
        key={index}
        className="w-16 h-16 bg-[rgba(19,38,58,1)] rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200 flex flex-col items-center justify-center"
      >
        <div className={`text-2xl ${getSignalColor(data.strength)}`}>
          {getSignalIcon(data.strength)}
        </div>
        <div className="text-xs text-white mt-1">
          {data.time.getHours()}:00
        </div>
        <div className="text-xs text-white/70">
          {data.strength}%
        </div>
      </div>
    ))}
  </div>
));

SignalStrength.displayName = 'SignalStrength';

const ThresholdForm = memo(() => {
  const { dashboardData } = useDashboard();
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dashboardData?.thresholdData && dashboardData.thresholdData.length > 0) {
      const threshold = dashboardData.thresholdData[0];
      console.log("Threshold", threshold);
      setMinValue(threshold.minValue);
      setMaxValue(threshold.maxValue);
    } else {
      setMinValue('');
      setMaxValue('');
    }
  }, [dashboardData?.thresholdData]);

  const handleSubmit = async () => {
    if (!minValue || !maxValue) {
      alert('Please enter both minimum and maximum values');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/v1/createThreshold?id=1401&minValue=${minValue}&maxValue=${maxValue}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to save threshold values');
      }

      const data = await response.json();
      alert(data.message || 'Threshold values saved successfully!');
    } catch (error) {
      console.error('Error saving threshold:', error);
      alert('Failed to save threshold values');
    } finally {
      setLoading(false);
    }
  };

  console.log("dashboard data", dashboardData)
  console.log("dashboard data")

  return (
    <div className="w-full flex flex-col bg-white/5 p-4 h-[400px] mt-2 lg:mt-0 xl:h-[100%] border border-gray-400 rounded-2xl">
      <div className="flex items-center justify-center font-semibold text-lg mb-4 h-[15%]">
        Set Threshold Limit
      </div>

      <div className="mx-auto flex flex-col justify-center w-full max-w-md px-4 mt-4">
        <Field>
          <Description className="text-sm/6 text-white/50">
            Enter Minimum Threshold
          </Description>
          <Input
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
            className={clsx(
              "mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white",
              "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
            )}
          />
        </Field>
      </div>

      <div className="mx-auto flex flex-col justify-center w-full max-w-md px-4 mt-4">
        <Field>
          <Description className="text-sm/6 text-white/50">
            Enter Maximum Threshold
          </Description>
          <Input
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
            className={clsx(
              "mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white",
              "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
            )}
          />
        </Field>
      </div>

      <div className="flex items-center justify-center mt-6 px-4">
        <Button 
          onClick={handleSubmit}
          disabled={loading}
          className={clsx(
            "rounded py-2 text-sm text-white w-full max-w-md",
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-sky-600 data-active:bg-sky-700 data-hover:bg-sky-500"
          )}
        >
          {loading ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </div>
  );
});

ThresholdForm.displayName = 'ThresholdForm';

const ChartSection = memo(() => {
  return (
    <div className="text-white h-[250px] xl:h-[95%] xl:w-[40%] bg-white/5 border border-gray-400 rounded-2xl m-2 flex flex-col items-center">
      <Dropdown />
      <LineGraph />
    </div>
  );
});

ChartSection.displayName = 'ChartSection';

const Dashboard = () => {
  const [signalData, setSignalData] = useState([]);

  useEffect(() => {
    // Generate random signal data for the last 12 hours
    const generateSignalData = () => {
      const now = new Date();
      const data = Array.from({ length: 8 }, (_, i) => {
        const hour = new Date(now);
        hour.setHours(now.getHours() - i);
        return {
          time: hour,
          strength: Math.floor(Math.random() * 100),
        };
      }).reverse();
      setSignalData(data);
    };

    generateSignalData();
    // Update every 5 minutes
    const interval = setInterval(generateSignalData, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardProvider>
      <div className="h-screen overflow-x-scroll bg-[rgba(17,25,67,1)] p-2">
        <div className="xl:h-[50%] flex flex-col xl:flex-row">
          <div className="text-white w-[100%] xl:w-[60%] md:h-full px-5 py-5 mx-auto">
            <Cards />
            <div className="text-white grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-4 border border-gray-400 rounded-2xl">
              <Gauge />
            </div>
          </div>
          <ChartSection />
        </div>
        <div className="xl:h-[50%] flex flex-col xl:flex-row bg-[rgba(17,25,67,1)]">
          <div className="h-[800px] w-[360px] md:h-full md:w-full xl:h-[75%] 2xl:h-[83%] xl:w-[60%] text-black overflow-x-auto overflow-y-auto pl-2 mt-2 pr-3 xl:pr-4.5 mx-auto">
            <Table />
          </div>

          <div className="xl:w-[40.9%] h-full xl:h-[86.99%] text-white flex flex-col xl:flex-row gap-2 px-2 py-1.5">
            <ThresholdForm />

            <div className="w-full flex flex-col bg-white/5 p-4 h-[730px] xl:h-[100%] border border-gray-400 rounded-2xl">
              <div className="flex flex-col items-center justify-center h-[100%]">
                <div>Signal Strength</div>
                <div className="2xl:w-[120px] xl:w-[120px] h-[35%]">
                  <GaugeComponent
                    value={50}
                    type="radial"
                    labels={{
                      tickLabels: {
                        type: "outer",
                        ticks: [
                          { value: 20 },
                          { value: 40 },
                          { value: 60 },
                          { value: 80 },
                          { value: 100 },
                        ],
                      },
                    }}
                    arc={{
                      colorArray: ["#5BE12C", "#EA4228"],
                      subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
                      padding: 0.02,
                      width: 0.3,
                    }}
                    pointer={{
                      elastic: true,
                      animationDelay: 0,
                    }}
                  />
                </div>
                <SignalStrength signalData={signalData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
};

export default memo(Dashboard);
