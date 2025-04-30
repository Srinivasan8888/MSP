import mspModel from "../Models/msp.model";

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
    battery === undefined
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newSensor = new mspModel({
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
