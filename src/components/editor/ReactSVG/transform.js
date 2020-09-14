// generate transform attribute string
export default function transform(x = 0, y = 0, a = 0, width = 0, height = 0, scaleX = 1, scaleY = 1) {
    // return `translate(${x}, ${y}) rotate(${a})`;
    return `translate(${x}, ${y}) rotate(${a || 0}, ${width/2}, ${height/2}) scale(${scaleX}, ${scaleY})`;
}

let svgRefPoint = null;

// transform a point to view space
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

// returns transform porperties, but only the first
export function getTransforms(transformStr)
{
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("transform", transformStr);
    const transformList = rect.transform.baseVal;
    const transforms = {
        translates: [],
        rotates: [],
        scales: [],
        matrices: []
    };
    for (let i = 0; i < transformList.length; i++) {
        const transform = transformList[i];
        const matrix = transform.matrix;
        switch (transform.type) {
            case 2:
                transforms.translates.push([matrix.e, matrix.f]);
                break;
            case 3:
                transforms.scales.push([matrix.a, matrix.d]);
                break;
            case 4:
                transforms.rotates.push(transform.angle);
                break;
            case 5:// TODO skewX()
                break;
            case 6:// TODO skewY(()
                break;
            case 1:
            default:
                transforms.matrices.push(matrix);
                break;
        }
    }

    return transforms;
}
