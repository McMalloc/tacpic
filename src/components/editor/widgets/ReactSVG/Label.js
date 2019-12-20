import React, {Component} from 'react'
import connect from "react-redux/es/connect/connect";
import transform from "./Transform";
import _ from "lodash";
import styled from "styled-components";

const Braille = styled.div`
  font-family: "Braille29 DE";
  position: absolute;
  z-index: -1;
  top: 0;
  color: lightgray;
  font-size: 24pt;
`;

const Black = styled.textarea`
  border: 1px dotted lightgrey; 
  margin: 0;
  font-size: 16pt;
  width: 100%;
  background-color: transparent;
`;

const Container = styled.div`
  &:hover {
    ${Braille} {
      display: none;
    }
    
    background-color: rgba(255,255,255,.3);
  }
`;

//     this.props.addObject( // TODO named Prototypes nutzen für proptypes?
//         // Hash, der key ist die UUID, darunter ist ein Objekt (oder ein ein weiteres Hash), dass die Daten enthält. Daraus werden in den Objektkomponenten die Elemente erstellt
//         // Oder: React-Komponenten für Objekte so lassen wie sie sind und immer wieder in dieser Rendermethode neu aufrufen
//         {
//             type: OBJECT.LABEL,
//             uuid: uuid,
//             text: "Beschriftung",
//             x: this.mouseDownX,
//             y: this.mouseDownY,
//             angle: 0,
//             position: "left-top",
//             isKey: false, // false
//             displayDots: true,
//             displayLetters: true,
//             keyVal: 'Bschr', // ''
//             width: this.state.mouseXDrag - this.mouseDownX,
//             height: this.state.mouseYDrag - this.mouseDownY
//         },
//         this.props.ui.currentPage
//     );

// TODO onChange for textarea obligatory if value is set (says react)
class Label extends Component {
    onClickHandler(event) {
        // not used anymore
        // console.log(this.props.uuid);
        // if (this.props.selected) {
        //
        // } else {
        //
        //     this.props.select(this.props.uuid)
        // }
    }

    handleOnKeyPress(event) {
        console.dir(event);
    }

    render() {
        // let selected = false;
        // this.props.selectedObjects.forEach(uuid => {
        //     if (this.props.uuid === uuid) selected = true
        // });
        return (
            <g>
                <rect onClick={(event) => this.onClickHandler(event)}
                      width={this.props.width}
                      fillOpacity={0}
                      id={this.props.uuid}
                      transform={transform(this.props.x, this.props.y, this.props.angle)}
                      height={this.props.height}/>
                <foreignObject width={this.props.width}
                               height={this.props.height}
                               transform={transform(this.props.x, this.props.y, this.props.angle)}
                >
                    {/*Bug in WebKit mach die relative Positionierung nötig*/}
                    <Container style={{position: 'relative'}}>
                        {this.props.displayDots &&
                        <Braille xmlns="http://www.w3.org/1999/xhtml"
                                 id={'braille_' + this.props.uuid}>
                            {this.props.isKey ? this.props.keyVal : this.props.text}
                        </Braille>
                        }

                        {this.props.displayLetters &&
                        <Black xmlns="http://www.w3.org/1999/xhtml"
                               style={{height: this.props.height}}
                               id={'editable_' + this.props.uuid}
                               value={this.props.isKey ? this.props.keyVal : this.props.text}>
                        </Black>
                        }
                    </Container>
                </foreignObject>

            </g>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        selectedObjects: state.editor.ui.selectedObjects,
        selected: _.reduce(state.editor.ui.selectedObjects, (result, uuid) => {
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