import {transformCoords} from "./transform";
import {mirrorPoint} from "../../../../utility/geometry";
import uuidv4 from "../../../../utility/uuid";

const createRect = (x = 0, y = 0, width = 100, height = 100, template = 'striped', fill = 'white') => {
    return {
        uuid: uuidv4(),
        x, y, width, height, fill,
        pattern: {
            template,
            angle: 0,
            scaleX: 1,
            scaleY: 1,
            offset: true
        },
        border: true,
        borderWidth: 2,
        moniker: "Rechteck",
        angle: 0,
        type: 'rect'
    }
};

const rectGetBBox = rect => {
  return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
  }
};

const createEllipse = (x = 0, y = 0, width = 100, height = 100, template = 'striped', fill = 'white') => {
    return {
        uuid: uuidv4(),
        x, y, width, height, fill,
        pattern: {
            template,
            angle: 0,
            scaleX: 1,
            scaleY: 1
        },
        moniker: "Ellipse",
        angle: 0,
        type: 'ellipse'
    }
};

const createLabel = (x = 0, y = 0, width = 100, height = 100, text = 'Neue Beschriftung', braille = '') => {
    return {
        uuid: uuidv4(),
        x, y, width, height, text, braille,
        moniker: "Beschriftung",
        displayDots: true,
        displayLetters: true,
        editMode: true,
        isKey: false,
        keyVal: '',
        fullCharPrefix: false,
        border: false,
        type: 'label'
    }
};

const createPath = (x = 0, y = 0, template = null, fill = null, moniker = "Kurve") => {
    return {
        uuid: uuidv4(),
        angle: 0, x: 0, y: 0,
        moniker,
        editMode: true,
        border: true,
        borderWidth: 2,
        startArrow: false,
        endArrow: false,
        fill,
        pattern: {
            template,
            angle: 0,
            scaleX: 1,
            scaleY: 1
        },
        points: [{
            kind: 'M',
            coords: [x, y]
        }],
        type: 'path'
    }
};

const defaultTranslate = (object, x, y) => {
    object.x += x;
    object.y += y;
    return object;
};

// TODO: funktioniert noch nciht für Pfade / falscher Origin
const defaultRotate = (object, deltaX, deltaY) => {
    if (deltaY + deltaX < 0) {
        object.angle += Math.min(deltaY, deltaX)*0.2;
    } else {
        object.angle += Math.max(deltaY, deltaX)*0.2;
    }

    return object;
};

const defaultScale = (object, offsetX, offsetY) => {
    object.width += offsetX;
    object.height += offsetY;
    return object;
};

const defaultGetClientBox = object => {
    // getBoundingClientRect() is needed since we need the bounding box
    // after the geometry has been transformed
    const element = document.getElementById(object.uuid);
    if (!element) return false;
    const canvasBox = document.getElementById('MAIN-CANVAS').getBoundingClientRect();
    const box = element.getBoundingClientRect();

    return {
        x: box.x - canvasBox.left, //+ object.x || 0,
        y: box.y - canvasBox.top, //+ object.y || 0,
        width: box.width,
        height: box.height
    };
};

const getBBox = object => {
    return document.getElementById(object.uuid).getBBox();
};

// TODO durch den Abstand des Reliefs zum Rand ist die bbox verfälscht, muss abgezogen werden
export const combineBBoxes = (objects, transformed = true) => {
    let x1 = Infinity, y1 = Infinity, x2 = 0, y2 = 0;
    objects.forEach(object => {
        let box;
        if (transformed) {
            box = methods[object.type].getClientBox(object);
        } else {
            box = getBBox(object);
            box.x = object.x;
            box.y = object.y;
            box.width = object.width;
            box.height = object.height;
        }
        x1 = Math.min(x1, box.x);
        y1 = Math.min(y1, box.y);
        x2 = Math.max(box.x + box.width, x2);
        y2 = Math.max(box.y + box.height, y2);
    });

    return {
        x: x1, y: y1,
        width: Math.abs(x1 - x2), height: Math.abs(y1 - y2)
    }
};

