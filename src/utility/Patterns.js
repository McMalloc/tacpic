/*global fabric*/

import 'fabric'

/**
 * Generates a Fabric.js-Pattern from an SVG string
 * @param {string} svgString
 * @param {scaleFactor} scaleFactor
 * @returns {Promise}
 */
export function fromSVG(svgString, scaleFactor) {
    return new Promise((resolve, reject) => {
        try {
            fabric.loadSVGFromString(svgString, function(svgpattern) {
                let ptnGroup = new fabric.Group(svgpattern, {
                    top: 0,
                    width: 20,
                    height: 20
                });

                let patternSourceCanvas = new fabric.StaticCanvas();
                patternSourceCanvas.add(ptnGroup);
                patternSourceCanvas.setDimensions({
                    width: 20,
                    height: 20
                });

                var texture = patternSourceCanvas.getElement();
                let pattern = new fabric.Pattern({
                    source: texture,
                    repeat: 'repeat',
                    // offsetX: 20 / 2,
                    // offsetY: 20 / 2
                });
                resolve(pattern);
            });
        } catch(error) {
            reject(error);
        }
    });
}