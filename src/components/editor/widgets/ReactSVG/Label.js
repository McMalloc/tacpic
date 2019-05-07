import React, {Component} from 'react'
import connect from "react-redux/es/connect/connect";
import transform from "./Transform";
import _ from "lodash";
import styled from "styled-components";

const Braille = styled.div`
  font-family: "Braille29 DE";
  position: absolute;
  top: 0;
  color: lightgray;
  font-size: 24pt;
`;

class Label extends Component {
    onClickHandler(event) {
        console.log("click!", event.currentTarget);
        if (this.props.selected) {

        } else {
            this.props.select(this.props.uuid)
        }
    }

    handleOnKeyPress(event) {
        console.dir(event);
    }

    render() {
        // let selected = false;
        // this.props.selectedObjects.forEach(uuid => {
        //     if (this.props.uuid === uuid) selected = true
        // });
        console.log(this.props);
        return (
            <g>
                <rect onClick={(event) => this.onClickHandler(event)}
                      width={this.props.width}
                      fillOpacity={0}
                      transform={transform(this.props.x, this.props.y, this.props.angle)}
                      height={this.props.height}/>
                <foreignObject width={this.props.width}
                               onClick={(event) => this.onClickHandler(event)}
                               height={this.props.height}
                               transform={transform(this.props.x, this.props.y, this.props.angle)}
                               id={this.props.uuid}>
                    {/*Bug in WebKit mach die relative Positionierung nötig*/}
                    <div style={{position: 'relative'}}>
                        {this.props.displayDots &&
                        <Braille xmlns="http://www.w3.org/1999/xhtml"
                                 id={'braille_' + this.props.uuid}>
                            {this.props.isKey ? this.props.keyVal : this.props.text}
                        </Braille>
                        }

                        {this.props.displayLetters &&
                        <div xmlns="http://www.w3.org/1999/xhtml"
                             suppressContentEditableWarning
                             id={'editable_' + this.props.uuid}
                             contentEditable={true}
                             style={{border: '1px dotted lightgrey', margin: 0, height: this.props.height}}>
                            {this.props.isKey ? this.props.keyVal : this.props.text}
                        </div>
                        }
                    </div>
                </foreignObject>

            </g>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        selectedObjects: state.editor.selectedObjects,
        selected: _.reduce(state.editor.selectedObjects, (result, uuid) => {
            return (props.uuid === uuid) || result;
        }, false)
    }
};

const mapDispatchToProps = dispatch => {
    return {
        select: (uuid) => {
            dispatch({
                type: 'OBJECT_SELECTED',
                uuid
            });
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Label);