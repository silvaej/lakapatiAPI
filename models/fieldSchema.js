import mongoose from "mongoose";

const field = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    leaves: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Leaf",
            required: true,
        },
    ],
});

export default mongoose.model("Field", field);
