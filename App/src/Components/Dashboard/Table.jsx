import React from 'react'
import './CSS/Scrollbar.css'
import { useDashboard } from '../../Context/DashboardContext'

const Table = () => {
    const { dashboardData, loading } = useDashboard()

    const convertToIST = (utcDate) => {
        const date = new Date(utcDate);
        return date.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    if (loading || !dashboardData) {
        return <div className="text-white">Loading...</div>
    }

    const { allData } = dashboardData

    return (
        <div className="relative h-full overflow-x-auto overflow-y-auto border border-gray-400 scrollbar-custom rounded-xl">
            <table className="w-full text-xs text-left text-gray-500 rtl:text-right dark:text-gray-400 ">
                <thead className="text-xs text-white uppercase   sticky top-0 z-10 rounded-xl bg-[#293056]">
                {/* bg-[rgba(17,45,73,1)] */}
                    <tr>
                        <th scope="col" className="px-6 py-3" title="Time">T</th>
                        <th scope="col" className="px-6 py-3" title="Vibration">V</th>
                        <th scope="col" className="px-6 py-3" title="Magnetic Flux">MF</th>
                        <th scope="col" className="px-6 py-3" title="RPM">RPM</th>
                        <th scope="col" className="px-6 py-3" title="Acoustics">A</th>
                        <th scope="col" className="px-6 py-3" title="Temperature">T</th>
                        <th scope="col" className="px-6 py-3" title="Humidity">H</th>
                        <th scope="col" className="px-6 py-3" title="Pressure">P</th>
                        <th scope="col" className="px-6 py-3" title="Altitude">A</th>
                        <th scope="col" className="px-6 py-3" title="Air Quality">AQ</th>
                        <th scope="col" className="px-6 py-3" title="Signal">S</th>
                        <th scope="col" className="px-6 py-3" title="Battery">B</th>
                    </tr>
                </thead>
                <tbody>
                    {allData.map((data, index) => (
                        <tr key={index} className="text-xs bg-[#1D254D] text-white">
                            <td className="px-6 py-4">{convertToIST(data.createdAt)}</td>
                            <td className="px-6 py-4">{data.vibration} mm/s</td>
                            <td className="px-6 py-4">{data.magneticflux} Gauss</td>
                            <td className="px-6 py-4">{data.rpm} RPM</td>
                            <td className="px-6 py-4">{data.acoustics} dB</td>
                            <td className="px-6 py-4">{data.temperature} °C</td>
                            <td className="px-6 py-4">{data.humidity} % r.H.</td>
                            <td className="px-6 py-4">{data.pressure} hPa</td>
                            <td className="px-6 py-4">{data.altitude} m</td>
                            <td className="px-6 py-4">{data.airquality} ppm</td>
                            <td className="px-6 py-4">{data.signal} %</td>
                            <td className="px-6 py-4">{data.battery} %</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;