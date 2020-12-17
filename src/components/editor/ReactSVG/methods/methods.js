import {cosOfDegs, getMirrorPoint, sinOfDegs} from "../../../../utility/geometry";
import uuidv4 from "../../../../utility/uuid";
import {COLOURS, SVG_A4_PX_WIDTH} from "../../../../config/constants";
import {getTransforms} from "../transform";
import {
    addPoint,
    changePoint,
    createPath,
    getOffset,
    getPathBBox,
    pathScale, removePoint, reverse,
    smoothCubicPoint,
    smoothLastSegment, smoothSegment
} from "./path";

const defaultStrokeWidth = 1.5;
const defaultStrokeStyle = "solid";

export const textureColourMapping = {
    "diagonal_lines": COLOURS.blue,
    "diagonal_lines_wide": COLOURS.cyan,
    "full": COLOURS.red,
    "vertical_lines": COLOURS.magenta,
    "horizontal_lines": COLOURS.orange,
    "dashed_lines": COLOURS.white,
    "grid": COLOURS.yellow,
    "stair": COLOURS.green,
    "dotted": COLOURS.red,
    "none": COLOURS.none
}

const createEmbedded = (offsetX = 0, offsetY = 0, markup = '<svg/>', filename = 'Importierte Grafik') => {
    // convert markup to dom by appending it to a dummy element
    let dummy = document.createElement('html')
    dummy.innerHTML = markup;
    let originalSVG = dummy.getElementsByTagName('svg')[0];
    let group = originalSVG.children[1];

    // get initial dimensions by appending it to the main canvas
    const {x, y, width, height} = document.getElementById("MAIN-CANVAS").appendChild(originalSVG).getBBox();
    let aspectRatio = parseInt(height) / parseInt(width);
    document.getElementById("MAIN-CANVAS").removeChild(originalSVG);

    // reset weird (x-)translations made by potrace, but keep the scaling as it also contains mirroring
    const transforms = getTransforms(group.getAttribute('transform'));
    group.removeAttribute('transform');
    const [initialScaleX, initialScaleY] = transforms.scales[0] // TODO robuster nötig oder erzeugt potrace immer nur eine Translation?
    group.setAttribute('transform', `translate(0,${height}) scale(${initialScaleX}, ${initialScaleY})`);

    return {
        uuid: uuidv4(),
        x, y,
        scaleX: 1,
        scaleY: 1,
        originalWidth: width,
        originalHeight: height,
        width: Math.min(width, SVG_A4_PX_WIDTH),
        height: Math.min(height, SVG_A4_PX_WIDTH * aspectRatio),
        aspectRatio,
        moniker: filename,
        markup: originalSVG.innerHTML,
        angle: 0,
        type: 'embedded'
    }
};

const createRect = (x = 0, y = 0, width = 100, height = 100, template = 'diagonal_lines', fill = 'white') => {
    return {
        uuid: uuidv4(),
        x, y, width, height, fill: textureColourMapping[template],
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
        x, y, width, height,
        fill: textureColourMapping[template],
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

const createLabel = (x = 0, y = 0, width = 100, height = 100, text = '', braille = '', overrides = {}) => {
    const defaults = {
        x, y, width, height, text, braille,
        moniker: "Beschriftung",
        displayDots: true,
        displayLetters: true,
        smooth: true,
        editMode: true,
        isKey: false,
        isTitle: false,
        keyVal: '',
        fullCharPrefix: false,
        border: false,
        type: 'label'
    };
    return {
        uuid: uuidv4(),
        ...defaults,
        ...overrides
    }
};

const createKey = (x = 0, y = 0, width = 200, height = 300, moniker = "Legende") => {
    return {
        uuid: uuidv4(),
        x, y, width, height,
        moniker,
        editMode: true,
        active: true,
        anchored: true,
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
const defaultScale = (object, offsetX, offsetY, downX, downY, absX, absY) => {
    if (object.x < absX) {
        object.width += offsetX;
    } else {
        object.x += offsetX;
        object.width -= offsetX;
    }
    if (object.y < absY) {
        object.height += offsetY;
    } else {
        object.y += offsetY;
        object.height -= offsetY;
    }


    // if (offsetX < 0 || object.x < (downX + offsetX)) {
    //     object.x += offsetX;
    //     object.width -=offsetX;
    // } else object.width += offsetX;
    //
    // if (offsetY < 0 || object.y < (downY + offsetY)) {
    //     object.y += offsetY;
    //     object.height -=offsetY;
    // } else object.height += offsetY;

    return object;
};

const embeddedScale = (object, offsetX, offsetY, downX, downY, fullOffsetX, fullOffsetY) => {
    object.scaleX = (object.originalWidth - (downX - fullOffsetX)) / object.originalWidth;
    object.scaleY = (object.originalHeight - (downY - fullOffsetY)) / object.originalHeight;
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
        const bbox = elem.getBBox();
        return {
            x: bbox.x + object.x,
            y: bbox.y + object.y,
            width: object.width,//bbox.width * (object.width / bbox.width),
            height: object.height //bbox.height * (object.height / bbox.height)
        };
    } else {
        return {x: 0, y: 0, width: 0, height: 0}
    }
};

const getKeyBBox = object => {
    return {
        x: object.anchored ? document.getElementById("container-" + object.uuid).dataset.internalX : object.x,
        y: object.anchored ? document.getElementById("container-" + object.uuid).dataset.internalY : object.y,
        width: object.width,//bbox.width * (object.width / bbox.width),
        height: object.height
    };
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
    embedded: {
        translate: defaultTranslate,
        rotate: defaultRotate,
        scale: defaultScale,//embeddedScale,
        create: createEmbedded,
        getBBox: getBBox,//getBBox,
        getClientBox: defaultGetClientBox,
    },
    path: {
        translate: defaultTranslate,
        // translate: translatePath,
        rotate: defaultRotate,
        scale: pathScale,
        smoothSegment,
        getClientBox: defaultGetClientBox,
        create: createPath,
        getBBox: getPathBBox,
        getOffset,
        addPoint,
        removePoint,
        reverse,
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
        scale: defaultScale,
        translate: defaultTranslate,
        rotate: id,
        getBBox: getKeyBBox,
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