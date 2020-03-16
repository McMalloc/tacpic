export default function transform(x = 0, y = 0, a = 0, width = 0, height = 0) {
    // return `translate(${x}, ${y}) rotate(${a})`;
    return `translate(${x}, ${y}) rotate(${a}, ${width/2}, ${height/2})`;
}

let svgRefPoint = null;

export const transformCoords = (x, y) => {
    if (svgRefPoint === null) return {x,y};

    svgRefPoint.x = x;
    svgRefPoint.y = y;
    return svgRefPoint.matrixTransform(
        document.getElementById('VIEWBOX').getScreenCTM().inverse()
    );
};

export function init(elem) {
    svgRefPoint = elem.createSVGPoint();
}

