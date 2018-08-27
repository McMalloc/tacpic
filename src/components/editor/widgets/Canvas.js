/*global fabric*/

import React, {Component} from 'react';
import 'fabric'
import {connect} from "react-redux";
import {canvasUpdated} from "../../../actions/index";
import {fromSVG} from "../../../utility/Patterns";



class Canvas extends Component {
    mouseDownHandler(event) {
        // target is null if the actual canvas is clicked, not an object already attached to it
        if (event.target !== null) return;
        let object;

        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }



        switch (this.props.mode) {
            case 'rect':
                object = new fabric.Rect({
                    left: event.pointer.x,
                    top: event.pointer.y,
                    dirty: true,
                    fill: getRandomColor(),
                    width: 400,
                    height: 200
                });
                break;
            case 'circle':
                object = new fabric.Circle({
                    left: event.pointer.x,
                    top: event.pointer.y,
                    fill: getRandomColor(),
                    radius: 20
                });
                break;
            default: break;
        }

        let svgPatternString = `
            <?xml version="1.0" encoding="utf-8"?>
            <!-- Generator: Adobe Illustrator 22.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
            <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                 viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve">
            <style type="text/css">
                .st0{fill:none;stroke:#000000;stroke-miterlimit:50;stroke-width:1px;}
            </style>
            <line class="st0" x1="0" y1="20" x2="20" y2="0"/>
            </svg>
        `;

        fromSVG(svgPatternString, 1).then(pattern => {
            object.set('fill', pattern);

            // "add" object onto canvas

            setTimeout(() => {
                this.canvas.add(object);
                // this.props.updateCanvas(this.canvas.toObject());
            }, 50);
        });
    };

    componentDidMount() {
        //registering events
        this.canvas = new fabric.Canvas('editor')
            .on('mouse:down', event => {
                this.mouseDownHandler(event);
            })
            .on('object:modified', event => {
                console.log(event.target.getObjectScaling());
            })
            .on('object:added', event => {
                // console.dir(event);
            });
        //@todo the editor needs an init function so it can async load its ressources
    };

    redrawCanvas() {
        setTimeout(() => {
            this.canvas.loadFromJSON(this.props.canvas);
        }, 100); // gibt es eine andere lösung?
    }

    render() {
        console.log(this.props);

        if (this.canvas) {
            // this.canvas.setWidth(this.props.width);
            // this.canvas.setHeight(this.props.height);
            // this.canvas.calcOffset();
        }

        return (
                <canvas
                    width={500}
                    height={500}
                    // width={this.props.width}
                    // height={this.props.height}
                    style={{border: "3px solid rgba(0, 0, 0, 0.1)", width: "100%", height: "100%"}}
                    id="editor"> Canvas not supported.
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