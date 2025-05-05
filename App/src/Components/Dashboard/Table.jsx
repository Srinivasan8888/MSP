import React from 'react'
import './CSS/Scrollbar.css'

const Table = () => {
    const generateRandomData = () => {
        return {
            time: new Date().toLocaleString(),
            vibration: (Math.random() * 10).toFixed(2) + ' mm/s',
            magneticFlux: (Math.random() * 100).toFixed(2) + ' Gauss',
            rpm: Math.floor(Math.random() * 5000) + ' RPM',
            acoustics: (Math.random() * 100).toFixed(2) + ' dB',
            temperature: (Math.random() * 50).toFixed(2) + ' °C',
            humidity: (Math.random() * 100).toFixed(2) + ' % r.H.',
            pressure: (Math.random() * 1000 + 900).toFixed(2) + ' hPa',
            altitude: (Math.random() * 2000).toFixed(2) + ' m',
            airQuality: (Math.random() * 1000).toFixed(2) + ' ppm',
            signal: Math.floor(Math.random() * 100) + ' %',
            battery: Math.floor(Math.random() * 100) + ' %'
        };
    };

    const sensorData = Array(10).fill(null).map(() => generateRandomData());

    return (
        <div className="relative overflow-x-auto overflow-y-auto scrollbar-custom h-full rounded-xl">
            <table className="w-full text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
                <thead className="text-xs text-white uppercase   sticky top-0 z-10 rounded-xl  bg-[rgba(17,45,73,1)]">
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
                    {sensorData.map((data, index) => (
                        <tr key={index} className="text-xs bg-gray-800 text-white">
                            <td className="px-6 py-4">{data.time}</td>
                            <td className="px-6 py-4">{data.vibration}</td>
                            <td className="px-6 py-4">{data.magneticFlux}</td>
                            <td className="px-6 py-4">{data.rpm}</td>
                            <td className="px-6 py-4">{data.acoustics}</td>
                            <td className="px-6 py-4">{data.temperature}</td>
                            <td className="px-6 py-4">{data.humidity}</td>
                            <td className="px-6 py-4">{data.pressure}</td>
                            <td className="px-6 py-4">{data.altitude}</td>
                            <td className="px-6 py-4">{data.airQuality}</td>
                            <td className="px-6 py-4">{data.signal}</td>
                            <td className="px-6 py-4">{data.battery}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;