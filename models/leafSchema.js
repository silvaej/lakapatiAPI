import mongoose from "mongoose";

const schema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    image: {
        type: {
            data: Buffer,
            contentType: String,
        },
    },
    gpsLocation: {
        type: {
            type: String,
            default: "Point",
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
        },
    },

    pinPointLocation: {
        type: {
            type: String,
            default: "Point",
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
        },
    },
});

export default mongoose.model("Leaf", schema);
