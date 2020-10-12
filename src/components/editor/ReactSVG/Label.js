import React, {Component} from 'react'
import transform from "./transform";
import _ from "lodash";
import styled from "styled-components";
import {connect, useDispatch, useSelector} from "react-redux";
import {Icon} from "../../gui/_Icon";

//TODO Linebreaks mit absolutem x und relativem y-Wert: https://www.oreilly.com/library/view/svg-text-layout/9781491933817/ch04.html

const Braille = styled.div`
  line-height: 12mm;
  font-family: ${props => props.system === 'cb' ? "HBS8" : "tacpic swell braille"};
  //font-family: ${props => props.system === 'cb' ? "HBS8" : "tacpic swell braille"};
  position: absolute;
  //z-index: -1;
  width: 100%;
  top: ${props => props.vOffset ? '5mm' : 0}; /*half font size*/
  white-space: pre-wrap;
  color: black;
  font-size: 10mm;
  box-sizing: border-box;
  overflow: visible;
  user-select: none;
`;

const Indicator = styled.div`
  position: absolute;
  top: -16px;
  color: ${props => props.theme.manipulator};
  font-size: 12px;
`;

const Black = styled.textarea`
  line-height: 12mm;
  font-size: 14pt;
  margin-top: -4mm;
  font-family: Arial, Helvetica, sans-serif;
  width: 100%;
  border: none;
  overflow: hidden;
  padding: 0;
  resize: none;
  box-sizing: border-box;
  color: blue;
  background-color: transparent;
  
  &:focus {
    outline: none;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 2mm;
  box-sizing: border-box;
  //overflow: visible;
  border: ${props => props.border ? '1mm black solid' : '1mm transparent solid'};
  //border-color: ${props => props.preview ? 'black' : 'transparent'};
`;

const changeText = (dispatch, text, uuid) => {
    dispatch({
        type: 'OBJECT_PROP_CHANGED',
        value: text,
        prop: 'text',
        uuid
    });
};

const exitEditMode = (dispatch, uuid) => {
    dispatch({
        type: 'OBJECT_PROP_CHANGED',
        prop: 'editMode',
        value: false,
        uuid
    });
};

const enterEditMode = (dispatch, uuid) => {
    dispatch({
        type: 'OBJECT_PROP_CHANGED',
        prop: 'editMode',
        value: true,
        uuid
    });
};

// TODO onChange for textarea obligatory if value is set (says react)
const Label = props => {
    const dispatch = useDispatch();
    const previewMode = useSelector(state => state.editor.ui.previewMode);
    const system = useSelector(
        state => state.editor.file.system
    );

    // TODO onCLick ändert value, wenn current value != title_placeholder

    return (
        <g data-transformable={true}
           id={props.uuid}
           data-group={1}
           data-selectable={true}
           data-editable={1}
           data-in_edit_mode={props.editMode}
           transform={transform(props.x, props.y, props.angle)}>
            <foreignObject style={{overflow: "visible"}}
                           onDoubleClick={event => enterEditMode(dispatch, props.uuid)}
                           width={props.width}
                           height={props.height}>
                {props.editMode && <Indicator><Icon icon={"pen"} /> Bearbeitungsmodus</Indicator>}
                {/*Bug in WebKit macht die relative Positionierung nötig*/}
                <Container xmlns={"http://www.w3.org/1999/xhtml"}
                           preview={previewMode}
                           className={"label-container"}
                           border={props.border}
                           onMouseDown={event => props.editMode && event.stopPropagation()}
                           style={{position: 'relative', backgroundColor: props.editMode ? '#ffb8de' : 'white'}}>
                    {props.displayDots &&
                    <Braille
                        preview={previewMode}
                        system={system}
                        className={"label-braille"}
                        xmlns={"http://www.w3.org/1999/xhtml"}
                        vOffset={props.displayLetters}
                        id={'braille_' + props.uuid}>
                        {props.fullCharPrefix && '%'}{props.isKey ? props.keyVal : props.braille}
                    </Braille>
                    }

                    {props.displayLetters &&
                    <Black style={{height: props.height}}
                           preview={previewMode}
                           xmlns={"http://www.w3.org/1999/xhtml"}
                           disabled={!props.editMode}
                           className={"label-black"}
                           onClick={() => props.isTitle && props.braille.length === 0 && changeText(dispatch, "", props.uuid)}
                           onChange={event => changeText(dispatch, event.target.value, props.uuid)}
                           onBlur={() => exitEditMode(dispatch, props.uuid)}
                           tabIndex={1}
                           id={'editable_' + props.uuid}
                           value={props.isKey ? props.keyVal : props.text}
                    />
                    }
                </Container>
            </foreignObject>
        </g>
    )

};

export default Label;