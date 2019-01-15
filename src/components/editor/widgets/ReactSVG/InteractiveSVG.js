import React, {Component} from 'react'
import connect from "react-redux/es/connect/connect";
import Manipulator from "./Manipulator";
import transform from "./Transform";
import Rect from "./Rect";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

class InteractiveSVG extends Component {
    constructor(props) {
        super(props);
        this.svgElement = React.createRef();
        this.state = {
            mouseXDrag: 0,
            mouseYDrag: 0,
        }
    }

    mouseXDown = null; // in den state packen
    mouseYDown = null;
    dragging = false;
    mouseIsDown = false;

    currentX(eventX) {        return eventX - this.svgElement.current.getBoundingClientRect().left;    }
    currentY(eventY) {        return eventY - this.svgElement.current.getBoundingClientRect().top;    }

    mouseDownHandler(event) {
        this.mouseXDown = this.currentX(event.clientX); // todo zum State machen
        this.mouseYDown = this.currentY(event.clientY);
        this.mouseIsDown = true;
    }

    mouseUpHandler(event) {
        this.mouseIsDown = false;

        if (this.dragging) {
            switch (this.props.mode) {
                case "rect":
                    let uuid = uuidv4();
                    this.props.addObject(
                        // Hash, der key ist die UUID, darunter ist ein Objekt (oder ein ein weiteres Hash), dass die Daten enthält. Daraus werden in den Objektkomponenten die Elemente erstellt
                        // Oder: React-Komponenten für Objekte so lassen wie sie sind und immer wieder in dieser Rendermethode neu aufrufen
                        {
                            type: 'rect', // TODO Konstanten nutzen
                            uuid: uuid,
                            x: this.mouseXDown,
                            y: this.mouseYDown,
                            angle: 0,
                            width: this.state.mouseXDrag - this.mouseXDown,
                            height: this.state.mouseYDrag - this.mouseYDown
                        }
                    );
                    break;
                case "transform":
                    this.props.transformEnd();
                    break;
            }
        }

        this.dragging = false;
    }

    mouseMoveHandler(event) {
        if (this.mouseIsDown) {
            this.dragging = true;
            this.setState({
                mouseXDrag: this.currentX(event.clientX),
                mouseYDrag: this.currentY(event.clientY)
            })
        }

        if (this.dragging && this.props.mode === 'transform') {
            this.props.rotate({
                x0: this.mouseXDown, // TODO muss nur einmal bei transform_start mitgegeben werden
                y0: this.mouseYDown, // dito
                x1: this.state.mouseXDrag,
                y1: this.state.mouseYDrag
            });
        }
    }

    static OBJECTS = ({ uuid, width, height, x, y, angle }, index) => ({
        rect: <Rect key={index} uuid={uuid} width={width} angle={angle} height={height} x={x} y={y} />
    });

    render() {
        let objects = this.props.objects.map((object, uuid) => {
            return InteractiveSVG.OBJECTS(object, uuid)[object.type];
        });

        return (
            <svg
                width={this.props.width}
                height={this.props.height}
                onMouseDown={ event => {this.mouseDownHandler(event)}}
                onMouseUp={ event => {this.mouseUpHandler(event)}}
                onMouseMove={ event => {this.mouseMoveHandler(event)}}
                ref={this.svgElement}
                style={{'border': '1px solid red'}}>

                {objects}

                {/*<Manipulator> muss hier stehen, um immer über allen anderen Objekten zu sein.*/}
                <Manipulator
                    dragging={this.dragging}
                    mouseXDown={this.mouseXDown}
                    mouseXDrag={this.state.mouseXDrag}
                    mouseYDown={this.mouseYDown}
                    mouseYDrag={this.state.mouseYDrag}
                />

                {this.dragging && this.props.mode !== 'transform' &&
                    <rect
                        x={this.mouseXDown}
                        y={this.mouseYDown}
                        fill={'rgba(0,0,255,0.01)'}
                        stroke={'rgba(0,0,255,0.2)'}
                        strokeWidth={'2px'}
                        width={this.state.mouseXDrag - this.mouseXDown}
                        height={this.state.mouseYDrag - this.mouseYDown} />
                }
            </svg>
        )
    }
}

const mapStateToProps = state => {
    return {...state.editor}
};

const mapDispatchToProps = dispatch => {
    return {
        addObject: (object) => {
            dispatch({
                type: 'OBJECT_ADDED',
                object
            });
        },
        rotate: coords => {
            dispatch({
                type: 'OBJECT_ROTATED',
                coords
            });
        },
        transformEnd: () => {
            dispatch({
                type: 'TRANSFORM_END'
            })
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(InteractiveSVG);