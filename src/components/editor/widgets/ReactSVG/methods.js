import {transformCoords} from "./transform";

const defaultTranslate = (object, x, y) => {
    object.x += x;
    object.y += y;
    return object;
};

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

// TODO sollten hier auch Methoden rein, die beschreiben,
//  was beispielsweise bei einem Mousedown oder Doppelklick passiert?

const methods = {
    rect: {
        translate: defaultTranslate,
        rotate: defaultRotate,
        scale: defaultScale,
        getBBox: defaultGetBBox,
    },
    path: {
        translate: defaultTranslate,
        rotate: defaultRotate,
        getBBox: defaultGetBBox,
    },
    label: {
        translate: defaultTranslate,
        getBBox: defaultGetBBox
    },
    group: {
        translate: defaultTranslate,
        getBBox: group => {
            let contents = combineBBoxes(group.objects);
            return contents;
        },
    }
};

export default methods;