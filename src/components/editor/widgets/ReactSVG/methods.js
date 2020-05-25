import {transformCoords} from "./transform";
import {cosOfDegs, getMirrorPoint, sinOfDegs} from "../../../../utility/geometry";
import uuidv4 from "../../../../utility/uuid";

const defaultStrokeWidth = 1.5;
const defaultStrokeStyle = "solid";

const createRect = (x = 0, y = 0, width = 100, height = 100, template = 'diagonal_lines', fill = 'white') => {
    return {
        uuid: uuidv4(),
        x, y, width, height, fill,
        pattern: {
            template,
            offset: true
        },
        border: true,
        borderWidth: defaultStrokeWidth,
        borderStyle: defaultStrokeStyle,
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

const ellipseGetBBox = ellipse => {
    return {
        x: ellipse.x - ellipse.width,
        y: ellipse.y - ellipse.height,
        width: ellipse.width * 2,
        height: ellipse.height * 2,
    }
};

const createEllipse = (x = 0, y = 0, width = 100, height = 100, template = 'diagonal_lines', fill = 'white') => {
    return {
        uuid: uuidv4(),
        x, y, width, height, fill,
        pattern: {
            template,
            offset: true
        },
        border: true,
        borderWidth: defaultStrokeWidth,
        borderStyle: defaultStrokeStyle,
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
        smooth: true,
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
        angle: 0,
        x: 0, y: 0,
        moniker,
        editMode: true,
        border: true,
        borderWidth: 2,
        startArrow: false,
        endArrow: false,
        closed: false,
        fill,
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

const createKey = (x = 0, y = 0, moniker = "Legende") => {
    return {
        uuid: uuidv4(),
        x, y,
        moniker,
        editMode: true,
        border: true,
        borderWidth: 2,
        type: 'key'
    }
};

const defaultTranslate = (object, x, y) => {
    object.x += x;
    object.y += y;
    return object;
};

// TODO: funktioniert noch nciht für Pfade / falscher Origin
const defaultRotate = (object, deltaX, deltaY, downX, downY, offsetX, offsetY) => {
    object.angle = -Math.atan2(offsetX - downX, offsetY - downY) * (180 / Math.PI) + 90;
    return object;
};

// TODO scaling für Rechtecke: http://phrogz.net/svg/drag_under_transformation.xhtml
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
    let elem = document.getElementById(object.uuid);
    //TODO konsistent machen, nur das data-attribut benutzen
    if (elem === null) elem = document.querySelector(`[data-uuid='${object.uuid}']`);
    if (!!elem) {
        return elem.getBBox();
    } else {
        return {x: 0, y: 0, width: 0, height: 0}
    }
};

const getKeyBBox = object => {
    let elem = document.getElementById(object.uuid);
    if (!!elem) {
        return elem.getBBox();
    } else {
        return {x: 0, y: 0, width: 0, height: 0}
    }
};

const getPathBBox = path => {
    // paths need to add their translation parameters to the bbox because
    // the native getBBox() method will not measure in transform properties
    let bbox = getBBox(path);
    bbox.x += path.x;
    bbox.y += path.y;
    return bbox;
};

// get offset to path mid point for rotation purposes
const getOffset = path => {
    let bbox = getPathBBox(path);
    return [bbox.width / 2 + bbox.x - path.x, bbox.height / 2 + bbox.y - path.y];
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
    path.points.push({
        kind,
        coords: [mouseCoords[0], mouseCoords[1]]
    });
    return path;
};

// param 0 CP_ST: control point of start point
// param 2 CP_E: control point of end point
// param 4 E: end point
const changePoint = (path, coords, index = path.points.length - 1, param = 0, kind) => {
    console.log(path);
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

        object.x = offsetX * cosOfDegs(angle) - offsetX * sinOfDegs(angle);// + selectionBox.x + selectionBox.width/2;
        object.y = offsetY * sinOfDegs(angle) + offsetY * cosOfDegs(angle);// + selectionBox.x + selectionBox.width/2;

        // methods[object.type].translate(object, x, y);
    });
};

// TODO sollten hier auch Methoden rein, die beschreiben,
//  was beispielsweise bei einem Mousedown oder Doppelklick passiert?
const id = obj => obj;

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
        // translate: translatePath,
        rotate: defaultRotate,
        scale: p => p,
        getClientBox: defaultGetClientBox,
        create: createPath,
        getBBox: getPathBBox,
        getOffset,
        addPoint,
        smoothCubicPoint,
        changePoint
    },
    ellipse: {
        translate: defaultTranslate,
        rotate: defaultRotate,
        scale: defaultScale,
        getClientBox: defaultGetClientBox,
        getBBox: ellipseGetBBox,
        create: createEllipse
    },
    label: {
        translate: defaultTranslate,
        getClientBox: defaultGetClientBox,
        getBBox: rectGetBBox,
        scale: defaultScale,
        create: createLabel,
        rotate: id
    },
    key: {
        create: createKey,
        translate: defaultTranslate,
        rotate: id,
        getBBox: getBBox,
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