// TODO explizit C statt S anlegen, um späteres verändern zu vereinfachen
const addPoint = (path, mouseCoords, kind) => {
    let coords = [];
    if ((kind === 'S' || kind === 'Q') && mouseCoords.length === 2) {
        coords[0] = mouseCoords[0];
        coords[2] = mouseCoords[0];
        coords[1] = mouseCoords[1];
        coords[3] = mouseCoords[1];
    } else if (kind === 'C' && mouseCoords.length === 2) {
        // add mirroring control point, act as if the point was a 'S'
        if (path.points.length >= 1) {
            let lastPoint = path.points[path.points.length - 1];
            if (lastPoint.kind === 'C') {
                let mirrored = mirrorPoint(lastPoint.coords[2], lastPoint.coords[3], lastPoint.coords[4], lastPoint.coords[5]);
                coords[0] = mirrored.x;
                coords[1] = mirrored.y;
            } else if (lastPoint.kind === 'Q') {
                let mirrored = mirrorPoint(lastPoint.coords[0], lastPoint.coords[1], lastPoint.coords[2], lastPoint.coords[3]);
                coords[0] = mirrored.x;
                coords[1] = mirrored.y;
            } else if (lastPoint.kind === 'M') {
                coords[0] = path.points[0].coords[0];
                coords[1] = path.points[0].coords[1];
            }
        } else { // starting point of a path, M
            coords[0] = path.points[0].coords[0];
            coords[1] = path.points[0].coords[1];
        }
        coords[2] = mouseCoords[0];
        coords[3] = mouseCoords[1];
        coords[4] = mouseCoords[0];
        coords[5] = mouseCoords[1];
    } else if (kind === 'L' && mouseCoords.length === 2) {
        coords[0] = mouseCoords[0];
        coords[1] = mouseCoords[1];
    }

    path.points.push({
        kind,
        coords
    });
    return path;
};

// param 0 CP_ST: control point of start point
// param 2 CP_E: control point of end point
// param 4 E: end point
const changePoint = (path, coords, index = path.points.length - 1, param = 0, kind) => {
    path.points[index].coords[param] = coords[0];
    if (!!kind) {
        path.points[index].kind = kind;
    }
    path.points[index].coords[param + 1] = coords[1];
    return path;
};

const smoothCubicPoint = (path, index) => {
    const ref = path.points[index - 1].coords;
    if (path.points[index - 1].kind === 'M' || path.points[index - 1].kind === 'L')
        return changePoint(path, ref, index);
    let mirrored = mirrorPoint(ref[2], ref[3], ref[4], ref[5]);
    // if (ref.length === 2) {
    //     const prevRef = path.points[index - 2].coords;
    //     mirrored = mirrorPoint(prevRef[0], prevRef[1], ref[0], ref[1])
    //     // return changePoint(path, ref, index)
    // } else {
    //     mirrored = mirrorPoint(ref[2], ref[3], ref[4], ref[5]);
    // }
    // const mirrored = mirrorPoint(ref[ref.length - 3], ref[ref.length - 4], ref[ref.length - 1], ref[ref.length - 2]);
    return changePoint(path, [mirrored.x, mirrored.y], index);
};

const cosOfDegs = degs => {
  return Math.cos(degs*(Math.PI/180));
};

const sinOfDegs = degs => {
  return Math.sin(degs*(Math.PI/180));
};

const selectionRotate = (objects, deltaX, deltaY) => {
    const selectionBox = combineBBoxes(objects, false);
    objects.forEach(object => {

        // fuck it
        methods[object.type].rotate(object, deltaX, deltaY);
        // object.angle = 10;
        let {x, y, angle} = object;
        // console.log("vorher: ", x, y, "winkel: ", angle);

        let offsetX = x;// - selectionBox.x - selectionBox.width/2;
        let offsetY = y;// - selectionBox.y - selectionBox.height/2;

        console.log(x, selectionBox.x - selectionBox.width/2);
        console.log("angle: ", angle);

        object.x = offsetX * cosOfDegs(angle) - offsetX * sinOfDegs(angle);// + selectionBox.x + selectionBox.width/2;
        object.y = offsetY * sinOfDegs(angle) + offsetY * cosOfDegs(angle);// + selectionBox.x + selectionBox.width/2;

        // methods[object.type].translate(object, x, y);
    });
};

// TODO sollten hier auch Methoden rein, die beschreiben,
//  was beispielsweise bei einem Mousedown oder Doppelklick passiert?

const methods = {
    rect: {
        translate: defaultTranslate,
        rotate: defaultRotate,
        scale: defaultScale,
        create: createRect,
        getBBox: rectGetBBox,
        getClientBox: defaultGetClientBox,
    },
    path: {
        translate: defaultTranslate,
        rotate: defaultRotate,
        getClientBox: defaultGetClientBox,
        create: createPath,
        getBBox: getBBox,
        addPoint,
        smoothCubicPoint,
        changePoint
    },
    ellipse: {
        translate: defaultTranslate,
        rotate: defaultRotate,
        scale: defaultScale,
        getClientBox: defaultGetClientBox,
        getBBox: rectGetBBox,
        create: createEllipse
    },
    label: {
        translate: defaultTranslate,
        getClientBox: defaultGetClientBox,
        getBBox: rectGetBBox,
        scale: defaultScale,
        create: createLabel,
        rotate: label => label // id function, labels shouldn't be rotated
    },
    selection: {
        rotate: selectionRotate
    },
    group: {
        translate: defaultTranslate,
        getClientBox: group => {
            return combineBBoxes(group.objects);
        },
    }
};

export default methods;