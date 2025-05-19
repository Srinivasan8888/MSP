import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../images/Xyma-Logo.png";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import axios from 'axios';

const NavBar = () => {
  const [query, setQuery] = useState("");
  const [ids, setIds] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch IDs when component mounts
    const fetchIds = async () => {
      try {
        const response = await fetch(`${import.meta.env.BACKEND_URL_GET}ids`);
        if (!response.ok) {
          throw new Error('Failed to fetch IDs');
        }
        const data = await response.json();
        const formattedIds = data.map(id => ({ id: id, name: `ID: ${id}` }));
        setIds(formattedIds);
        
        // Get stored ID from localStorage or use first ID
        const storedId = localStorage.getItem('id');
        const initialSelected = storedId 
          ? formattedIds.find(item => item.id === storedId)
          : formattedIds[0];
        setSelected(initialSelected);
      } catch (error) {
        console.error('Error fetching IDs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIds();
  }, []);

  const handleSelect = (value) => {
    setSelected(value);
    localStorage.setItem('id', value.id);
  };

  const filteredIds =
    query === ""
      ? ids
      : ids.filter((item) => {
          return item.name.toLowerCase().includes(query.toLowerCase());
        });

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      // Optionally disconnect sockets or perform other cleanup
      // if (props.onLogout) props.onLogout();

      const refreshToken = localStorage.getItem("refreshToken");

      // Make logout request to backend
      const response = await axios.delete(
        `${process.env.VITE_BACKEND_URL}auth/logout`,
        {
          data: { refreshToken },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Clear storage and redirect only if logout was successful
      if (response.status === 204 || response.status === 200) {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie =
          "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.replace(`/#/login`);
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: clear storage and redirect anyway
      localStorage.clear();
      sessionStorage.clear();
      document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.replace(`/#/login`);
    }
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl p-4 mx-auto">
        {/* Logo and Brand Name */}
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src={logo} className="h-8" alt="Xyma Logo" />
          {/* <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Flowbite
              </span> */}
        </Link>

        {/* Search and Mobile Menu Button */}
        <div className="flex md:order-2">
          {/* Search Button for Mobile */}
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-search"
            aria-expanded={menuOpen}
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>

          {/* Search Input for Desktop */}
          {/* <div className="relative hidden md:block">
            <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search icon</span>
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg ps-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
            />

          </div> */}
          <div className="relative flex items-center w-56 p-1 mx-auto border border-gray-400 rounded-sm">
            <svg
              className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <Combobox
              value={selected}
              onChange={handleSelect}
              onClose={() => setQuery("")}
            >
              <div className="relative">
                <ComboboxInput
                  className={clsx(
                    "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
                    "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
                  )}
                  displayValue={(item) => item?.name}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={loading ? "Loading IDs..." : "Select an ID"}
                />
                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                  <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
                </ComboboxButton>
              </div>

              <ComboboxOptions
                anchor="bottom"
                transition
                className={clsx(
                  "w-(--input-width) rounded-xl border border-white/5 bg-black p-1 [--anchor-gap:--spacing(1)] empty:invisible",
                  "transition duration-100 ease-in data-leave:data-closed:opacity-0"
                )}
              >
                {loading ? (
                  <div className="text-sm/6 text-white px-3 py-1.5">Loading...</div>
                ) : filteredIds.length === 0 ? (
                  <div className="text-sm/6 text-white px-3 py-1.5">No IDs found</div>
                ) : (
                  filteredIds.map((item) => (
                    <ComboboxOption
                      key={item.id}
                      value={item}
                      className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                    >
                      <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" />
                      <div className="text-white text-sm/6">{item.name}</div>
                    </ComboboxOption>
                  ))
                )}
              </ComboboxOptions>
            </Combobox>
          </div>

          {/* Mobile Menu Button */}
          <button
            data-collapse-toggle="navbar-search"
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-search"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        {/* Navbar Links */}
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-search"
        >
          {/* Search Input for Mobile */}
          <div className="relative mt-3 md:hidden">
            <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg ps-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
            />
          </div>

          {/* Navigation Links */}
          <ul className="flex flex-col p-4 mt-4 font-medium border border-gray-100 rounded-lg md:p-0 bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to="/"
                className="block px-3 py-2 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/chart"
                className="block px-3 py-2 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Chart
              </Link>
            </li>
            <li>
              <Link
                to="/report"
                className="block px-3 py-2 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Report
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="block px-3 py-2 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Settings
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block w-full px-3 py-2 text-left text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-700 md:p-0 dark:text-white md:dark:hover:text-red-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                style={{ background: "none", border: "none" }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default NavBar;
