import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
// import SideBar from "./Layout/Sidebar/Sidebar";
import ProtectedRouter from "./Layout/ProtectedRouter/ProtectedRouter";
import Test from "./Pages/Test/Test";
import Report from './Pages/Report/Report';


const App = () => {
  return (
    <div>
      <HashRouter>
        <Routes>
          <Route path="/" element={<ProtectedRouter />}>
            <Route index element={<Dashboard />} />
            <Route path="report" element={<Report />} />
            <Route path="test" element={<Test />} />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;
