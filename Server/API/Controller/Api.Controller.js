import mspModel from "../Models/msp.model.js";
import ThresholdModel from "../Models/Threshold.model.js";

// export const dashboardApi = async (req, res) => {
//   try {
//     const { parameter } = req.query; // singular, not 'parameters'

//     // Fetch last 8 entries for card data
//     const recentData = await mspModel.find().sort({ createdAt: -1 }).limit(8);

//     const thresholddata = await ThresholdModel.find()

//     const cardData = {
//       vibration: recentData.map(item => parseFloat(item.vibration)),
//       magneticflux: recentData.map(item => parseFloat(item.magneticflux)),
//       rpm: recentData.map(item => parseFloat(item.rpm)),
//       acoustics: recentData.map(item => parseFloat(item.acoustics)),
//       temperature: recentData.map(item => parseFloat(item.temperature)),
//       humidity: recentData.map(item => parseFloat(item.humidity)),
//       pressure: recentData.map(item => parseFloat(item.pressure)),
//       altitude: recentData.map(item => parseFloat(item.altitude)),
//       airquality: recentData.map(item => parseFloat(item.airquality)),
//       signal: recentData.map(item => parseFloat(item.signal)),
//       battery: recentData.map(item => parseFloat(item.battery)),
//       time: recentData.map(item => item.TIME),
//     };

//     const allData = await mspModel
//       .find()
//       .sort({ createdAt: -1 })
//       .limit(100)
//       .select("-_id -createdAt -updatedAt -__v");

//     let chartData = {};
//     let thresholdData = null;

//     const validFields = [
//       "vibration", "magneticflux", "rpm", "acoustics", "temperature",
//       "humidity", "pressure", "altitude", "airquality", "signal", "battery"
//     ];

//     if (parameter && validFields.includes(parameter)) {
//       const selectedData = await mspModel
//         .find()
//         .sort({ createdAt: -1 })
//         .limit(100)
//         .select({ [parameter]: 1, TIME: 1 });

//       chartData = {
//         [parameter]: selectedData.map(item => parseFloat(item[parameter])),
//         time: selectedData.map(item => item.TIME)
//       };

//       // Get threshold data for the selected parameter
//       thresholdData = await ThresholdModel.find({ parameter: parameter });
//     }

//     res.status(200).json({
//       cardData,
//       allData,
//       chartData,
//       thresholdData
//     });

//   } catch (error) {
//     console.error("Dashboard API error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const dashboardApi = async (req, res) => {
  try {
    
    const { parameter } = req.query;

    // Fetch last 8 entries for card data
    const recentData = await mspModel.find().sort({ createdAt: -1 }).limit(8);

    const thresholddata = await ThresholdModel.find();

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
    let thresholdData = null;

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

      thresholdData = await ThresholdModel.find({ parameter });
    }

    // ======== Signal series grouped by hour (last 8 available hours) ==========
    const rawSignalSeries = await mspModel.aggregate([
      {
        $addFields: {
          hour: {
            $dateToString: {
              format: "%Y-%m-%d %H:00:00",
              date: "$createdAt",
              timezone: "UTC"
            }
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: "$hour",
          signal: { $first: "$signal" },
          timestamp: { $first: "$createdAt" }
        }
      },
      {
        $sort: { _id: -1 }
      },
      {
        $limit: 8
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const signalSeries = rawSignalSeries.map(item => {
      const date = new Date(item.timestamp);
      const formattedTime = date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata' // Change if needed
      });

      return {
        signal: parseFloat(item.signal),
        timestamp: item.timestamp,
        formattedTime
      };
    });

    res.status(200).json({
      cardData,
      allData,
      chartData,
      thresholdData,
      signalSeries
    });

  } catch (error) {
    console.error("Dashboard API error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const dashboardApi2 = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    console.log("Headers received:", req.headers);
    console.log("User ID from header:", userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required in headers" });
    }

    const { parameter } = req.query;

    // Fetch last 8 entries for card data filtered by id
    const recentData = await mspModel.find({ id: userId }).sort({ createdAt: -1 }).limit(8);
    console.log("Recent data query result:", recentData);

    const thresholddata = await ThresholdModel.find({ id: userId });
    console.log("Threshold data query result:", thresholddata);

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
      .find({ id: userId })
      .sort({ createdAt: -1 })
      .limit(100)
      .select("-_id -createdAt -updatedAt -__v");

    let chartData = {};
    let thresholdData = null;

    const validFields = [
      "vibration", "magneticflux", "rpm", "acoustics", "temperature",
      "humidity", "pressure", "altitude", "airquality", "signal", "battery"
    ];

    if (parameter && validFields.includes(parameter)) {
      const selectedData = await mspModel
        .find({ id: userId })
        .sort({ createdAt: -1 })
        .limit(100)
        .select({ [parameter]: 1, TIME: 1 });

      chartData = {
        [parameter]: selectedData.map(item => parseFloat(item[parameter])),
        time: selectedData.map(item => item.TIME)
      };

      thresholdData = await ThresholdModel.find({ id: userId, parameter });
    }

    // ======== Signal series grouped by hour (last 8 available hours) ==========
    const rawSignalSeries = await mspModel.aggregate([
      {
        $match: { id: userId }
      },
      {
        $addFields: {
          hour: {
            $dateToString: {
              format: "%Y-%m-%d %H:00:00",
              date: "$createdAt",
              timezone: "UTC"
            }
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: "$hour",
          signal: { $first: "$signal" },
          timestamp: { $first: "$createdAt" }
        }
      },
      {
        $sort: { _id: -1 }
      },
      {
        $limit: 8
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const signalSeries = rawSignalSeries.map(item => {
      const date = new Date(item.timestamp);
      const formattedTime = date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      });

      return {
        signal: parseFloat(item.signal),
        timestamp: item.timestamp,
        formattedTime
      };
    });

    res.status(200).json({
      cardData,
      allData,
      chartData,
      thresholdData,
      signalSeries
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

export const getUniqueIds = async (req, res) => {
  try {
   
    const uniqueIds = await mspModel.distinct("id");
    res.status(200).json(uniqueIds);
  } catch (error) {
    console.error("Error fetching unique IDs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signalSeries = async (req, res) => {
  try {
    const rawData = await mspModel.aggregate([
      {
        $addFields: {
          hour: {
            $dateToString: {
              format: "%Y-%m-%d %H:00:00",
              date: "$createdAt",
              timezone: "UTC"
            }
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: "$hour",
          signal: { $first: "$signal" },
          timestamp: { $first: "$createdAt" }
        }
      },
      {
        $sort: { _id: -1 }
      },
      {
        $limit: 8
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Convert to 12-hour format using JS
    const formattedData = rawData.map(item => {
      const date = new Date(item.timestamp);
      const options = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata' // Change if needed
      };
      return {
        ...item,
        formattedTime: date.toLocaleString('en-US', options)
      };
    });

    res.status(200).json({
      success: true,
      message: "Last 8 available signal values by hour",
      data: formattedData
    });

  } catch (error) {
    console.error("Error in signalSeries:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

export const ApiController = {
  dashboardApi,
  chartDate,
  chartLive,
  getUniqueIds,
  signalSeries
};
