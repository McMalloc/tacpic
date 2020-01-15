import React, {Component} from 'react'
import transform from "./transform";
import _ from "lodash";
import styled from "styled-components";
import {connect} from "react-redux";

const Braille = styled.div`
  font-family: "Braille29 DE";
  position: absolute;
  z-index: -1;
  width: 100%;
  top: 0;
  color: lightgray;
  font-size: 24pt;
`;

const Black = styled.textarea`
  border: 1px dotted lightgrey; 
  margin: 0;
  font-size: 16pt;
  width: 100%;
  resize: none;
  box-sizing: border-box;
  background-color: transparent;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.03);
`;

// TODO onChange for textarea obligatory if value is set (says react)
class Label extends Component {
    constructor(props) {
        super(props);
        this.onKeyHandler = this.onKeyHandler.bind(this);
        this.onBlurHandler = this.onBlurHandler.bind(this);
    }

    onKeyHandler(event) {
        this.props.changeText(event.target.value);
    }

    onBlurHandler(event) {
        this.props.exitEditMode();
    }

    render() {
        return (
            <g data-transformable={1}
               id={this.props.uuid}
               data-group={1}
               data-selectable={1}
               data-editable={1}
               data-in_edit_mode={this.props.editMode}
               transform={transform(this.props.x, this.props.y, this.props.angle)}>
                <foreignObject style={{overflow: "visible"}}
                               width={this.props.width}
                               height={this.props.height}>
                    {/*Bug in WebKit macht die relative Positionierung nötig*/}
                    <Container xmlns="http://www.w3.org/1999/xhtml"
                               onMouseDown={event => this.props.editMode && event.stopPropagation()}
                               style={{position: 'relative'}}>
                        {this.props.displayDots &&
                        <Braille
                                 id={'braille_' + this.props.uuid}>
                            {this.props.isKey ? this.props.keyVal : this.props.text}
                        </Braille>
                        }

                        {this.props.displayLetters &&
                        <Black style={{height: this.props.height}}
                               disabled={!this.props.editMode}
                               onChange={this.onKeyHandler}
                               onBlur={this.onBlurHandler}
                               tabIndex={1}
                               id={'editable_' + this.props.uuid}
                               value={this.props.isKey ? this.props.keyVal : this.props.text}
                        >
                        </Black>
                        }
                    </Container>
                </foreignObject>
            </g>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        changeText: text => {
            dispatch({
                type: 'OBJECT_PROP_CHANGED',
                value: text,
                prop: 'text',
                uuid: ownProps.uuid
            });
        },
        exitEditMode: () => {
            dispatch({
                type: 'OBJECT_PROP_CHANGED',
                prop: 'editMode',
                value: false,
                uuid: ownProps.uuid
            });
        },
        select: (uuid) => {
            dispatch({
                type: 'OBJECT_SELECTED',
                uuid
            });
        }
    }
};

export default connect(null, mapDispatchToProps)(Label);