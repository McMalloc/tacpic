export default function transform(x = 0, y = 0, a = 0, offsetX = 0, offsetY = 0) {
    return `translate(${x + offsetX}, ${y + offsetY}) rotate(${a})`;
}
