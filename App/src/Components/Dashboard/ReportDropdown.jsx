import React, { memo, useState } from 'react';
import { Listbox } from '@headlessui/react';

const parameters = [
  { id: 'all', name: 'All' },
  { id: 'vibration', name: 'Vibration' },
  { id: 'magneticflux', name: 'Magnetic Flux' },
  { id: 'rpm', name: 'RPM' },
  { id: 'acoustics', name: 'Acoustics' },
  { id: 'temperature', name: 'Temperature' },
  { id: 'humidity', name: 'Humidity' },
  { id: 'pressure', name: 'Pressure' },
  { id: 'altitude', name: 'Altitude' },
  { id: 'airquality', name: 'Air Quality' },
  { id: 'signal', name: 'Signal' },
  { id: 'battery', name: 'Battery' },
];

const ReportDropdown = memo(({ onParameterChange }) => {
  const [selected, setSelected] = useState(parameters[0]);

  const handleChange = (value) => {
    setSelected(value);
    if (onParameterChange) {
      onParameterChange(value);
    }
  };

  return (
    <div className="w-full max-w-xs">
      <Listbox value={selected} onChange={handleChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left text-white rounded-lg cursor-default bg-white/5 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">{selected.name}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              ▼
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#102d49] py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50">
            {parameters.map((parameter) => (
              <Listbox.Option
                key={parameter.id}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-white/10 text-white' : 'text-white/70'
                  }`
                }
                value={parameter}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium text-white' : 'font-normal'}`}>
                      {parameter.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                        ✓
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
});

ReportDropdown.displayName = 'ReportDropdown';

export default ReportDropdown; 