import mongoose from "mongoose";
const { Schema } = mongoose;

const ThresholdSchema = new Schema(
    {
        id: {
            type: String,
            required: false,
        },
        parameter: {
            type: String,
            required: true
        },
        minValue: {
            type: String,
            required: true
        },
        maxValue: {
            type: String,
            required: true
        }
    }
);

export default mongoose.model("Threshold-Values", ThresholdSchema)