/*global fabric*/

import React, { Component } from 'react';
import 'fabric'

class Editor extends Component {
    componentDidMount() {
        var canvas = new fabric.Canvas('editor');
        var rect = new fabric.Rect({
            left: 0,
            top: 0,
            fill: 'red',
            width: 20,
            height: 20
        });
        // "add" rectangle onto canvas
        canvas.add(rect);
    };
    render() {
        return (
            <canvas id="editor"></canvas>
        );
    }
}

export default Editor;