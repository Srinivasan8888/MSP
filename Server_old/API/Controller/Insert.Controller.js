import MSPSchema from '../Models/msp.model.js'
import ThresholdModel from '../Models/Threshold.model.js';

export const createMsp = async (req, res) => {
  const {
    id,
    vibration,
    magneticflux,
    rpm,
    acoustics,
    temperature,
    humidity,
    pressure,
    altitude,
    airquality,
    signal,
    battery,
    time,
  } = req.query;

  // Validate required fields
  if (
    !id ||
    vibration === undefined ||
    magneticflux === undefined ||
    rpm === undefined ||
    acoustics === undefined ||
    temperature === undefined ||
    humidity === undefined ||
    pressure === undefined ||
    altitude === undefined ||
    airquality === undefined ||
    signal === undefined ||
    battery === undefined ||
    time === undefined
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newSensor = new MSPSchema({
      id,
      vibration: String(vibration),
      magneticflux: String(magneticflux),
      rpm: String(rpm),
      acoustics: String(acoustics),
      temperature: String(temperature),
      humidity: String(humidity),
      pressure: String(pressure),
      altitude: String(altitude),
      airquality: String(airquality),
      signal: String(signal),
      battery: String(battery),
      TIME: String(time)
    });

    const savedSensor = await newSensor.save();

    res.status(201).json({
      message: "Sensor data created successfully.",
      data: savedSensor,
    });
  } catch (error) {
    console.error("Error saving sensor data:", error);
    res.status(500).json({ error: "Failed to save sensor data." });
  }
};

export const createThreshold = async (req, res) => {
  const {parameter, minValue, maxValue, id} = req.query;

  if(!parameter || !minValue || !maxValue || !id){
    return res.status(400).json({message: 'All the fields are required!!!'})
  }

  // Validate numeric values
  const min = Number(minValue);
  const max = Number(maxValue);
  
  if (isNaN(min) || isNaN(max)) {
    return res.status(400).json({message: 'minValue and maxValue must be valid numbers'});
  }

  try {
    // Check if threshold already exists for this parameter
    const existingThreshold = await ThresholdModel.findOne({ parameter: String(parameter) });

    if (existingThreshold) {
      // Update existing threshold
      existingThreshold.minValue = min;
      existingThreshold.maxValue = max;
      existingThreshold.id = id;
      
      const updatedThreshold = await existingThreshold.save();
      res.status(200).json({
        message: "Threshold values updated successfully",
        data: updatedThreshold
      });
    } else {
      // Create new threshold
      const saveThreshold = ThresholdModel({
        id,
        parameter: String(parameter),
        minValue: min,
        maxValue: max
      });

      const savedThreshold = await saveThreshold.save();
      res.status(201).json({
        message: "New threshold values created successfully",
        data: savedThreshold
      });
    }
  } catch (error) {
    console.error("Error saving threshold data:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error: ' + error.message });
    }
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Duplicate entry found' });
    }
    res.status(500).json({ error: 'Failed to save threshold data' });
  }
}