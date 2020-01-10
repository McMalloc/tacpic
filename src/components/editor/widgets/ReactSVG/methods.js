const defaultTranslate = (object, x, y) => {
    object.x += x;
    object.y += y;
    return object;
};

const defaultRotate = (object, originX, originY, offsetX, offsetY) => {
    // TODO: intuitiv machen
    object.angle += 5;
    return object;
};

const defaultGetBBox = object => {
    const element = document.getElementById(object.uuid);
    const box = element.getBoundingClientRect();
    return {
        x: box.x + object.x || 0,
        y: box.y + object.y || 0,
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
        x2 = box.x + box.width;
        y2 = box.y + box.height;
        // console.log(
        //     `box.y: ${parseInt(box.y)}\tbox.h: ${parseInt(box.height)}`
        // );
        // console.log(
        //     `x1: ${parseInt(x1)}\ty1: ${parseInt(y1)}\nx2: ${parseInt(x2)}\ty2: ${parseInt(y2)}`
        // );
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
            contents.x += group.x;
            contents.y += group.y;
            return contents;
        },
    }
};

export default methods;