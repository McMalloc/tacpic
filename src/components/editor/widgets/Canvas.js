import React, {Component} from 'react';
import {connect} from "react-redux";
import {canvasUpdated} from "../../../actions/index";
import styled from 'styled-components';
import {updatePatternClipping} from "../Patterns";
import FabricCanvas from "./FabricCanvas";

const CanvasWrapper = styled.div`
  display: ${props => props.active ? "block" : "none"};
  backgroundColor: 'lightyellow'
`;

class CanvasPage extends Component {
    componentDidMount() {
        this.Canvas = new FabricCanvas('editor-page-' + this.props.index, this.getProps.bind(this));
    };

    getProps() {
        return this.props;
    }

    // reverse(action) {
    //     switch (action.type) {
    //         case CANVAS_OBJECT_ADDED:
    //             this.canvas.remove(action.event.target);
    //             break;
    //         case CANVAS_OBJECT_REMOVED:
    //             this.canvas.add(action.event.target);
    //             break;
    //         default: break;
    //     }
    // };

    render() {
        if (this.Canvas) this.Canvas.setDimensions(this.props.width, this.props.height);
        return (
            <canvas
                width={this.props.width}
                height={this.props.height}
                id={'editor-page-' + this.props.index}> Browser not supported. / Browser wird nicht unterstützt. <br/> :(
            </canvas>
        );
    }
}

class Canvas extends Component {
    render() {
        return (
            <div>
                {this.props.editorProps.openedFile.pages
                    .map((page, i) =>
                        <CanvasWrapper key={i} active={i === this.props.editorProps.currentPage}>
                            <CanvasPage width={this.props.canvasWidth} height={this.props.canvasHeight} index={i} page={page} editorProps={this.props.editorProps}/>
                        </CanvasWrapper>

                    )}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        ...state.canvas.present,
        editorProps: state.editor,
        canvasWidth: state.canvas.width,
        canvasHeight: state.canvas.height
    }
};

const mapDispatchToProps = dispatch => {
    return {
        updateCanvas: (serializedCanvas) => {
            dispatch(canvasUpdated(serializedCanvas));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);