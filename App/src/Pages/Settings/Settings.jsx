import React from 'react'

const Settings = () => {
  return (
    <div className="min-h-screen bg-[rgba(17,25,67,1)] p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1a1f3c] rounded-xl shadow-2xl p-6 md:p-8 border border-gray-400">
          <div className="text-center space-y-6">
            <h5 className="text-2xl md:text-3xl font-bold text-white">
              XYMA Analytics Private Ltd <br />
              IIT Madras Research Park
            </h5>
            
            <div className="border-t border-gray-700 pt-6">
              <h5 className="text-xl font-medium text-gray-300">
              The device captures and reports Multisensing sensor Parameters and Units, enabling comprehensive monitoring of environmental and operational conditions in industrial plant settings.
              </h5>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400">
              This battery-powered device broadcasts a comprehensive set of Multisensing sensor Parameters and Units — including Vibration (mm/s), Magnetic Flux (Gauss), RPM, Acoustics (dB), Temperature (°C), Humidity (% r.H.), Pressure (hPa), Altitude (m), Air Quality (ppm), Signal strength, Battery level, Timestamp, and Device ID — to the dashboard via the Industrial Internet of Things (IIoT) module.
              </p>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h5 className="text-2xl font-bold text-white mb-4">
                Contact Information:
              </h5>
              <p className="text-gray-400">
                Mail: info@xyma.in <br />
                ©2023 XYMA Analytics Private Ltd
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings