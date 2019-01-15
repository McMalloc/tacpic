// was the canvas just clicked? if yes, don't draw something really small
if (Math.abs(event.pointer.x - mouseDownX) < 5 || Math.abs(event.pointer.y - mouseDownY) < 5) return;
let labelBlack = new fabric.Textbox('Text', {
    left: mouseDownX,
    top: mouseDownY,
    width: event.pointer.x - mouseDownX,
    height: event.pointer.y - mouseDownY,
    setByUser: true,
    fontSize: 16
});

let labelPoint = new fabric.Textbox('Text', {
    left: mouseDownX,
    top: mouseDownY,
    width: event.pointer.x - mouseDownX,
    height: event.pointer.y - mouseDownY,
    setByUser: true,
    fill: "#aaaadd",
    fontFamily: "BrailleDEComputer",
    fontSize: 24
});

let group = new fabric.Group([ labelPoint, labelBlack ]);

group.setControlsVisibility({
    bl: false, mb: false, br: false, tr: false, mt:false, tl: false
});

this.canvas.add(group);

group.on('mousedblclick', event => {
    group.toActiveSelection();
    labelBlack.enterEditing().selectAll();
});
labelBlack.on('deselected', () => {
    labelPoint.text = labelBlack.text;
    labelBlack.exitEditing();
    group = new fabric.Group([ labelPoint, labelBlack ]);
    group.setControlsVisibility({
        bl: false, mb: false, br: false, tr: false, mt:false, tl: false
    });
    group.on('mousedblclick', event => {
        group.toActiveSelection();
        labelBlack.enterEditing().selectAll();
    });
    this.canvas.add(group);
});
//todo optimieren, skalieren sollte nur das Textfeld skalieren, nicht die Gruppe

// setTimeout(() => {
//     text.enterEditing();
// }, 1000);

// this.canvas.add(object);
// this.canvas.setActiveObject(object);

default export function setLabel(canvas) {

}