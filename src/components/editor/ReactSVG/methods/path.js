import uuidv4 from "../../../../utility/uuid";
import {getMirrorPoint} from "../../../../utility/geometry";
import fitCurve from "fit-curve";
import {chunk} from "lodash";
import {textureColourMapping} from "./methods";

export const createPath = (x = 0, y = 0, template = "stair", fill, moniker = "Kurve") => {
    return {
        uuid: uuidv4(),
        angle: 0,
        x: 0, y: 0,
        scaleX: 1, scaleY: 1,
        moniker,
        editMode: true,
        border: true,
        borderWidth: 1.5,
        borderStyle: "solid",
        startArrow: false,
        endArrow: false,
        closed: false,
        fill: textureColourMapping[template],
        pattern: {
            template,
            offset: true
        },
        points: [{
            kind: 'M',
            coords: [x, y]
        }],
        type: 'path'
    }
};

export const pathScale = (object, offsetX, offsetY, downX, downY, fullOffsetX, fullOffsetY) => {
    const {width, height} = getPathBBox(object);
    console.log("width: ", downX- fullOffsetX, width);
    console.log("   ", width + downX- fullOffsetX, width);
    console.log("height: ", downY - fullOffsetY, height);
    console.log("   ", height + downY - fullOffsetY, height);
    object.scaleX = (width - downX + fullOffsetX) / width;
    object.scaleY = (height - downY + fullOffsetY) / height;
    return object;
};

// get offset to path mid point for rotation purposes
export const getOffset = path => {
    let bbox = getPathBBox(path);
    return [bbox.width / 2 + bbox.x - path.x, bbox.height / 2 + bbox.y - path.y];
};

export const getPathBBox = path => {
    let elem = document.getElementById(path.uuid);
    if (!!elem) {
        let bbox = elem.getBBox();
        bbox.x += path.x;
        bbox.y += path.y;
        return bbox;
    } else {
        return {x: 0, y: 0, width: 0, height: 0}
    }
    // paths need to add their translation parameters to the bbox because
    // the native getBBox() method will not measure in transform properties
    // let bbox = getBBox(path);

};

// param 0 CP_ST: control point of start point
// param 2 CP_E: control point of end point
// param 4 E: end point
export const changePoint = (path, coords, index = path.points.length - 1, param = 0, kind) => {
    path.points[index].coords[param] = coords[0];
    if (!!kind) {
        path.points[index].kind = kind;
    }
    path.points[index].coords[param + 1] = coords[1];
    return path;
};

export const smoothCubicPoint = (path, index) => {
    const ref = path.points[index - 1].coords;
    if (path.points[index - 1].kind === 'M' || path.points[index - 1].kind === 'L')
        return changePoint(path, ref, index);
    let mirrored = getMirrorPoint(ref[2], ref[3], ref[4], ref[5]);
    // if (ref.length === 2) {
    //     const prevRef = path.points[index - 2].coords;
    //     mirrored = getMirrorPoint(prevRef[0], prevRef[1], ref[0], ref[1])
    //     // return changePoint(path, ref, index)
    // } else {
    //     mirrored = getMirrorPoint(ref[2], ref[3], ref[4], ref[5]);
    // }
    // const mirrored = getMirrorPoint(ref[ref.length - 3], ref[ref.length - 4], ref[ref.length - 1], ref[ref.length - 2]);
    return changePoint(path, [mirrored.x, mirrored.y], index);
};

// TODO explizit C statt S anlegen, um späteres verändern zu vereinfachen
export const addPoint = (path, mouseCoords, kind) => {
    path.points.push({
        kind,
        coords: [mouseCoords[0] - path.x, mouseCoords[1] - path.y]
    });
    return path;
};

export const removePoint = (path, index) => {
    path.points.splice(index, 1);
    return path;
};

export const reverse = path => {
    const lastIndex = path.points.length - 1;
    let allCoordinatesR = chunk(path.points.reduce((acc, point) => {
        return acc.concat(point.coords);
    }, []), 2).reverse();
    let allKindsR = path.points.map(point => point.kind).reverse();
    delete allKindsR[allKindsR.length - 1]
    allKindsR.unshift('M');

    let offset = 0;
    path.points = path.points.map((point, index) => {
        let reversedPoint = {kind: allKindsR[index]}
        switch (allKindsR[index]) {
            case 'M': case 'L':
                reversedPoint.coords = allCoordinatesR[index + offset];
                break;
            case 'C':
                reversedPoint.coords = allCoordinatesR[index + offset].concat(
                    allCoordinatesR[index + offset + 1],
                    allCoordinatesR[index + offset + 2]
                );
                offset += 2;
                break;
        }
        return reversedPoint;
    });
    console.log(path.points)
    return path;
}

export const smoothSegment = (path, start, end, error) => {
    let segment = path.points.slice(start, end);
    if (segment.length === 0) return path;
    let coordsOnly = segment.map(point => point.coords);
    console.log(start);
    console.log(end);

    let smoothedSegment = fitCurve(coordsOnly, error).map((fittedCubicPoint, index) => {
        if (start === 0 && index === 0) {
            return path.points[0]
        }
        return {
            kind: 'C',
            coords: fittedCubicPoint[1].concat(fittedCubicPoint[2]).concat(fittedCubicPoint[3])
        }
    });

    let head = path.points.slice(0, start);
    let tail = path.points.slice(end + 1);
    // path.points = smoothedSegment;
    path.points = head.concat(smoothedSegment, tail);
    return path;
}