import React from "react";
import transform from "./Transform";

const filledRect = (colour) => {
    if (colour === undefined) return null;
    return <rect x="0" y="0" width="20" height="20" fill={colour}/>
};

export default {
    striped: ({scaleX, scaleY, angle}, uuid, fill) => {
        return (
            <pattern patternUnits="userSpaceOnUse" id={'pattern-' + uuid} patternTransform={transform(0, 0, angle)} width="20" height="20">
                {filledRect(fill)}
                <line style={{stroke: 'rgb(0,0,0)', strokeWidth:2}} x1="0" y1="15" x2="5" y2="20" />
                <line style={{stroke: 'rgb(0,0,0)', strokeWidth:2}} x1="5" y1="0" x2="20" y2="15" />
            </pattern>
        )
    },
    bigdots: ({scaleX, scaleY, angle}, uuid, fill) => {
        return (
            <pattern patternUnits="userSpaceOnUse" id={'pattern-' + uuid} patternTransform={transform(0, 0, angle)} width="20" height="20">
                {filledRect(fill)}
                <circle cx="11" cy="11" r="8" />
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
