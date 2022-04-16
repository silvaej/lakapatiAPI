import mongoose from "mongoose";

const field = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    title: {
        type: String,
        required: true,
        default: "Untitled",
    },
    description: {
        type: String,
        required: true,
        default: "no description",
    },
    data: {
        type: Buffer,
        required: true,
    },
});

export default mongoose.model("Data", field);
