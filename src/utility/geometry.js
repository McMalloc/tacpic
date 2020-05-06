/**
 * Mirrors a coordinates (a point) relative to provided anchor coordinates (another point).
 *
 * @param {Number} x x coordiante of the point to be mirrored.
 * @param {Number} y y coordiante of the point to be mirrored.
 * @param {Number} xa x coordiante of the relative mirror axis point.
 * @param {Number} ya y coordiante of the relative mirror axis point.
 * @return {Object} The return obect holds the mirrored coordiantes in its `x` and `y` keys.
 */
export const mirrorPoint = (x, y, xa, ya) => {
    return {
        x: 2* xa - x,
        y: 2* ya - y
    };
};


export const getRotation = (pointA, pointB) => {
    const deltaY = pointA[1] - pointB[1];
    const deltaX = pointB[0] - pointA[0];
    const result = 180 / Math.PI * (Math.atan2(deltaY, deltaX));
    console.log(deltaY, deltaX, result);
    // return 0;
    return (result < 0) ? (360 + result) : result;
};

export const getMidpoint = (pointA, pointB, isQ = false) => {
    // if (isQ) return [(pointA[0]*2 + pointB[0])/2, (pointA[1]*2 + pointB[1])/2];
    return [(pointA[0] + pointB[0])/2, (pointA[1] + pointB[1])/2];
};