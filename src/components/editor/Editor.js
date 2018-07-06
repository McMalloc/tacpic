/*global fabric*/

import React, {Component} from 'react';
import 'fabric'
import Toolbox from "./Toolbox";
import {connect} from "react-redux";
import {canvasUpdated} from "../../actions/index";

class Editor extends Component {
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

        switch (this.props.editorState.mode) {
            case 'rect':
                object = new fabric.Rect({
                    left: event.pointer.x,
                    top: event.pointer.y,
                    fill: getRandomColor(),
                    width: 200,
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

        object.set('fill', new fabric.Pattern({
            source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAIklEQVQYlWNgQID/SBgnoJ4iBiIV/WcgUhHRttHJg5QpAgDEGh3jokNvkAAAAABJRU5ErkJggg==',
            repeat: 'repeat'
        }));

        // "add" object onto canvas
        this.canvas.add(object);
        this.props.updateCanvas(this.canvas.toObject());
    };

    // constructor(props, context) {
    //     // context contains global variables, like angulars $rootScope
    //     super(props, context);
    // };

    componentDidMount() {
        //registering events
        this.canvas = new fabric.Canvas('editor')
            .on('mouse:down', event => {
                this.mouseDownHandler(event);
            })
            .on('object:modified', event => {
                // console.dir(event);
            })
            .on('object:added', event => {
                // console.dir(event);
            });
    };

    redrawCanvas() {
        setTimeout(() => {
            this.canvas.loadFromJSON(this.props.editorState.canvas);
        }, 100); // gibt es eine andere lösung?
    }

    render() {
        return (
            <div>
                <Toolbox triggerRedraw={this.redrawCanvas.bind(this)}/>
                <canvas width={1000} height={1000} style={{border: "1px solid black"}} id="editor">Canvas not
                    supported.
                </canvas>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        editorState: state.editor.present
    }
};

const mapDispatchToProps = dispatch => {
    return {
        updateCanvas: (serializedCanvas) => {
            dispatch(canvasUpdated(serializedCanvas));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);