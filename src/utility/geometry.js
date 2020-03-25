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
