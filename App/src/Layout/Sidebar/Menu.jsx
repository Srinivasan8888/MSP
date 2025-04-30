import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
// import menuicon from '../../images/menu.png'
import menuicon from '../../images/menu.png'
import axios from 'axios';

export function Menus() {
  const handleLogout = async () => {
    try {
    
      const refreshToken = localStorage.getItem('refreshToken');
      // const accessToken = localStorage.getItem('accessToken');

      // Make logout request first
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}auth/logout`, 
        {
          data: { refreshToken },
          headers: {
            "Content-Type": "application/json"
          }
        }
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
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.replace(`/`);
    }
  };
  return (
    <div className="relative">
      <Menu>
        {({ open }) => (
          <>
            <MenuButton>
              <div>
                <img src={menuicon} alt="menu Logo" className="w-12 h-7 filter invert" />
              </div>
            </MenuButton>
            {open && (
              <div className='absolute right-0 z-50 w-48 mt-2 bg-white shadow-lg'>
                <MenuItems>
                  <MenuItem>
                    {({ isActive }) => (
                      <a
                        className={`${isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700'
                          } block px-4 py-2 text-sm`}
                        href="/Dashboard"
                      >
                       Home
                      </a>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ isActive }) => (
                      <a
                        className={`${isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700'
                          } block px-4 py-2 text-sm`}
                        href="/Report"
                      >
                        Report
                      </a>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ isActive }) => (
                      <a
                        className={`${isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700'
                          } block px-4 py-2 text-sm`}
                        href="/Analytics"
                      >
                        Analytics
                      </a>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ isActive }) => (
                      <a
                        className={`${isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700'
                          } block px-4 py-2 text-sm`}
                        href="/Heatmap"
                      >
                        Heatmap
                      </a>
                    )}
                  </MenuItem>
                  
                  <MenuItem>
                    {({ isActive }) => (
                      <a
                        className={`${isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700'
                          } block px-4 py-2 text-sm`}
                        href="/Settings"
                      >
                        Settings
                      </a>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ isActive }) => (
                      <a
                        className={`${isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700'
                          } block px-4 py-2 text-sm`}
                        onClick={() => handleLogout()}
                      >
                        Logout
                      </a>
                    )}
                  </MenuItem>
                </MenuItems>
              </div>
            )}
          </>
        )}
      </Menu>
    </div>
  )
}