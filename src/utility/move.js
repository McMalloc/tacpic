const move = (array, a , b) => {
        while (a < 0) {
            a += array.length;
        }
        while (b < 0) {
            b += array.length;
        }
        if (b >= array.length) {
            let k = b - array.length;
            while ((k--) + 1) {
                array.push(null);
            }
        }
    array.splice(b, 0, array.splice(a, 1)[0]);
        return array;
}

export default move;