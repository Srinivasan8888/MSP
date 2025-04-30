import React, { useEffect, useState, useRef } from "react";
// import logo from "../../images/";
import xyma_logo from "../../images/Xyma-Logo.png";
import { Menus } from "./Menu";
import { IoMdLogOut, IoMdSettings } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
// Ref to track current socket

const SearchInput = ({
  iddropdown,
  searchText,
  handleSearchChange,
  filteredData,
  handleSuggestionClick,
  showSuggestions,
  setShowSuggestions,
  refreshUniqueIds,
  className,
}) => {
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`font-poppins z-30 flex items-center justify-center rounded-xl border border-white font-medium text-white backdrop-blur-sm md:w-[30%] md:text-[14px] lg:w-[25%] lg:text-[16px] xl:w-[22%] xl:text-[18px] 2xl:w-[20%] 2xl:text-[22px] ${className}`}
      ref={containerRef}
    >
      <div className="relative flex items-center w-full">
        <input
          id="search"
          name="search"
          type="number"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search"
          className="h-full w-full rounded-xl bg-transparent py-1.5 pl-5 pr-16 text-white placeholder:text-white/70 focus:outline-none md:pl-4 md:pr-12 placeholder:md:text-[10px] lg:pl-5 lg:pr-14 lg:placeholder:text-[12px] xl:pl-6 xl:pr-16 xl:placeholder:text-[14px]"
          onFocus={() => {
            refreshUniqueIds();
            setShowSuggestions(true);
          }}
        />

        {showSuggestions && searchText && (
          <ul className="absolute left-0 right-0 top-full max-h-[30vh] overflow-y-auto rounded-xl border border-gray-300 bg-white text-[14px] text-black shadow-lg lg:text-[16px] xl:text-[18px]">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    handleSuggestionClick(item);
                    setShowSuggestions(false);
                  }}
                >
                  {item}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No results found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

