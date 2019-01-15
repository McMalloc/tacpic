/*global fabric*/

import 'fabric'
import rect from "./ReactSVG/Rect";
import path from "./ReactSVG/path";

let mouseDownX, mouseDownY;

let isDragging, selection, lastPosX, lastPosY;

let pageWidth = 800; // dpi umrechnen
let pageHeight = 600;

export default class FabricCanvas {
    mouseUpHandler(event) {
        // target is null if the actual canvas is clicked, not an object already attached to it
        switch (this.getProps().editorProps.mode) {
            case 'rect':
                if (event.target !== null) break; // todo: muss besser abgefragt werden
                // was the canvas just clicked? if yes, don't draw something really small
                // todo: draw a standard sized rect so the canvas doesn't seem just frozen
                if (Math.abs(event.pointer.x - mouseDownX) < 5 || Math.abs(event.pointer.y - mouseDownY) < 5) return;

                this.canvas.createRect(
                    mouseDownX,
                    mouseDownY,
                    event.pointer.x,
                    event.pointer.y,
                    this.getProps().editorProps
                );
                break;
            case 'circle':
                if (event.target !== null) break;
                // was the canvas just clicked? if yes, don't draw something really small
                // todo: draw a standard sized rect so the canvas doesn't seem just frozen
                if (Math.abs(event.pointer.x - mouseDownX) < 5 || Math.abs(event.pointer.y - mouseDownY) < 5) return;
                let object = new fabric.Circle({
                    left: event.pointer.x,
                    top: event.pointer.y,
                    radius: 20
                });
                this.canvas.add(object);
                this.canvas.setActiveObject(object);
                break;
            case 'label':
                if (event.target !== null) break;
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
                break;
            case 'line':
                this.canvas.createLine(event.pointer.x, event.pointer.y);
                break;
            case 'curve':

                break;
            default:
                break;
        }
    };
    constructor(canvasId, getProps) {
        //registering events
        // init('editor');<
        this.getProps = getProps;
        this.canvas = new fabric.Canvas(canvasId, {})
            .on('mouse:up', event => {
                console.log("up!");
                if (!(event.e.altKey === true && isDragging)) {
                    this.mouseUpHandler(event);
                }
                if (isDragging) {
                    isDragging = false;
                    this.canvas.selection = true;
                }
            })
            .on('mouse:down', event => {
                mouseDownX = event.pointer.x;
                mouseDownY = event.pointer.y;

                if (event.e.altKey === true) { //todo: bessere Abfrage
                    console.log("alt!");
                    isDragging = true;
                    this.canvas.selection = false;
                    lastPosX = event.e.clientX;
                    lastPosY = event.e.clientY;
                }
            })
            .on('mouse:dblclick', event => {
            })
            .on('mouse:wheel', function(opt) {
                let delta = opt.e.deltaY;
                let zoom = this.getZoom();
                zoom = zoom + delta/200;
                if (zoom > 10) zoom = 10;
                if (zoom < 0.1) zoom = 0.1;
                this.setZoom(zoom);
                opt.e.preventDefault();
                opt.e.stopPropagation();
            })
            .on('mouse:move', function(opt) {
                if (isDragging) {
                    let e = opt.e;
                    this.viewportTransform[4] += e.clientX - lastPosX;
                    this.viewportTransform[5] += e.clientY - lastPosY;
                    lastPosX = e.clientX;
                    lastPosY = e.clientY;

                    if (this.viewportTransform[4] >= 0) {
                        this.viewportTransform[4] = 0;
                    } else if (this.viewportTransform[4] < this.getWidth() - pageWidth - 2) { // - 1000 * zoom) {
                        this.viewportTransform[4] = this.getWidth() - pageWidth - 2; // - 1000 * zoom;
                    }
                    if (this.viewportTransform[5] >= 0) {
                        this.viewportTransform[5] = 0;
                    } else if (this.viewportTransform[5] < this.getHeight() - pageHeight - 2) {//2 ist die Breite des Rahmens // - 1000 * zoom) {
                        this.viewportTransform[5] = this.getHeight() - pageHeight - 2;// - 1000 * zoom;
                    }

                    this.requestRenderAll();
                }
            })
            .on('object:scaled', event => {
                // TODO wonky
                let object = event.target;
                switch (object.get('type')) {
                    case 'rect':
                        this.canvas.scaleRect(object);
                        break;
                    case 'path':

                        break;
                    default: break;
                }

            })
            .on('object:moving', event => {
            })
            .on('object:added', event => {
            })
            .on('object:removed', event => {
            });

        this.canvas.backgroundColor="white";
        this.canvas.renderAll();

        rect(this.canvas);
        path(this.canvas);
    };

    setDimensions(w, h) {
        this.canvas.setWidth(parseInt(w));
        this.canvas.setHeight(parseInt(h));
        this.canvas.calcOffset();
    }
}