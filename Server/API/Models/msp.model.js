import mongoose from "mongoose";
const { Schema } = mongoose;

const MSPSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    vibration: {
        type: String,
        default: null,
    },
    magneticflux: {
        type: String,
        default: null,
    },
    rpm: {
        type: String,
        default: null,
    },
    acoustics: {
        type: String,
        default: null,
    },
    temperature: {
        type: String,
        default: null,
    },
    humidity: {
        type: String,
        default: null,
    },
    pressure: {
        type: String,
        default: null,
    },
    altitude: {
        type: String,
        default: null,
    },
    airquality: {
        type: String,
        default: null,
    },
    signal: {
        type: String, 
        default: null,
    },
    battery: {
        type: String,
        default: null,
    },
    TIME: {
        type: String,
        default: null,
    }
}, {
    timestamps: true
});

export default mongoose.model('MSP-Data', MSPSchema);