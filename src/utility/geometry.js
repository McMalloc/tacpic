/**
 * Mirrors a coordinates (a point) relative to provided anchor coordinates (another point).
 *
 * @param {Array<Number>} pointA coordiantes of the point to be mirrored.
 * @param {Array<Number>} pointM coordiantes of the relative mirror axis point.
 * @return {Array<Number>} The return array holds the mirrored coordiantes in x, y order.
 */
export const getMirrorPoint = (pointA, pointM) => {
    return [
        2 * pointM[0] - pointA[0],
        2 * pointM[1] - pointA[1]
    ];
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
    return [(pointA[0] + pointB[0]) / 2, (pointA[1] + pointB[1]) / 2];
};

export const rotatePoint = (point, angle) => {
    if (angle === 0) return point;
    const cosA = cosOfDegs(angle);
    const sinA = sinOfDegs(angle);
    return [
        point[0] * cosA - point[1] * sinA,
        point[1] * cosA + point[0] * sinA
    ]
};

export const cosOfDegs = degs => {
    return Math.cos(degs * (Math.PI / 180));
};

export const sinOfDegs = degs => {
    return Math.sin(degs * (Math.PI / 180));
};