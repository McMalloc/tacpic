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
            scaleY: 1
        },
        moniker: "Rechteck",
        angle: 0,
        type: 'rect'
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

const createLabel = (x = 0, y = 0, width = 100, height = 100, text = 'Neue Beschriftung') => {
    return {
        uuid: uuidv4(),
        x, y, width, height, text,
        moniker: "Beschriftung",
        displayDots: true,
        displayLetters: true,
        editMode: true,
        isKey: false,
        type: 'label'
    }
};

const createPath = (x = 0, y = 0, template = 'striped', fill = 'white') => {
  return {
      uuid: uuidv4(),
      x: 0,
      angle: 0,
      y: 0,
      moniker: "Kurve",
      editMode: true,
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
        object.angle += Math.min(deltaY, deltaX);
    } else {
        object.angle += Math.max(deltaY, deltaX);
    }

    return object;
};

const defaultScale = (object, offsetX, offsetY) => {
    object.width += offsetX;
    object.height += offsetY;
    return object;
};

const defaultGetBBox = object => {
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

export const combineBBoxes = objects => {
    let x1 = Infinity, y1 = Infinity, x2 = 0, y2 = 0;
    objects.forEach(object => {
        let box = methods[object.type].getBBox(object);
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
const changePoint = (path, coords, index, param, kind) => {
    path.points[index].coords[param] = coords[0];
    path.points[index].coords[param + 1] = coords[1];
    return path;
};

// TODO sollten hier auch Methoden rein, die beschreiben,
//  was beispielsweise bei einem Mousedown oder Doppelklick passiert?

const methods = {
    rect: {
        translate: defaultTranslate,
        rotate: defaultRotate,
        scale: defaultScale,
        create: createRect,
        getBBox: defaultGetBBox,
    },
    path: {
        translate: defaultTranslate,
        rotate: defaultRotate,
        getBBox: defaultGetBBox,
        create: createPath,
        addPoint,
        changePoint
    },
    ellipse: {
        translate: defaultTranslate,
        rotate: defaultRotate,
        scale: defaultScale,
        getBBox: defaultGetBBox,
        create: createEllipse
    },
    label: {
        translate: defaultTranslate,
        getBBox: defaultGetBBox,
        create: createLabel,
    },
    group: {
        translate: defaultTranslate,
        getBBox: group => {
            return combineBBoxes(group.objects);
        },
    }
};

export default methods;