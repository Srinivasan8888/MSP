import React from "react";
import { GaugeComponent } from 'react-gauge-component'

const Gauge = () => {
  
  return (
    <>
      <div className="2xl:w-[155px] xl:w-[120px] h-full">
              <p className="text-white text-center text-xs 2xl:text-base">RPM</p>
              <GaugeComponent
                GaugeComponent
                value={50}
                type="radial"
                labels={{
                  tickLabels: {
                    type: "inner",
                    ticks: [
                      { value: 20 },
                      { value: 40 },
                      { value: 60 },
                      { value: 80 },
                      { value: 100 },
                    ],
                  },
                }}
                arc={{
                  colorArray: ["#5BE12C", "#EA4228"],
                  subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
                  padding: 0.02,
                  width: 0.3,
                }}
                pointer={{
                  elastic: true,
                  animationDelay: 0,
                }}
              />
            </div>
            <div className="2xl:w-[155px] xl:w-[120px] h-full">
              <p className="text-white text-center text-xs 2xl:text-base">Acoustics</p>
              <GaugeComponent
                GaugeComponent
                value={50}
                type="radial"
                labels={{
                  tickLabels: {
                    type: "inner",
                    ticks: [
                      { value: 20 },
                      { value: 40 },
                      { value: 60 },
                      { value: 80 },
                      { value: 100 },
                    ],
                  },
                }}
                arc={{
                  colorArray: ["#5BE12C", "#EA4228"],
                  subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
                  padding: 0.02,
                  width: 0.3,
                }}
                pointer={{
                  elastic: true,
                  animationDelay: 0,
                }}
              />
            </div>
            <div className="2xl:w-[155px] xl:w-[120px] h-full">
              <p className="text-white text-center text-xs 2xl:text-base">Humidity</p>
              <GaugeComponent
                GaugeComponent
                value={50}
                type="radial"
                labels={{
                  tickLabels: {
                    type: "inner",
                    ticks: [
                      { value: 20 },
                      { value: 40 },
                      { value: 60 },
                      { value: 80 },
                      { value: 100 },
                    ],
                  },
                }}
                arc={{
                  colorArray: ["#5BE12C", "#EA4228"],
                  subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
                  padding: 0.02,
                  width: 0.3,
                }}
                pointer={{
                  elastic: true,
                  animationDelay: 0,
                }}
              />
            </div>
            <div className="2xl:w-[155px] xl:w-[120px] h-full">
              <p className="text-white text-center text-xs 2xl:text-base">Pressure</p>
              <GaugeComponent
                GaugeComponent
                value={50}
                type="radial"
                labels={{
                  tickLabels: {
                    type: "inner",
                    ticks: [
                      { value: 20 },
                      { value: 40 },
                      { value: 60 },
                      { value: 80 },
                      { value: 100 },
                    ],
                  },
                }}
                arc={{
                  colorArray: ["#5BE12C", "#EA4228"],
                  subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
                  padding: 0.02,
                  width: 0.3,
                }}
                pointer={{
                  elastic: true,
                  animationDelay: 0,
                }}
              />
            </div>
            <div className="2xl:w-[155px] xl:w-[120px] h-full">
              <p className="text-white text-center text-xs 2xl:text-base">Air Qualtiy</p>
              <GaugeComponent
                GaugeComponent
                value={50}
                type="radial"
                labels={{
                  tickLabels: {
                    type: "inner",
                    ticks: [
                      { value: 20 },
                      { value: 40 },
                      { value: 60 },
                      { value: 80 },
                      { value: 100 },
                    ],
                  },
                }}
                arc={{
                  colorArray: ["#5BE12C", "#EA4228"],
                  subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
                  padding: 0.02,
                  width: 0.3,
                }}
                pointer={{
                  elastic: true,
                  animationDelay: 0,
                }}
              />
            </div>
            <div className="2xl:w-[155px] xl:w-[120px] h-full">
              <p className="text-white text-center text-xs 2xl:text-base">Battery</p>
              <GaugeComponent
                GaugeComponent
                value={50}
                type="radial"
                labels={{
                  tickLabels: {
                    type: "inner",
                    ticks: [
                      { value: 20 },
                      { value: 40 },
                      { value: 60 },
                      { value: 80 },
                      { value: 100 },
                    ],
                  },
                }}
                arc={{
                  colorArray: ["#5BE12C", "#EA4228"],
                  subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
                  padding: 0.02,
                  width: 0.3,
                }}
                pointer={{
                  elastic: true,
                  animationDelay: 0,
                }}
              />
            </div>
            </>
  );
};

export default Gauge;
