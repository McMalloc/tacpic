/*global fabric*/

import 'fabric'
// import {patterns} from "../../Patterns";

let pathDrawing = false;
let pathPoints = [];
let previewLine;

// todo: aktuellen state zur path-generierung zurückgeben, damit redux bescheid wissen kann
const pathFunctions = (canvas) => {
    Object.assign(canvas, {
        createLine: (x, y) => {
            if (pathPoints.length === 0) {
                console.log("pathPoints was empty");
                pathPoints.push([x, y]);
                pathDrawing = true;
                return;
            }

            if ( // set point is the same as last point (equals a double click)
                (x === pathPoints[pathPoints.length - 1][0]) &&
                (y === pathPoints[pathPoints.length - 1][1])
            ) {
                console.log("closing path.js");
                let pathString = '';
                pathPoints.forEach((point, index) => {
                    if (index === 0) {
                        pathString += `M ${point[0]} ${point[1]} `;
                    } else {
                        pathString += `L ${point[0]} ${point[1]} `;
                    }
                });

                let object = new fabric.Path(pathString);
                pathPoints = [];
                pathDrawing = false;
                canvas.remove(previewLine);
                object.set({ fill: null, stroke: 'green', strokeWidth:2, opacity: 1 });
                canvas.add(object);
                canvas.setActiveObject(object);
            } else {
                console.log("continuing path.js");
                pathPoints.push([x, y]);

                canvas.remove(previewLine);
                let pathString = '';
                pathPoints.forEach((point, index) => {
                    if (index === 0) {
                        pathString += `M ${point[0]} ${point[1]} `;
                    } else {
                        pathString += `L ${point[0]} ${point[1]} `;
                    }
                });
                previewLine = new fabric.Path(pathString);
                canvas.add(previewLine);
                previewLine.set('selectable', false);
                previewLine.set({ fill: null, stroke: 'green', opacity: 0.5 });
                console.log(previewLine);
            }
            // if (pathPoints.length > 0) return;
        },

        createSpline: () => {

        }
    });
};

export default pathFunctions