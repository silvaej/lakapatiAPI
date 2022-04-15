import express from "express";
import User from "../../../models/userSchema.js";

const router = express.Router();

router.post("/api/v1/register", (req, res) => {
    // parse the request body
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const query = new User({
        name,
        username,
        email,
        password,
    });

    query
        .save()
        .then(() => {
            res.status(200).json({
                message: "User created successfully",
            });
        })
        .catch((err) => {
            res.status(500).json({
                type: "UserExistsError",
                message: "User already exists",
            });
        });
});

router.post("/api/v1/login", (req, res) => {
    // parse the request body
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username })
        .then((user) => {
            if (!user) {
                res.status(401).json({
                    type: "UserNotFoundError",
                    message: "User not found",
                });
            } else {
                if (user.password === password) {
                    res.status(200).json({
                        message: "User logged in successfully",
                    });
                } else {
                    res.status(401).json({
                        type: "PasswordError",
                        message: "Password is incorrect",
                    });
                }
            }
        })
        .catch((err) => {
            res.status(500).json({
                type: "InternalError",
                message: "Internal server error",
            });
        });
});

router.post("/api/v1/upload", (req, res) => {
    console.log(req.body);
    console.log(req.files);

    res.send("DONE!");
});

router.get("/api/v1/info", (req, res) => {
    res.send("info");
});

export default router;
