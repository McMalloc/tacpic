/*global fabric*/

// DEPRECATED!
// -----------
// -----------
// -----------
// -----------
// -----------
// -----------
// -----------
// -----------
// -----------
// -----------
// -----------
// -----------
// -----------
// +++++++++++

import 'fabric'
import {store} from '../../store'

// fabric.Object.prototype.objectCaching = false;

let patternElements = {};
export const patterns = {};
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

// todo: make less dirty, more redux-saga-y
Promise.all([
    loadFromSVG('ressources/patterns/dashed.svg'),
    loadFromSVG('ressources/patterns/striped.svg')
]).then(results => {
    patternElements.dashed = results[0];
    patternElements.striped = results[1];

    patternNames.forEach(pattern => {
        patterns[pattern] = createPattern(pattern)
    });

    console.info("Patterns geladen und initialisiert.");
    store.dispatch({type: 'PATTERNS_INIT_DONE'});
});