import React from "react";
import Cards from "../../Components/Dashboard/Cards";
import Gauge from "../../Components/Dashboard/Gauge";
import LineGraph from "../../Components/Dashboard/LineGraph";
import Table from "../../Components/Dashboard/Table";

const Dashboard = () => {
  return (
    <div className="h-screen ">
      <div className="h-[50%] flex flex-row bg-[rgba(17,25,67,1)] ">
        <div className=" md:w-[60%] md:h-full px-5 py-5 mx-auto ">
          <Cards />
          <div className="flex flex-col md:flex-row gap-9">
            <Gauge />
          </div>
        </div>
        <div className=" w-[40%] h-full text-black overflow-x-auto overflow-y-auto">
          <Table />
        </div>
      </div>
      <div className="h-[46%] flex flex-row bg-[rgba(17,25,67,1)]">
        <div className=" w-[60%] h-full px-5 py-5">
          <LineGraph />
        </div>
        <div className=" w-[40%] h-full "></div>
      </div>
    </div>
  );
};

export default Dashboard;
// rgba(17, 25, 67, 1)
