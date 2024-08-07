// https://medium.com/@francoisromain/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74
import {getMidpoint, getMirrorPoint} from "../../../utility/geometry";
import fitCurve from "fit-curve";

export const buildPath = (points, closed) => {
    // build the d attributes by looping over the points
    // let _points = fitCurve(points.map(point => point.coords), 50).map(fittedPoint => ({kind: 'LF', coords: fittedPoint}));
    let _points = [...points];
    closed && _points.push({kind: "L", coords: [points[0].coords[0], points[0].coords[1]]});
    return _points.reduce((acc, point, index, all) => {
        const command = point.kind === 'L' || point.kind === 'LF' ? lineCommand : cubicCommand
        return index === 0
            // if first point
            ? `M ${point.coords[0]},${point.coords[1]}`
            // else
            : `${acc} ${command(point.coords, index, all.map(p => p.coords), closed)}`
    }, '');
};

export const lineCommand = point => `L ${point[0]} ${point[1]}`;

const lineProps = (pointA, pointB) => {
    const lengthX = pointB[0] - pointA[0];
    const lengthY = pointB[1] - pointA[1];
    return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
    }
};

const getControlPoint = (current, previous, next, reverse, smoothing = 0.2) => {
    const p = previous || current;
    const n = next || current;
    // console.log(current, previous);
    // console.log(" . ");

    const opposedLine = lineProps(p, n);

    // If is end-control-point, add PI to the angle to go backward
    const angle = opposedLine.angle + (reverse ? Math.PI : 0);
    const length = opposedLine.length * smoothing;
    // The control point position is relative to the current point
    const x = current[0] + Math.cos(angle) * length;
    const y = current[1] + Math.sin(angle) * length;
    return [x, y];
};

export const cubicCommand = point => {
    return `C ${point[0]},${point[1]} ${point[2]},${point[3]} ${point[4]},${point[5]} `
};

// creates a cubic point with calculated, continous mirrored control point
export const autoCubicCommand = (point, index, all, closed) => {
    // start control point
    let prev = [0,0];
    if (index === 1 && closed) {
        prev = all[all.length-2];
    } else {
        prev = all[index - 2];
        if (index === 1) {

        }
    }
    const [cpsX, cpsY] = getControlPoint(all[index - 1], prev, point);
    // end control point
    const [cpeX, cpeY] = closed && index === all.length - 1 ?
        getMirrorPoint(getControlPoint(all[0], all[all.length-1], all[1]), all[0]) :
        getControlPoint(point, all[index - 1], all[index + 1], true);
    return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`
};

export const quadraticCommand = (point, index, all) => {
    if (index <= 1) return '';
    if (index === 2) {
        const [cpX, cpY] = getMidpoint(all[index - 1], point);
        return `Q ${all[index - 1][0]},${all[index - 1][1]} ${cpX},${cpY}`;
    }
    const [cpX, cpY] = getMidpoint(all[index - 1], point);
    return `T ${cpX},${cpY}`;
};