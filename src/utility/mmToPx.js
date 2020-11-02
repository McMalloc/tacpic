export const pixelToPx = value => {
    const rect = document.getElementById("reference-rect").getBoundingClientRect().width;
    const div = document.getElementById("reference-div").getBoundingClientRect().width;
    return value * (rect / div);
}