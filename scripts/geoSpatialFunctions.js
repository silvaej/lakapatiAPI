const generateAbsolutePosition = (latitude, longitude, x, y, width, height) => {
    // This is as if the image is taken from 3m above the ground (cm)
    const SPATIAL_RESOLUTION = 0.1082954299;

    // This is the size of the image (default at 4000x3000)
    const IMAGE_WIDTH = width;
    const IMAGE_HEIGHT = height;

    // Calculte how many pixels the image is from the center of the map
    const xDistance = IMAGE_WIDTH / 2 - x;
    const yDistance = IMAGE_HEIGHT / 2 - y;

    // Calculate the absolute position of the image (in meters)
    const xAbsolute = (xDistance * SPATIAL_RESOLUTION) / 100;
    const yAbsolute = (yDistance * SPATIAL_RESOLUTION) / 100;

    // Calculate the absolute position of the image (in degrees)
    const xAbsoluteDegrees = xAbsolute / 111111;
    const yAbsoluteDegrees = yAbsolute / 111111;

    // Calculate the absolute position of the image (in degrees)
    const latitudeAbsoluteDegrees = latitude + xAbsoluteDegrees;
    const longitudeAbsoluteDegrees = longitude + yAbsoluteDegrees;

    return { longitudeAbsoluteDegrees, latitudeAbsoluteDegrees };
};

const calculateDistance = (latitude1, longitude1, latitude2, longitude2) => {
    const R = 6371e3; // metres
    const φ1 = (latitude1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (latitude2 * Math.PI) / 180;
    const Δφ = ((latitude2 - latitude1) * Math.PI) / 180;
    const Δλ = ((longitude2 - longitude1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return d;
};

export { generateAbsolutePosition, calculateDistance };
