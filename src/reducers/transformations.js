export default {
    translate: {
        rect: (object, x, y) => {
            object.x += x;
            object.y += y;
            return object;
        },
    },
    rotate: {
        rect: (object, originX, originY, offsetX, offsetY) => {
            object.angle += 5;
            return object;
        }
    }
}