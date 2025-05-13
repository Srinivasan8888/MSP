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
import Signal from "../../Components/Dashboard/Signal";
import API from "../../Layout/Axios/AxiosInterceptor";


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
        className="w-18 h-18 bg-[rgba(19,38,58,1)] rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200 flex flex-col items-center justify-center"
      >
        <div className={`text-2xl ${getSignalColor(data.strength)}`}>
          <Signal signal={data.strength} height="35px" width="4px" />
        </div>
        <div className="text-xs text-white">
          {data.time.toLocaleTimeString('en-US', { 
            hour: 'numeric',
            minute: '2-digit',
            hour12: true 
          })}
        </div>
        <div className="text-xs text-white/70">
          {data.strength.toFixed(1)} dBm
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

    const parameter = localStorage.getItem('selectedParameter') || 'vibration';
    const id = localStorage.getItem('id');
    setLoading(true);
    try {
      // const response = await API.post(`/api/v1/createThreshold?id=1401&minValue=${minValue}&maxValue=${maxValue}&parameter=${parameter}`, {
        const response = await fetch(`http://localhost:4000/api/v1/createThreshold?id=${id}&minValue=${minValue}&maxValue=${maxValue}&parameter=${parameter}`, {
 
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

      <div className="flex flex-col justify-center w-full max-w-md px-4 mx-auto mt-4">
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

      <div className="flex flex-col justify-center w-full max-w-md px-4 mx-auto mt-4">
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

      <div className="flex items-center justify-center px-4 mt-6">
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
     <div className="flex w-[40%]">
     <span className="text-[13px]">Select Parameter:</span> <Dropdown />
     </div>
      <LineGraph />
    </div>
  );
});

ChartSection.displayName = 'ChartSection';

const DashboardContent = () => {
  const { dashboardData, loading } = useDashboard();
  const [signalData, setSignalData] = useState([]);
  const [currentSignal, setCurrentSignal] = useState(0);

  useEffect(() => {
    if (loading || !dashboardData) return;

    // Get signal data from signalSeries
    if (dashboardData.signalSeries && dashboardData.signalSeries.length > 0) {
      // Get the most recent signal value (last element in the array)
      const latestSignal = dashboardData.signalSeries[dashboardData.signalSeries.length - 1].signal;
      setCurrentSignal(parseFloat(latestSignal));
      
      // Format the data for display
      const formattedData = dashboardData.signalSeries.map(item => ({
        time: new Date(item.timestamp),
        strength: parseFloat(item.signal)
      }));
      setSignalData(formattedData);
    }
  }, [dashboardData, loading]);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="h-screen overflow-x-scroll bg-[rgba(17,25,67,1)] p-2">
      <div className="xl:h-[50%] flex flex-col xl:flex-row">
        <div className="text-white w-[100%] xl:w-[60%] md:h-full px-5 py-5 mx-auto">
          <Cards />
          <div className="grid grid-cols-2 gap-4 text-white border border-gray-400 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 rounded-2xl">
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
              <Signal signal={currentSignal} height="60px" width="10px" />
              <div className="mt-2 text-lg text-white">
                {currentSignal.toFixed(1)} dBm
              </div>
              <SignalStrength signalData={signalData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default memo(Dashboard);
