import mongoose from "mongoose";
const { Schema } = mongoose;

const sensorSchema = new Schema({
    id: {
        type: String,
        required: false,
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
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true
});

export default mongoose.model('MSP-Data', sensorSchema);