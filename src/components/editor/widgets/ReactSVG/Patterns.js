import React from "react";
import transform from "./Transform";

export default {
    striped: ({scaleX, scaleY, angle}, uuid) => {
        return (
            <pattern patternUnits="userSpaceOnUse" id={'pattern-' + uuid} patternTransform={transform(0, 0, angle)} width="20" height="20">
                <line style={{stroke: 'rgb(255,0,0)', strokeWidth:2}} x1="0" y1="15" x2="5" y2="20" />
                <line style={{stroke: 'rgb(255,0,0)', strokeWidth:2}} x1="5" y1="0" x2="20" y2="15" />
            </pattern>
        )
    },
    bigdots: ({scaleX, scaleY, angle}, uuid) => {
        return (
            <pattern patternUnits="userSpaceOnUse" id={'pattern-' + uuid} patternTransform={transform(0, 0, angle)} width="40" height="40">
                <circle cx="20" cy="20" r="20" />
            </pattern>
        )
    }
};
//
// let patternElements = {};
// export const patternNames = ['striped', 'dashed'];
//
// function loadFromSVG(svgUrl) {
//     return new Promise((resolve, reject) => {
//         try {
//             fabric.loadSVGFromURL(svgUrl, resolve);
//         } catch (error) {
//             reject(error);
//         }
//     });
// }
//
// // todo: make less dirty, more redux-saga-y
// Promise.all([
//     loadFromSVG('ressources/patterns/dashed.svg'),
//     loadFromSVG('ressources/patterns/striped.svg')
// ]).then(results => {
//     patternElements.dashed = results[0];
//     patternElements.striped = results[1];
//
//     patternNames.forEach(pattern => {
//         patterns[pattern] = createPattern(pattern)
//     });
//
//     console.info("Patterns geladen und initialisiert.");
//     store.dispatch({type: 'PATTERNS_INIT_DONE'});
// });
//
// export default patterns;
//
