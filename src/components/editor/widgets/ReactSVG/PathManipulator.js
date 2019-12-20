import React, {Component} from 'react'
import connect from "react-redux/es/connect/connect";
import {find} from "lodash";
import './PathManipulator.css';

class PathManipulator extends Component {
    pointDragStart = event => {
        // event.stopPropagation();
    };

    pointDragStop = event => {
        event.stopPropagation();
    };

    render() {
        let nrOfPoints = this.props.path.points.length;
        let latestSegment = this.props.path.points[nrOfPoints - 1];
        let previousSegment = this.props.path.points[nrOfPoints - 2];
        let segmentStart;
        let segmentEnd;
        let display = true; //latestSegment.coords.length === 2;

        if (nrOfPoints <= 2) {
            segmentStart = [this.props.path.x, this.props.path.y];
            // display = false;
        } else {
            segmentStart = [previousSegment.coords[2], previousSegment.coords[3]];
        }

        segmentEnd = [latestSegment.coords[0], latestSegment.coords[1]];

        return (
            <g>
                {this.props.path.points.map((point, index) => {
                    switch (point.kind.toUpperCase()) {
                        case 'M':
                            return (
                                    <circle
                                        cx={point.coords[0] - 3}
                                        cy={point.coords[1] - 3}
                                        data-role={"CLOSE_PATH"}
                                        key={index}
                                        r={6}/>
                            );
                        case 'L':
                            return (
                                    <circle key={index} cx={point.coords[0] - 2} cy={point.coords[1] - 2} r={4}/>
                            );
                        case 'Q':
                            return (
                                <circle onMouseDown={this.pointDragStart}
                                        onMouseUp={this.pointDragStop}
                                        data-role={"__path-vertex"}
                                        stroke={"darkblue"} fill={"none"}
                                        key={index}
                                        cx={(point.coords[2] || point.coords[0]) - 2} cy={(point.coords[3] || point.coords[1]) - 2} r={4}/>
                            );
                    }
                })}
                {latestSegment.coords.length === 2 && latestSegment.kind === 'Q' &&
                    <g>
                        <line style={{stroke: 'orange', strokeWidth: 0.5}}
                              x1={segmentStart[0]} y1={segmentStart[1]}
                              x2={this.props.currentX} y2={this.props.currentY}/>
                        <line style={{stroke: 'orange', strokeWidth: 0.5}}
                              x1={this.props.currentX} y1={this.props.currentY}
                              x2={segmentEnd[0]} y2={segmentEnd[1]}/>
                        <path style={{stroke: 'orange', strokeWidth: 1}} fill={"none"}
                              d={`M ${segmentStart[0]} ${segmentStart[1]} Q ${this.props.currentX} ${this.props.currentY} ${segmentEnd[0]} ${segmentEnd[1]}`}/>
                    </g>
                }
            </g>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        path: find(state.editor.file.pages[0].objects, {uuid: ownProps.uuid})
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changePoint: () => {

        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PathManipulator);