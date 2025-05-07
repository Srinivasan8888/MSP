import React, { memo, useCallback } from 'react';
import { Listbox } from '@headlessui/react';
import { useLineGraph } from '../../Context/LineGraphContext';

const parameters = [
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

const Dropdown = memo(() => {
  const { selectedParameter, setSelectedParameter } = useLineGraph();
  const selected = parameters.find(p => p.id === selectedParameter);

  const handleChange = useCallback((value) => {
    setSelectedParameter(value);
  }, [setSelectedParameter]);

  return (
    <div className="w-full max-w-xs">
      <Listbox value={selectedParameter} onChange={handleChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white/5 py-2 pl-3 pr-10 text-left text-white focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">{selected?.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
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
                value={parameter.id}
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

Dropdown.displayName = 'Dropdown';

export default Dropdown;
