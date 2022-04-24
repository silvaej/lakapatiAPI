import pkg from "canvas";
import Canvas from "canvas";
const { createCanvas, loadImage } = pkg;
import {
    generateAbsolutePosition,
    calculateDistance,
} from "./geoSpatialFunctions.js";

import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const mapData = async (data) => {
    const canvas = createCanvas(4000, 3000);
    const ctx = canvas.getContext("2d");
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const icons = {
        cbb: await loadImage(path.join(__dirname, "../src/leaf (0).png")),
        cbsd: await loadImage(path.join(__dirname, "../src/leaf (1).png")),
        cgm: await loadImage(path.join(__dirname, "../src/leaf (2).png")),
        cmd: await loadImage(path.join(__dirname, "../src/leaf (3).png")),
        healthy: await loadImage(path.join(__dirname, "../src/leaf (4).png")),
    };

    //add white background to the canvas
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let MAX_X = 0;
    let MAX_Y = 0;
    let MIN_X = Number.MAX_VALUE;
    let MIN_Y = Number.MAX_VALUE;

    // const COLOR_MAP = {
    //     cbb: "#ff5c77",
    //     cbsd: "#ffec59",
    //     cgm: "#ffa23a",
    //     cmd: "#74737a",
    //     healthy: "#4dd091",
    // };

    const markings = [];

    for (let imageData of data) {
        const { gpsLocation, imageLocation, classification } = imageData;
        const { longitude, latitude } = gpsLocation;

        const { x, y } = imageLocation;

        const { longitudeAbsoluteDegrees, latitudeAbsoluteDegrees } =
            generateAbsolutePosition(
                latitude,
                longitude,
                x,
                y,
                imageData.width,
                imageData.height
            );

        // Checking max and min values
        if (longitudeAbsoluteDegrees > MAX_X) {
            MAX_X = longitudeAbsoluteDegrees;
        }
        if (longitudeAbsoluteDegrees < MIN_X) {
            MIN_X = longitudeAbsoluteDegrees;
        }
        if (latitudeAbsoluteDegrees > MAX_Y) {
            MAX_Y = latitudeAbsoluteDegrees;
        }
        if (latitudeAbsoluteDegrees < MIN_Y) {
            MIN_Y = latitudeAbsoluteDegrees;
        }

        // Update markings
        markings.push({
            longitudeAbsoluteDegrees,
            latitudeAbsoluteDegrees,
            classification,
        });
    }

    // Add padding
    // const PADDING = 0.2;
    // MIN_X -= PADDING;
    // MIN_Y -= PADDING;
    // MAX_X += PADDING;
    // MAX_Y += PADDING;

    // Calculate the size of the image in meters
    const canvasWidthMeters = calculateDistance(MIN_Y, MIN_X, MIN_Y, MAX_X);
    const canvasHeightMeters = calculateDistance(MIN_Y, MIN_X, MAX_Y, MIN_X);

    // Calculate the start of the canvas in degrees
    let canvasStartLongitudeDegrees;
    let canvasStartLatitudeDegrees;
    let canvasEndLongitudeDegrees;
    let canvasEndLatitudeDegrees;
    let degreePerPixel;
    let canvasWidth;
    let canvasHeight;

    if (canvasWidthMeters > canvasHeightMeters) {
        // calculate the width of the image in pixels based on the height of the canvas while keeping the aspect ratio 4:3
        canvasWidth = canvasWidthMeters;
        canvasHeight = canvasWidth * (3 / 4);

        degreePerPixel = (MAX_X - MIN_X) / 4000; // degree per pixel

        // calculate the start of the canvas in pixels in degrees
        canvasStartLongitudeDegrees = MIN_X;
        // need to adjust to conpensate for the aspect ratio
        canvasStartLatitudeDegrees = MIN_Y + degreePerPixel * 3000;

        // calculate the end of the canvas in pixels in degrees
        canvasEndLongitudeDegrees = MAX_X;
        // need to adjust to conpensate for the aspect ratio+
        canvasEndLatitudeDegrees = MIN_Y;
    } else {
        // calculate the height of the image in pixels based on the width of the canvas while keeping the aspect ratio 4:3
        canvasHeight = canvasHeightMeters;
        canvasWidth = canvasHeight * (4 / 3);

        degreePerPixel = (MAX_Y - MIN_Y) / 3000; // degree per pixel

        // calculate the start of the canvas in pixels in degrees
        canvasStartLongitudeDegrees = MIN_X;
        // need to adjust to conpensate for the aspect ratio
        canvasStartLatitudeDegrees = MAX_Y;

        // calculate the end of the canvas in pixels in degrees
        canvasEndLongitudeDegrees = MIN_X + degreePerPixel * 4000;
        // need to adjust to conpensate for the aspect ratio+
        canvasEndLatitudeDegrees = MIN_Y;
    }

    // Add 200 pixel padding on the edges
    // canvasStartLongitudeDegrees -= degreePerPixel * 200;
    // canvasStartLatitudeDegrees -= degreePerPixel * 200;
    // canvasEndLatitudeDegrees += degreePerPixel * 200;
    // canvasEndLongitudeDegrees += degreePerPixel * 200;

    // draw 10 x 10 grid lines with coordinates relative to the actual gps location with labels
    const gridLines = [];
    const gridLabels = [];
    const gridLineWidth = 0.5;
    const gridLineColor = "#000000";
    const gridLabelColor = "#000000";
    const gridLabelFontSize = 32;

    const gridLineSpacing = 500;
    const gridLabelSpacing = 500;

    let gridLineX = 0;
    let gridLineY = 0;
    let gridLabelX = 0; //canvasEndLatitudeDegrees
    let gridLabelY = 0; // canvasStartLongitudeDegrees;

    while (gridLineY < 3000) {
        gridLines.push({
            x1: gridLineX,
            y1: gridLineY,
            x2: 4000,
            y2: gridLineY,
            color: gridLineColor,
            width: gridLineWidth,
        });
        gridLabels.push({
            // convert x to longitude
            x: gridLabelX,
            y: gridLabelY,
            text: `${(
                canvasStartLatitudeDegrees -
                gridLabelY * degreePerPixel
            ).toFixed(4)}°`,
            color: gridLabelColor,
            fontSize: gridLabelFontSize,
        });
        gridLineY += gridLineSpacing;
        gridLabelY += gridLabelSpacing;
    }
    while (gridLineX < 4000) {
        gridLines.push({
            x1: gridLineX,
            y1: 0,
            x2: gridLineX,
            y2: 3000,
            color: gridLineColor,
            width: gridLineWidth,
        });
        gridLabels.push({
            x: gridLabelX,
            y: gridLabelY,
            text: `${(
                canvasStartLongitudeDegrees +
                gridLabelX * degreePerPixel
            ).toFixed(4)}°`,
            color: gridLabelColor,
            fontSize: gridLabelFontSize,
        });
        gridLineX += gridLineSpacing;
        gridLabelX += gridLabelSpacing;
    }

    // draw the grid lines
    for (let gridLine of gridLines) {
        ctx.beginPath();
        ctx.moveTo(gridLine.x1, gridLine.y1);
        ctx.lineTo(gridLine.x2, gridLine.y2);
        ctx.strokeStyle = gridLine.color;
        ctx.lineWidth = gridLine.width;
        ctx.stroke();
    }

    // draw the grid labels
    for (let gridLabel of gridLabels) {
        ctx.font = `${gridLabel.fontSize}px Arial`;
        ctx.fillStyle = gridLabel.color;
        ctx.fillText(gridLabel.text, gridLabel.x, gridLabel.y);
    }

    for (let marking of markings) {
        // Calculate the position of the image in the canvas
        const { longitudeAbsoluteDegrees, latitudeAbsoluteDegrees } = marking;

        const x =
            (longitudeAbsoluteDegrees - canvasStartLongitudeDegrees) /
            degreePerPixel;
        const y =
            (canvasStartLatitudeDegrees - latitudeAbsoluteDegrees) /
            degreePerPixel;

        // Draw the image
        ctx.drawImage(icons[marking.classification], x, y, 32, 32);
    }

    // Insert image into canvas

    const image = fs.readFileSync(path.join(__dirname, "../src/LEGENDS.png"));
    const img = await loadImage(image);
    ctx.drawImage(img, 3980 - img.width, 20);

    // Save the map as a png
    const map = canvas.toBuffer("image/png");
    // fs.writeFileSync(path.join(__dirname, "../map.png"), map);

    return map;

    // Save the map as a png
};

export default mapData;
