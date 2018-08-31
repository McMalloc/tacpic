/*global fabric*/

import 'fabric'
import {store} from '../../store'

// fabric.Object.prototype.objectCaching = false;
fabric.Object.prototype.setByUser = false;

let patternElements = {};
let patterns = {};
let width, height;
export const patternNames = ['striped', 'dashed'];

function loadFromSVG(svgUrl) {
    return new Promise((resolve, reject) => {
        try {
            fabric.loadSVGFromURL(svgUrl, resolve);
        } catch (error) {
            reject(error);
        }
    });
}

export const updatePatternClipping = function(objects) {
    let offsetLeft = width / 2;
    let offsetTop = height / 2;

    patternNames.forEach(pattern => {
        patterns[pattern].set("clipTo", (context) => {
            objects.forEach(object => {
                if (!object.setByUser || object.pattern !== pattern) return;
                context.rect(
                    object.left - offsetLeft,
                    object.top - offsetTop,
                    object.width * object.scaleX,
                    object.height * object.scaleY
                );
                //todo: Rotation beachten!
            });
        });
    });
};

const createPattern = function (pattern) {
    let ptnGroup = new fabric.Group(patternElements[pattern], {
        top: 0,
        left: 0,
        width: 20,
        height: 20
    });

    let patternSourceCanvas = new fabric.StaticCanvas()
        .add(ptnGroup)
        .setDimensions({
            width: 20,
            height: 20
        });

    return new fabric.Pattern({
        source: patternSourceCanvas.getElement(),
        repeat: 'repeat',
        offsetX: 0,
        offsetY: 0
    });
};

export const generatePatterns = function(fabricCanvas) {
    patternNames.forEach(pattern => {
        patterns[pattern] = new fabric.Rect({
            left: 0,
            top: 0,
            // clipTo: context => {
            //     context.rect(0,0,0,0);
            // },
            fill: createPattern(pattern),
            evented: false,
            hasControls: false,
            selectable: false,
            width: fabricCanvas.getWidth(),
            height: fabricCanvas.getHeight()
        });
    });

    width = fabricCanvas.getWidth();
    height = fabricCanvas.getHeight();

    patternNames.forEach(pattern => {
        fabricCanvas.add(patterns[pattern]);
    });
};

Promise.all([
    loadFromSVG('ressources/patterns/dashed.svg'),
    loadFromSVG('ressources/patterns/striped.svg')
]).then(results => {
    patternElements.dashed = results[0];
    patternElements.striped = results[1];
    console.info("Patterns geladen und initialisiert.");

    store.dispatch({type: 'PATTERNS_INIT_DONE'});
});