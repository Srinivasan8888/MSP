import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
// import SideBar from "./Layout/Sidebar/Sidebar";
import ProtectedRouter from "./Layout/ProtectedRouter/ProtectedRouter";
import Chart from "./Pages/Chart/Chart";
import Report from './Pages/Report/Report';
import Settings from "./Pages/Settings/Settings";
import Test from "./Pages/Test/Test";


const App = () => {
  return (
    <div>
      <HashRouter>
        <Routes>
          <Route path="/" element={<ProtectedRouter />}>
            <Route index element={<Dashboard />} />
            <Route path="chart" element={<Chart />} />
            <Route path="report" element={<Report />} />
            <Route path="settings" element={<Settings />} />
            <Route path="test" element={<Test />} />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;
