import mspModel from "../Models/msp.model.js";

export const dashboardApi = async (req, res) => {
  try {
    const { parameter } = req.query; // singular, not 'parameters'

    // Fetch last 8 entries for card data
    const recentData = await mspModel.find().sort({ createdAt: -1 }).limit(8);

    const cardData = {
      vibration: recentData.map(item => parseFloat(item.vibration)),
      magneticflux: recentData.map(item => parseFloat(item.magneticflux)),
      rpm: recentData.map(item => parseFloat(item.rpm)),
      acoustics: recentData.map(item => parseFloat(item.acoustics)),
      temperature: recentData.map(item => parseFloat(item.temperature)),
      humidity: recentData.map(item => parseFloat(item.humidity)),
      pressure: recentData.map(item => parseFloat(item.pressure)),
      altitude: recentData.map(item => parseFloat(item.altitude)),
      airquality: recentData.map(item => parseFloat(item.airquality)),
      signal: recentData.map(item => parseFloat(item.signal)),
      battery: recentData.map(item => parseFloat(item.battery)),
      time: recentData.map(item => item.TIME),
    };

    const allData = await mspModel
      .find()
      .sort({ createdAt: -1 })
      .limit(100)
      .select("-_id -createdAt -updatedAt -__v");

    let chartData = {};

    const validFields = [
      "vibration", "magneticflux", "rpm", "acoustics", "temperature",
      "humidity", "pressure", "altitude", "airquality", "signal", "battery"
    ];

    if (parameter && validFields.includes(parameter)) {
      const selectedData = await mspModel
        .find()
        .sort({ createdAt: -1 })
        .limit(100)
        .select({ [parameter]: 1, TIME: 1 });

      chartData = {
        [parameter]: selectedData.map(item => parseFloat(item[parameter])),
        time: selectedData.map(item => item.TIME)
      };
    }

    res.status(200).json({
      cardData,
      allData,
      chartData,
    });

  } catch (error) {
    console.error("Dashboard API error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const chartDate = async (req, res) => {
  const { parameter, startdate, enddate } = req.query;

  if (!parameter || !startdate || !enddate) {
    return res.status(400).json({ message: "All parameters are required" });
  }

  try {
    const startDate = new Date(startdate);
    const endDate = new Date(enddate);

    const validFields = [
      "vibration", "magneticflux", "rpm", "acoustics", "temperature",
      "humidity", "pressure", "altitude", "airquality", "signal", "battery"
    ];

    if (!validFields.includes(parameter)) {
      return res.status(400).json({ message: "Invalid parameter" });
    }

    const data = await mspModel.find({
      [parameter]: { $exists: true },
      createdAt: {
        $gte: startDate,
        $lt: endDate
      }
    }).sort({ createdAt: 1 }).select({ [parameter]: 1, createdAt: 1 });

    const chartData = {
      [parameter]: data.map(item => parseFloat(item[parameter])),
      time: data.map(item => item.createdAt)
    };

    res.status(200).json({ chartData });
  } catch (error) {
    console.error("Chart Date API error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const chartLive = async (req, res) => {
  const { parameter } = req.query;

  if (!parameter) {
    return res.status(400).json({ message: "Parameter is required" });
  }

  try {
    const validFields = [
      "vibration", "magneticflux", "rpm", "acoustics", "temperature",
      "humidity", "pressure", "altitude", "airquality", "signal", "battery"
    ];

    if (!validFields.includes(parameter)) {
      return res.status(400).json({ message: "Invalid parameter" });
    }

    // Fetch the latest 100 records for the selected parameter
    const data = await mspModel
      .find({ [parameter]: { $exists: true } })
      .sort({ createdAt: -1 })
      .limit(1)
      .select({ [parameter]: 1, TIME: 1 });

    const chartData = {
      [parameter]: data.map(item => parseFloat(item[parameter])).reverse(),
      time: data.map(item => item.TIME).reverse()
    };

    res.status(200).json({ chartData });
  } catch (error) {
    console.error("Chart Live API error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const ApiController = {
  dashboardApi,
  chartDate,
  chartLive
};
