/*global fabric*/

import React, {Component} from 'react';
import 'fabric'
import {connect} from "react-redux";
import {canvasUpdated} from "../../../actions/index";

import {generatePatterns, updatePatternClipping} from "../Patterns";

let mouseDownX, mouseDownY;

class Canvas extends Component {
    mouseDownHandler(event) {
        // target is null if the actual canvas is clicked, not an object already attached to it
        if (event.target !== null) return;

        // was the canvas just clicked? if yes, don't draw something really small
        if (Math.abs(event.pointer.x - mouseDownX) < 5 || Math.abs(event.pointer.y - mouseDownY) < 5) return;
        let object;

        switch (this.props.mode) {
            case 'rect':
                object = new fabric.Rect({
                    left: mouseDownX,
                    top: mouseDownY,
                    width: event.pointer.x - mouseDownX,
                    fill: 'rgba(255,0,0,0.2)',
                    stroke: "#000",
                    strokeWidth: 2,
                    height: event.pointer.y - mouseDownY,
                    setByUser: true,
                    pattern: this.props.texture
                });
                break;
            case 'circle':
                object = new fabric.Circle({
                    left: event.pointer.x,
                    top: event.pointer.y,
                    radius: 20
                });
                break;
            case 'label':
                object = new fabric.Textbox('', {
                    left: mouseDownX,
                    top: mouseDownY,
                    width: event.pointer.x - mouseDownX,
                    height: event.pointer.y - mouseDownY,
                    setByUser: true,
                    fontSize: 16
                });
                object.setControlsVisibility({
                    bl: false, mb: false, br: false, tr: false, mt:false, tl: false
                });
                break;
            default:
                break;
        }

        this.canvas.add(object);
        this.canvas.setActiveObject(object);
    };


    componentDidMount() {
        //registering events
        // init('editor');
        this.canvas = new fabric.Canvas('editor')
            .on('mouse:up', event => {
                this.mouseDownHandler(event);
            })
            .on('mouse:down', event => {
                mouseDownX = event.pointer.x;
                mouseDownY = event.pointer.y;
            })
            .on('object:modified', event => {
                updatePatternClipping(this.canvas.getObjects());
            })
            .on('object:added', event => {
                updatePatternClipping(this.canvas.getObjects());
            });

        generatePatterns(this.canvas);
        console.info('Canvas mounted.');
    };

    render() {
        return (
            <canvas
                width={500}
                height={500}
                style={{border: "3px solid rgba(0, 0, 0, 0.1)", width: "100%", height: "100%"}}
                id="editor"> Browser not supported. / Browser wird nicht unterstützt. <br/> :(
            </canvas>
        );
    }
}

const mapStateToProps = state => {
    return {...state.editor.present}
};

const mapDispatchToProps = dispatch => {
    return {
        updateCanvas: (serializedCanvas) => {
            dispatch(canvasUpdated(serializedCanvas));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);