export const pixelToPx = value => {
    // TODO mit dynamisch erstellen Elementen implementieren
    let newDiv = document.createElement("div");

    const rect = document.getElementById("reference-rect").getBoundingClientRect().width;
    const div = document.getElementById("reference-div-px").getBoundingClientRect().width;
    return value * (rect / div);
}

export const mmToPx = value => {
    const div = document.getElementById("reference-div-mm").getBoundingClientRect().width;
    return value * div;
}