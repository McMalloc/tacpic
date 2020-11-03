export const pixelToPx = value => {
    // TODO mit dynamisch erstellen Elementen implementieren
    const rect = document.getElementById("reference-rect").getBoundingClientRect().width;
    const div = document.getElementById("reference-div").getBoundingClientRect().width;
    return value * (rect / div);
}