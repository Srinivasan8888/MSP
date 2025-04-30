import Report from '../Models/ReportModel.js';
import Frequency from '../Models/Alertfrequency.js'
import User from '../Models/User.model.js';
import setAlert from '../Models/SetAlertModel.js'
import SetAlertfrequency from '../Models/SetAlertfrequency.js';
import UserAlertModel from '../Models/UserAlertModel.js';
import ColorRangeModel from '../Models/ColorRangeModel.js';
import bcrypt from 'bcrypt';

export const createReport = async (req, res) => {
    const { name, email, employeeNo } = req.body;
    if (!name || !email || !employeeNo) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const report = await Report.create({ name, email, employeeNo });
        res.status(201).json({
            message: "Sensor data created successfully.",
            data: report,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const SaveAlertRange = async (req, res)=> {
    const {info, warning, critical, email } = req.body;
    if(!info || !warning || !critical || !email ) {
        return res.status(400).json({ message: 'All the fields are required'});
    }
    try {
        const savealert = await UserAlertModel.create({info, warning, critical, email });
        res.status(201).json({
            message: 'Alerts Limit have been saved successfully.',
            data: savealert,
        })
        
    } catch (error) {
        res.status(500).json({ message: error.message});
        
    }
}

export const createAlert = async (req, res) => {
    const { name, email, employeeNo } = req.body;
    if (!name || !email || !employeeNo) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const report = await Report.create({ name, email, employeeNo });
        res.status(201).json({
            message: "Sensor data created successfully.",
            data: report,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// export const SetColorRange = async (req, res) => {
//     const { vlmin, vlmax, lmin, lmax, medmin, medmax, highmin, highmax, vhighmin, vhighmax } = req.body;

//     if (!vlmin || !vlmax || !lmin || !lmax || !medmin || !medmax || !highmin || !highmax || !vhighmin || !vhighmax) {
//         return res.status(400).json({ message: 'All fields are required!' });
//     }

//     try {
//         const newColorRange = new ColorRangeModel({
//             vlmin, vlmax, lmin, lmax, medmin, medmax, 
//             highmin, highmax, vhighmin, vhighmax
//         });

//         const savedRange = await newColorRange.save();
        
//         res.status(201).json({
//             message: "Color range saved successfully.",
//             data: savedRange,
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

export const SetColorRange = async (req, res) => {
    const { vlmin, vlmax, lmin, lmax, medmin, medmax, highmin, highmax, vhighmin, vhighmax, email } = req.body;

    // List all required fields
    const requiredFields = [
        { name: 'vlmin', value: vlmin },
        { name: 'vlmax', value: vlmax },
        { name: 'lmin', value: lmin },
        { name: 'lmax', value: lmax },
        { name: 'medmin', value: medmin },
        { name: 'medmax', value: medmax },
        { name: 'highmin', value: highmin },
        { name: 'highmax', value: highmax },
        { name: 'vhighmin', value: vhighmin },
        { name: 'vhighmax', value: vhighmax },
        { name: 'email', value: email }
    ];

    // Check for missing fields
    const missingFields = requiredFields
        .filter(field => field.value === undefined)
        .map(field => field.name);

    if (missingFields.length > 0) {
        return res.status(400).json({ 
            message: `The following fields are missing: ${missingFields.join(', ')}` 
        });
    }

    try {
        const newColorRange = new ColorRangeModel({
            vlmin, vlmax, lmin, lmax, medmin, medmax, 
            highmin, highmax, vhighmin, vhighmax, email
        });

        const savedRange = await newColorRange.save();
        
        res.status(201).json({
            message: "Color range saved successfully.",
            data: savedRange,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createSetAlert = async (req, res) => {
    const { name, email, phoneNo, employeeNo } = req.body;
    if (!name || !email || !employeeNo || !phoneNo) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const datas = await setAlert.create({ name, email, employeeNo, phoneNo });
        res.status(201).json({
            message: "Sensor data created successfully.",
            data: datas,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const alertFrequency = async (req, res) => {
    const { email, frequency, id } = req.body;

    if (!email || !frequency || !id) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newEntry = await Frequency.create({ email, frequency, id });

        res.status(201).json({
            message: "Frequency data saved successfully",
            data: newEntry,
        });
    } catch (error) {
        console.error("Error saving frequency data:", error);
        res.status(500).json({ message: error.message });
    }
};

export const SetAlertFrequency = async (req, res) => {
    const { email, mode, frequency } = req.body;

    if (!email || !frequency || !mode) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newEntry = await SetAlertfrequency.create({ email, frequency, mode });

        res.status(201).json({
            message: "AlertSetFrequency data saved successfully",
            data: newEntry,
        });
    } catch (error) {
        console.error("Error saving AlertSetFrequency data:", error);
        res.status(500).json({ message: error.message });
    }
};


//get request's
export const reportUsers = async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });

        if (!reports || reports.length === 0) {
            return res.status(404).json({ message: "No user reports found" });
        }

        res.status(200).json({
            message: "User reports fetched successfully",
            data: reports,
        });
    } catch (error) {

        console.error("Error fetching user reports:", error);
        res.status(500).json({ message: error.message });
    }
};

export const AlertfreqUsers = async (req, res) => {
    try {
        const reports = await setAlert.find().sort({ createdAt: -1 });

        if (!reports || reports.length === 0) {
            return res.status(404).json({ message: "No user reports found" });
        }

        res.status(200).json({
            message: "User reports fetched successfully",
            data: reports,
        });
    } catch (error) {

        console.error("Error fetching user reports:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getFrequency = async (req, res) => {
    try {
        const frequencyData = await Frequency.find().sort({ createdAt: -1 });
        if (!frequencyData) {
            return res.status(404).json({ message: "No frequency data found for this email" });
        }

        res.status(200).json({
            message: "Frequency data retrieved successfully",
            data: frequencyData,
        });
    } catch (error) {
        console.error("Error fetching frequency data:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getAlertFrequency = async (req, res) => {
    try {

        const Entry = await SetAlertfrequency.find().sort({ createdAt: -1 });
        if (!Entry) {
            return res.status(400).json({ message: 'No data found' });
        }
        res.status(200).json({
            message: "AlertSetFrequency data retrieved successfully",
            data: Entry,
        });

    } catch (error) {
        console.error("Error saving AlertSetFrequency data:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const usersDate = await User.find({}, { password: 0 });
        if (!usersDate) {
            return res.status(404).json({ message: "No frequency data found for this email" });
        }

        res.status(200).json({
            message: "Frequency data retrieved successfully",
            data: usersDate,
        });
    } catch (error) {
        console.error("Error fetching frequency data:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getUserDetails = async (req, res) => {
    const {email} = req.body;
    if(!email){
        return(res.status(500).json({messege: 'email not found!!!'}));
    }
    try {
        const finduserdetail = await User.findOne({ email }, { password: 0 });
        if(!finduserdetail){
            return res.status(404).json({ message: error.message});
        }
        res.status(200).json({
            message: "Frequency data retrieved successfully",
            data: finduserdetail,
        });
    } catch (error) {
        console.error("Error fetching frequency data:", error);
        res.status(500).json({ message: error.message });
    }
}

export const getUserAlertRange = async (req, res)=> {

    try {
        const savealert = await UserAlertModel.find().sort({updated : -1})
        res.status(201).json({
            message: 'Alerts Limit have fetched successfully.',
            data: savealert,
        })
        
    } catch (error) {
        res.status(500).json({ message: error.message});
        
    }
}

export const getColorRangeModel = async (req, res) => {
    try {
        // Fetch latest document, excluding the 'email' field
        const latestAlert = await ColorRangeModel.findOne()
            .sort({ updatedAt: -1 })
            .select('-email'); // Exclude email field

        res.status(200).json({
            message: 'Latest alert fetched successfully.',
            data: latestAlert,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//update request
export const updateReport = async (req, res) => {
    const { name, email, employeeNo } = req.body;
    if (!name || !email || !employeeNo) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    try {
        const report = await Report.findOne({ email: email });
        if (!report) {
            return res.status(404).json({ message: 'Report not found with this email' });
        }
        
        report.name = name;
        report.employeeNo = employeeNo;
        
        const updatedReport = await report.save();
        
        res.status(200).json({
            message: "Report updated successfully.",
            data: updatedReport,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const  updateAlert = async (req, res) => {
    try {
        const { email } = req.params;
        const updateData = req.body;

        // Check if email is being updated and if new email already exists
        if (updateData.email && updateData.email !== email) {
            const existingUser = await Alert.findOne({ email: updateData.email });
            if (existingUser) {
                return res.status(400).json({ message: 'User with this email already exists' });
            }
        }

        const updatedAlert = await Alert.findOneAndUpdate(
            { email },
            updateData,
            { new: true }
        );

        if (!updatedAlert) {
            return res.status(404).json({ message: 'Alert user not found' });
        }

        res.status(200).json({ message: 'Alert user updated successfully', data: updatedAlert });
    } catch (error) {
        res.status(500).json({ message: 'Error updating alert user', error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { email } = req.params; // Extract email from URL params
        const updateData = { ...req.body }; // Clone the request body

        // Prevent updating sensitive fields
        const immutableFields = ['email', 'role']; // Removed 'empid' from this list
        immutableFields.forEach((field) => {
            if (updateData[field]) {
                delete updateData[field];
            }
        });

        // Handle password updates
        if (updateData.password) {
            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(updateData.password, salt);
            updateData.password = hashedPassword;
        }

        // Check if the payload is empty
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields to update",
            });
        }

        // Debugging logs
        console.log("Update Data:", updateData);
        console.log("Email:", email);

        // Update the user in the database
        const updatedUser = await User.findOneAndUpdate(
            { email }, // Find user by email
            { $set: updateData }, // Update only the provided fields
            { new: true, select: '-password' } // Return updated user without password
        );

        // Check if the user exists
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Error updating user:", error);

        if (error.code === 11000) {
            // Handle duplicate key error (e.g., duplicate empid)
            return res.status(400).json({
                success: false,
                message: "Duplicate empid. Please provide a unique value.",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

//delete request
export const deleteReport = async (req, res) => {
    const { email } = req.params;
    
    try {console.log('Attempting to delete report with email:', email);
        const report = await Report.findOne({ email: email });
        console.log('Found report:', report);
        
        if (!report) {   console.log('No report found with email:', email);
            return res.status(404).json({ message: 'Report not found with this email' });
        }
        
        await Report.deleteOne({ email: email });
        console.log('Report deleted successfully');
        res.status(200).json({
            message: "Report deleted successfully.",
        });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteAlert = async (req, res) => {
    try {
        const { email } = req.params;
        const deletedAlert = await Alert.findOneAndDelete({ email });

        if (!deletedAlert) {
            return res.status(404).json({ message: 'Alert user not found' });
        }

        res.status(200).json({ message: 'Alert user deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting alert user', error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
      const { email } = req.params;
      
      const deletedUser = await User.findOneAndDelete({ email });
      
      if (!deletedUser) {
        return res.status(404).json({ 
          success: false,
          message: "User not found" 
        });
      }
      
      return res.status(200).json({
        success: true,
        message: "User deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  };
