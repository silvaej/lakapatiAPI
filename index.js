import express from "express";
import cors from "cors";
import upload from "express-fileupload";

import router from "./routes/api/v1/route.js";
import connectDB from "./db/conn.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(upload());
app.use(router);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
