import React from 'react'

const Signal = ({ signal = 100, height = '35px', width = '4px' }) => {
    const getSignalLevel = (signalValue) => {
      const numValue = parseFloat(signalValue);
      if (isNaN(numValue) || numValue === 0) return 0;
      if (numValue <= 25) return 1;
      if (numValue <= 50) return 2;
      if (numValue <= 75) return 3;
      return 4;
    };

    const getSignalColor = (index) => {
      const level = getSignalLevel(signal);
      if (level === 1) return 'bg-red-500';
      if (level === 2) return index < 2 ? 'bg-orange-500' : 'bg-gray-500';
      if (level === 3) return index < 3 ? 'bg-yellow-500' : 'bg-gray-500';
      return 'bg-green-500';
    };

    return (
        <div className="group inline-flex items-end justify-end p-1" style={{ height }}>
          {[0, 1, 2, 3].map((index) => {
            const level = getSignalLevel(signal);
            const isActive = level >= index + 1;
            const heights = ['h-[25%]', 'h-[50%]', 'h-[75%]', 'h-full'];
            const delays = ['delay-[100ms]', 'delay-[200ms]', 'delay-[300ms]', 'delay-[400ms]'];
            const durations = ['duration-300', 'duration-250', 'duration-200', 'duration-150'];
    
            return (
              <span
                key={index}
                className={`
                  ml-0.5 rounded-sm
                  origin-bottom transition-all scale-y-0
                  ${isActive ? 'opacity-100 scale-y-100' : 'opacity-20 scale-y-100'}
                  ${heights[index]}
                  ${delays[index]}
                  ${durations[index]}
                  ${getSignalColor(index)}
                  transition-timing-function-[cubic-bezier(.17,.67,.42,1.3)]
                `}
                style={{ width }}
              />
            );
          })}
        </div>
      );
    };

    // group-hover:scale-y-100
    // group-hover:opacity-20

export default Signal