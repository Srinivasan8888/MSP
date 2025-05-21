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
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(400).json({ message: "User ID is required in headers" });
    }
    const { parameter } = req.query;
    
    // Fetch last 8 entries for card data
    const recentData = await mspModel.find({ id: userId }).sort({ createdAt: -1 }).limit(8);

    const thresholddata = await ThresholdModel.find({ id: userId });

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

      thresholdData = await ThresholdModel.find({ parameter });
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

// export const allchartDate = async (req, res) => {
//   const { startdate, enddate } = req.query;
//   const userId = req.headers['x-user-id'];
//   if (!userId) {
//     return res.status(400).json({ message: "User ID is required in headers" });
//   }
//   try {
//     const startDate = new Date(startdate);
//     const endDate = new Date(enddate);

//     const validFields = [
//       "vibration", "magneticflux", "rpm", "acoustics", "temperature",
//       "humidity", "pressure", "altitude", "airquality", "signal", "battery"
//     ];

//     if (!validFields.includes(parameter)) {
//       return res.status(400).json({ message: "Invalid parameter" });
//     }

//     const data = await mspModel.find({
//       id: userId,
//       [parameter]: { $exists: true },
//       createdAt: {
//         $gte: startDate,
//         $lt: endDate
//       }
//     }).sort({ createdAt: 1 }).select({ [parameter]: 1, createdAt: 1 });

//     const chartData = {
//       [parameter]: data.map(item => parseFloat(item[parameter])),
//       time: data.map(item => item.createdAt)
//     };

//     res.status(200).json({ chartData });
//   } catch (error) {
//     console.error("Chart Date API error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const allchartDate = async (req, res) => {
  // Destructure startdate and enddate from query parameters
  const { startdate, enddate } = req.query;
  // Get userId from request headers
  const userId = req.headers['x-user-id'];

  // Validate presence of userId
  if (!userId) {
    return res.status(400).json({ message: "User ID is required in headers" });
  }

  // Validate presence of startdate and enddate
  if (!startdate || !enddate) {
    return res.status(400).json({ message: "Start date and end date query parameters are required" });
  }

  try {
    // Parse date strings into Date objects
    const startDate = new Date(startdate);
    const endDate = new Date(enddate);

    // Define the list of fields that are considered chartable and should be fetched
    const chartableFields = [
      "vibration", "magneticflux", "rpm", "acoustics", "temperature",
      "humidity", "pressure", "altitude", "airquality", "signal", "battery"
    ];

    // Construct the select string for Mongoose to fetch only necessary fields
    // This improves query performance by not fetching unnecessary data
    const selectFields = chartableFields.join(' ') + ' createdAt';

    // Fetch data from the database (assuming mspModel is your Mongoose model)
    const fetchedData = await mspModel.find({
      id: userId, // Filter by user ID
      createdAt: { // Filter by date range
        $gte: startDate, // Greater than or equal to start date
        $lt: endDate     // Less than end date
      }
    })
    .sort({ createdAt: 1 }) // Sort data by creation time
    .select(selectFields)   // Select only the specified fields
    .lean();                // Use .lean() for plain JavaScript objects and better performance

    // Initialize chartData object
    // The 'time' array will store all the createdAt timestamps
    const chartData = {
      time: fetchedData.map(item => item.createdAt)
    };

    // Populate data for each chartable field
    chartableFields.forEach(field => {
      // For each field, map over the fetchedData to extract its values
      // If a document has the field and it's not null, parse it as a float
      // Otherwise, use null (which is often better for charting libraries than NaN)
      chartData[field] = fetchedData.map(item =>
        item[field] != null ? parseFloat(item[field]) : null
      );
    });

    // Send the structured chart data in the response
    res.status(200).json({ chartData });

  } catch (error) {
    // Log the error for debugging purposes
    console.error("Chart Date API error:", error);
    // Send a generic server error response
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const chartDate = async (req, res) => {
  const { parameter, startdate, enddate } = req.query;
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(400).json({ message: "User ID is required in headers" });
  }
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
      id: userId,
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
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(400).json({ message: "User ID is required in headers" });
  }

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
      .find({ id: userId, [parameter]: { $exists: true } })
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

// export const signalSeries = async (req, res) => {
//   try {
//     const rawData = await mspModel.aggregate([
//       {
//         $addFields: {
//           hour: {
//             $dateToString: {
//               format: "%Y-%m-%d %H:00:00",
//               date: "$createdAt",
//               timezone: "UTC"
//             }
//           }
//         }
//       },
//       {
//         $sort: { createdAt: -1 }
//       },
//       {
//         $group: {
//           _id: "$hour",
//           signal: { $first: "$signal" },
//           timestamp: { $first: "$createdAt" }
//         }
//       },
//       {
//         $sort: { _id: -1 }
//       },
//       {
//         $limit: 8
//       },
//       {
//         $sort: { _id: 1 }
//       }
//     ]);

//     // Convert to 12-hour format using JS
//     const formattedData = rawData.map(item => {
//       const date = new Date(item.timestamp);
//       const options = {
//         hour: 'numeric',
//         minute: '2-digit',
//         hour12: true,
//         timeZone: 'Asia/Kolkata' // Change if needed
//       };
//       return {
//         ...item,
//         formattedTime: date.toLocaleString('en-US', options)
//       };
//     });

//     res.status(200).json({
//       success: true,
//       message: "Last 8 available signal values by hour",
//       data: formattedData
//     });

//   } catch (error) {
//     console.error("Error in signalSeries:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//       error: error.message
//     });
//   }
// };

export const ApiController = {
  dashboardApi,
  chartDate,
  chartLive,
  getUniqueIds, 
  allchartDate
};