const Sidebar = (props) => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [iddropdown, setIddropdown] = useState([]); // Make sure this is an array
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [searchText, setSearchText] = useState(
    localStorage.getItem("id") || "",
  );
  const [filteredData, setFilteredData] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const buttonRef = useRef(null);
  const sidebarRef = useRef(null);

  const goTo = (path) => {
    navigate(path);
  };

  const gotoDashboard = () => goTo("/Dashboard");
  const gotoAnalytics = () => goTo("/Analytics");
  const gotoReport = () => goTo("/Report");
  const gotoSettings = () => goTo("/Settings");
  const gotoHeatmap = () => goTo("/Heatmap");

  const handleLogout = async () => {
    try {
      // Call the onLogout prop to disconnect sockets
      if (props.onLogout) {
        props.onLogout();
      }

      const refreshToken = localStorage.getItem("refreshToken");
      // const accessToken = localStorage.getItem('accessToken');

      // Make logout request first
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}auth/logout`,
        {
          data: { refreshToken },
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // Clear storage only after successful response
      if (response.status === 200) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace(`/`);
      }
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.clear();
      sessionStorage.clear();
      document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.replace(`/`);
    }
  };

  const refreshUniqueIds = async () => {
    try {
      const response = await API.get(
        `${process.env.REACT_APP_SERVER_URL}api/v2/getuniqueids`,
      );
      const ids = response.data.ids;
      setIddropdown(ids);
      setFilteredData(ids);
      localStorage.setItem("cachedIds", JSON.stringify(ids));

      if (ids.length > 0 && !localStorage.getItem("id")) {
        localStorage.setItem("id", ids[0]);
        setSearchText(ids[0]);
      }
    } catch (error) {
      console.error("Error fetching unique IDs:", error);
      const cachedIds = JSON.parse(localStorage.getItem("cachedIds") || "[]");
      setIddropdown(cachedIds);
      setFilteredData(cachedIds);
    }
  };

  useEffect(() => {
    const cachedIds = JSON.parse(localStorage.getItem("cachedIds") || "[]");
    if (cachedIds.length > 0) {
      setIddropdown(cachedIds);
      setFilteredData(cachedIds);
    }
    refreshUniqueIds();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchText(query);
    localStorage.setItem("id", query);

    // Ensure the input is numeric
    if (/^\d*$/.test(query)) {
      const filtered = iddropdown.filter(
        (item) => item.toString().includes(query), // Numeric filter
      );
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  };

  const handleSuggestionClick = (item) => {
    setSearchText(item);
    localStorage.setItem("id", item);
    setShowSuggestions(false);
  };

  // Click outside handler
  const handleClickOutside = (event) => {
    if (
      buttonRef.current &&
      !buttonRef.current.contains(event.target) &&
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target)
    ) {
      setIsSidebarOpen(false);
      setIsHovered(false);
    }
  };

  // Add/remove click listener
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Replace socket useEffect with polling mechanism
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await API.get(
          `${process.env.REACT_APP_SERVER_URL}api/v2/getNotifications`,
        );

        if (response.data.status === "success") {
          const seenIds = new Set(
            JSON.parse(localStorage.getItem("seenAlerts") || "[]"),
          );

          // Process all alert types
          const alertTypes = ["critical", "warnings", "warning", "info"];
          let newAlerts = [];

          alertTypes.forEach((type) => {
            if (response.data.data.alerts[type]) {
              console.log(`Processing ${type} alerts:`, response.data.data.alerts[type]);
              const typeAlerts = response.data.data.alerts[type].map(
                (item) => ({
                  id: `${item.id}-${new Date(item.timestamp).getTime()}`,
                  model: item.model,
                  sensor: item.sensor,
                  value: item.value,
                  severity: item.severity,
                  message: `${item.sensor}: ${item.message} (${item.value})`,
                  timestamp: item.timestamp,
                  seen: seenIds.has(
                    `${item.id}-${new Date(item.timestamp).getTime()}`,
                  ),
                }),
              );
              console.log(`Processed ${type} alerts:`, typeAlerts);
              newAlerts = [...newAlerts, ...typeAlerts];
            }
          });

          // Update alerts state and local storage
          const updatedAlerts = [
            ...newAlerts,
            ...alerts.filter(
              (existing) =>
                !newAlerts.some((newAlert) => newAlert.id === existing.id),
            ),
          ];
          console.log('Updated alerts:', updatedAlerts);
          setAlerts(updatedAlerts);
          localStorage.setItem("alerts", JSON.stringify(updatedAlerts));
        }
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    // Initial fetch and set up polling
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 1000);
    return () => clearInterval(interval);
  }, [alerts]);

  return (
    <>
      {/* <div className="h-[80px] md:flex md:h-[6.4%] md:w-auto pt-2 mb-2 md:mb-2 md:pt-4 md:justify-between mx-2 gap-3"> */}

      <div className="mx-2 mb-2 h-[70px] w-auto gap-3 pt-2 md:mb-2 md:flex md:h-[75px] md:w-[97%] md:justify-between md:pt-4 lg:h-[7.2%] xl:h-[9%] xl:w-[97.5%] custom-1.5xl:w-[97.5%] 2xl:h-[7.5%] 2xl:w-auto">
        {/* mobileview */}
        <div className="flex items-center w-full h-full text-lg font-semibold text-white bg-black bg-opacity-75 border border-white font-popins rounded-xl md:hidden">
          <div className="flex items-start w-3/4 p-4">
            <img
              src={xyma_logo}
              alt="Xyma Logo"
              className="w-32 h-auto xl:w-26"
            />
          </div>

          <div className="flex-1 mx-2">
            {/* <SearchInput
              iddropdown={iddropdown}
              searchText={searchText}
              handleSearchChange={handleSearchChange}
              filteredData={filteredData}
              handleSuggestionClick={handleSuggestionClick}
              showSuggestions={showSuggestions}
              setShowSuggestions={setShowSuggestions}
              refreshUniqueIds={refreshUniqueIds}
            /> */}
          </div>

          <div className="flex w-[16%] items-end p-4">
            <Menus />
          </div>
        </div>

        {/* for desktop */}
        {/* <div className="font-poppins hidden items-center justify-center rounded-xl border border-white bg-[rgba(14,14,14,0.75)] font-semibold leading-[33px] text-white backdrop-blur-sm md:flex md:w-[16%] md:text-[12px] xl:text-[16px] xl:font-medium 2xl:text-[22px]">
          <img
            src={logo}
            alt="Vedanta Logo"
            className="md:w-[120px] lg:w-[140px] 2xl:w-[180px]"
          />
        </div> */}
        <button
          className={`font-poppins hidden items-center justify-center rounded-xl bg-[rgba(14,14,14,0.75)] font-semibold leading-[33px] text-white backdrop-blur-sm md:flex md:w-[14%] md:text-[12px] xl:text-[16px] xl:font-medium 2xl:text-[22px] ${
            location.pathname === "/Dashboard"
              ? "border-4 border-white"
              : "border border-white"
          }`}
          onClick={gotoDashboard}
        >
          Home
        </button>
        <button
          className={`font-poppins hidden items-center justify-center rounded-xl bg-[rgba(14,14,14,0.75)] font-semibold leading-[33px] text-white backdrop-blur-sm md:flex md:w-[14%] md:text-[12px] xl:text-[16px] xl:font-medium 2xl:text-[22px] ${
            location.pathname === "/Report"
              ? "border-4 border-white"
              : "border border-white"
          }`}
          onClick={gotoReport}
        >
          Report
        </button>
        <button
          className={`font-poppins hidden items-center justify-center rounded-xl bg-[rgba(14,14,14,0.75)] font-semibold leading-[33px] text-white backdrop-blur-sm md:flex md:w-[14%] md:text-[12px] xl:text-[16px] xl:font-medium 2xl:text-[22px] ${
            location.pathname === "/Analytics"
              ? "border-4 border-white"
              : "border border-white"
          }`}
          onClick={gotoAnalytics}
        >
          Analytics
        </button>
        <button
          className={`font-poppins hidden items-center justify-center rounded-xl bg-[rgba(14,14,14,0.75)] font-semibold leading-[33px] text-white backdrop-blur-sm md:flex md:w-[14%] md:text-[12px] xl:text-[16px] xl:font-medium 2xl:text-[22px] ${
            location.pathname === "/Heatmap"
              ? "border-4 border-white"
              : "border border-white"
          }`}
          onClick={gotoHeatmap}
        >
          Heatmap
        </button>

        {/* <SearchInput
          iddropdown={iddropdown}
          searchText={searchText}
          handleSearchChange={handleSearchChange}
          filteredData={filteredData}
          handleSuggestionClick={handleSuggestionClick}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          refreshUniqueIds={refreshUniqueIds}
          className="hidden md:block"
        /> */}

        <button
          className={`font-poppins hidden items-center justify-center rounded-xl bg-[rgba(14,14,14,0.75)] text-[22px] font-semibold leading-[33px] text-white backdrop-blur-sm md:flex md:w-[4%] ${
            location.pathname === '/Settings' 
             ? "border-4 border-white"
              : 'border border-white'
          }`}
          onClick={() => gotoSettings()}
        >
          <IoMdSettings />
        </button>
        <button
          ref={buttonRef}
          className="font-poppins relative hidden items-center justify-center rounded-xl border border-white bg-[rgba(14,14,14,0.75)] text-[22px] font-semibold leading-[33px] text-white backdrop-blur-sm md:flex md:w-[4%]"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <IoNotifications />
          <div class="absolute -end-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white dark:border-gray-900">
            {alerts.length}
          </div>
        </button>

        <button
          className="font-poppins hidden items-center justify-center rounded-xl border border-white bg-[rgba(14,14,14,0.75)] text-[22px] font-semibold leading-[33px] text-white backdrop-blur-sm md:flex md:w-[4%]"
          onClick={() => handleLogout()}
        >
          <IoMdLogOut />
        </button>
        <div className="font-poppins hidden items-center justify-center rounded-xl border border-white bg-[rgba(14,14,14,0.75)] text-[22px] font-semibold leading-[33px] text-white backdrop-blur-sm md:flex md:w-[10%] xl:w-[8%]">
          <img
            src={xyma_logo}
            alt="xyma logo"
            className="xl-fit h-auto max-h-[30px] w-16 xl:max-w-[60px] 2xl:max-w-[70px]"
            //  className="lg:w-[50px] 2xl:w-[180px] lg:h-[70px]"
          />
        </div>
      </div>

      {/* Sidebar Overlay */}
      {(isSidebarOpen || isHovered) && (
        <div
          ref={sidebarRef}
          className={`fixed right-2.5 top-20 z-10 flex h-5/6 w-1/4 flex-col rounded-2xl border-2 border-white bg-[rgba(16,16,16,1)] text-white shadow-lg duration-1000`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative flex items-center justify-center p-4 border-2 border-white rounded-tl-xl rounded-tr-xl">
            <p className="flex-1 text-2xl font-semibold text-center">
              {" "}
              Alerts{" "}
            </p>
          </div>

          <div className="overflow-x-auto scrollbar-custom">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div key={alert.id} className="relative w-full h-32 border">
                  <div className="absolute left-[36px] top-[30px] inline-flex h-10 w-96 items-start justify-start gap-6">
                    <div data-svg-wrapper className="relative">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 22C19.3137 22 22 19.3137 22 16C22 12.6863 19.3137 10 16 10C12.6863 10 10 12.6863 10 16C10 19.3137 12.6863 22 16 22Z"
                          fill="#0077E4"
                          stroke="#0077E4"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div className="w-full font-['Poppins'] text-sm font-normal leading-loose text-white">
                      {new Date(alert.timestamp).toLocaleString()} reported a
                      error: {alert.message} (ID: {alert.id.split('-')[0]})
                    </div>
                  </div>
                  <div className="absolute left-0 top-0 h-full w-full bg-[#b6b6b6]/20" />
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400">
                No alerts to display
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
