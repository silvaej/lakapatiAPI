import express from "express";
import User from "../../../models/userSchema.js";
import Data from "../../../models/fieldSchema.js";
import mapData from "../../../scripts/geoMapping.js";
import sendEmail from "../../../scripts/sendEmail.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello World");
});

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
            res.json({
                passed: true,
                message: "User created successfully",
            });
        })
        .catch((err) => {
            res.json({
                passed: false,
                message: "UserExistsError",
            });
        });
});

router.post("/api/v1/login", (req, res) => {
    // parse the request body
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username })
        .then((user) => {
            console.log(user);
            if (!user) {
                res.json({
                    passed: false,
                    message: "UserNotFoundError",
                    username: "",
                    email: "",
                    name: "",
                });
            } else {
                if (user.password === password) {
                    res.json({
                        passed: true,
                        message: "User logged in successfully",
                        username: user.username,
                        email: user.email,
                        name: user.name,
                    });
                } else {
                    res.json({
                        passed: false,
                        message: "PasswordError",
                        username: "",
                        email: "",
                        name: "",
                    });
                }
            }
        })
        .catch((err) => {
            res.json({
                passed: false,
                message: "InternalError",
                username: "",
                email: "",
                name: "",
            });
        });
});

router.post("/api/v1/upload", async (req, res) => {
    // parse the request body
    const username = req.body.username;
    const email = req.body.email;
    const title = req.body.title;
    const description = req.body.description;
    const data = req.body.data;

    mapData(data)
        .then((map) => {
            const query = new Data({
                username,
                email,
                title,
                description,
                data: map,
            });

            const id = query._id;

            query.save();

            return { map, email, id };
        })
        .then((output) => {
            const { map, email, id } = output;
            sendEmail(email, map, id)
                .then((result) => {
                    res.json({
                        passed: true,
                        message: result,
                    });
                })
                .catch((err) => {
                    res.json({
                        passed: false,
                        message: err,
                    });
                });
        });
});

router.get("/api/v1/map", (req, res) => {
    // parse the query string
    const id = req.query.id;

    Data.findOne({ _id: id })
        .then((data) => {
            if (!data) {
                res.json({
                    passed: false,
                    message: "DataNotFoundError",
                    title: "",
                    description: "",
                });
            } else {
                // parse data
                const title = data.title;
                const description = data.description;

                res.json({
                    passed: true,
                    message: "Successful",
                    title,
                    description,
                });
            }
        })
        .catch((err) => {
            res.json({
                passed: false,
                message: "MapNotFoundError",
                title: "",
                description: "",
            });
        });
});

router.get("/api/v1/resend", (req, res) => {
    // parse the query string
    const email = req.query.email;
    const id = req.query.id;

    Data.findOne({ _id: id })
        .then((data) => {
            if (!data) {
                console.log("here");
                res.json({
                    passed: false,
                    message: "DataNotFoundError",
                });
            } else {
                // get data
                const attachment = data.data;

                // send email
                sendEmail(email, attachment, id)
                    .then((result) => {
                        res.json({
                            passed: true,
                            message: "Successful",
                        });
                    })
                    .catch((err) => {
                        res.json({
                            passed: false,
                            message: err,
                        });
                    });
            }
        })
        .catch((err) => {
            res.json({
                passed: false,
                message: "InternalError",
            });
        });
});

export default router;
