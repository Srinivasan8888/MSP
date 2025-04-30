import React from 'react'

const Table = () => {
    const generateRandomData = () => {
        return {
            time: new Date().toISOString(),
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
        <div className="relative overflow-x-auto overflow-y-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-xl">
                <thead className="text-xs text-gray-900 uppercase dark:text-gray-400 bg-white sticky top-0">
                    <tr>
                        <th scope="col" className="px-6 py-3">Time</th>
                        <th scope="col" className="px-6 py-3">Vibration</th>
                        <th scope="col" className="px-6 py-3">Magnetic Flux</th>
                        <th scope="col" className="px-6 py-3">RPM</th>
                        <th scope="col" className="px-6 py-3">Acoustics</th>
                        <th scope="col" className="px-6 py-3">Temperature</th>
                        <th scope="col" className="px-6 py-3">Humidity</th>
                        <th scope="col" className="px-6 py-3">Pressure</th>
                        <th scope="col" className="px-6 py-3">Altitude</th>
                        <th scope="col" className="px-6 py-3">Air Quality</th>
                        <th scope="col" className="px-6 py-3">Signal</th>
                        <th scope="col" className="px-6 py-3">Battery</th>
                    </tr>
                </thead>
                <tbody>
                    {sensorData.map((data, index) => (
                        <tr key={index} className="bg-white dark:bg-gray-800">
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