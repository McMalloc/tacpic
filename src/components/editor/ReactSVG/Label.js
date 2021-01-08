import React, { useEffect, useState } from "react";
import transform from "./transform";
import _ from "lodash";
import styled from "styled-components/macro";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "../../gui/_Icon";
import { getTextWidth } from "../../../utility/getTextWidth";
import { useTranslation } from "react-i18next";

//TODO Linebreaks mit absolutem x und relativem y-Wert: https://www.oreilly.com/library/view/svg-text-layout/9781491933817/ch04.html

const Braille = styled.div`
  line-height: 14mm;
  font-family: ${(props) =>
    props.system === "cb" ? "HBS8" : "tacpic swell braille"};
  position: absolute;
  width: 100%;
  top: ${(props) => (props.vOffset ? "3mm" : 0)}; /*half font size*/
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
  color: ${(props) => props.theme.manipulator};
  font-size: 12px;
`;

const Black = styled.textarea`
  line-height: 14mm;
  font-size: 14pt;
  margin-top: -6mm;
  font-family: Arial, Helvetica, sans-serif;
  width: 100%;
  border: none;
  /* font-weight: ${props => props.isTitle ? 'bold' : 'normal'}; */
  /* text-decoration: ${props => props.isTitle ? 'underline' : 'none'}; */
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

const Placeholder = styled.div`
  line-height: 14mm;
  font-size: 14pt;
  position: absolute;
  top: 0;
  left: 0;
  font-family: Arial, Helvetica, sans-serif;
  width: 100%;
  box-sizing: border-box;
  color: blue;
  font-style: italic;
  &:focus {
    outline: none;
  }
`;

const Pagenumbers = styled.div`
  line-height: 14mm;
  font-size: 14pt;
  font-family: Arial, Helvetica, sans-serif;
  color: blue;
  top: -4mm;
  position: absolute;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 2mm;
  box-sizing: border-box;
  border: ${(props) =>
    props.border ? "1mm black solid" : "1mm transparent solid"};
`;

const changeText = (dispatch, text, uuid) => {
  dispatch({
    type: "OBJECT_PROP_CHANGED",
    value: text,
    prop: "text",
    uuid,
  });
};

const exitEditMode = (dispatch, uuid) => {
  dispatch({
    type: "OBJECT_PROP_CHANGED",
    prop: "editMode",
    value: false,
    uuid,
  });
};

const enterEditMode = (dispatch, props) => {
  setTimeout(() => {
    if (props.isTitle && props.braille.length === 0)
      //   document.getElementById("editable_" + props.uuid).val = "";
      document.getElementById("editable_" + props.uuid).focus();
  }, 100);
  dispatch({
    type: "OBJECT_PROP_CHANGED",
    prop: "editMode",
    value: true,
    uuid: props.uuid,
  });
};

const Label = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const system = useSelector((state) => state.editor.file.system);

  // if label is title
  const currentPageNumber = props.pageIndex + 1;
  const previewMode = useSelector((state) => state.editor.ui.previewMode);
  const pageNumber = useSelector(
    (state) => state.editor.file.present.pages.length
  );

  const [titleWidth, setTitleWidth] = useState(0);
  useEffect(() => {
    props.isTitle &&
      setTitleWidth(
        getTextWidth(props.text, "14pt", "Arial, Helvetica, sans-serif")
      );
  }, [props.text]);

  // TODO onCLick ändert value, wenn current value != title_placeholder

  return (
    <g
      data-transformable={true}
      id={props.uuid}
      data-group={1}
      data-selectable={true}
      data-editable={1}
      data-select-override={props.isTitle}
      data-in_edit_mode={props.editMode}
      transform={transform(props.x, props.y, props.angle)}
    >
      {props.border &&
        <rect
          strokeWidth={"3mm"}
          stroke={"white"}
          x={0}
          y={0}
          width={props.width}
          height={props.height}
        />
      }
      <foreignObject
        style={{ overflow: "visible" }}
        onDoubleClick={() => enterEditMode(dispatch, props)}
        width={props.width}
        height={props.height}
      >
        {props.editMode && (
          <Indicator className={"editor-ui"}>
            <Icon icon={"pen"} /> Bearbeitungsmodus
          </Indicator>
        )}
        {/*Bug in WebKit macht die relative Positionierung nötig*/}
        <Container
          xmlns={"http://www.w3.org/1999/xhtml"}
          preview={previewMode}
          className={"label-container"}
          border={props.border}
          onMouseDown={(event) => props.editMode && event.stopPropagation()}
          style={{
            position: "relative",
            backgroundColor: props.editMode ? "#ffd2eb" : "white",
          }}
        >
          {props.displayDots && (
            <Braille
              preview={previewMode}
              system={system}
              className={"label-braille"}
              xmlns={"http://www.w3.org/1999/xhtml"}
              vOffset={props.displayLetters}
              id={"braille_" + props.uuid}
            >
              {props.fullCharPrefix && "%"}
              {props.isKey ? props.keyVal : props.braille}{" "}
              {props.isTitle && pageNumber > 1 && !props.pristine
                ? ` ${currentPageNumber}/${pageNumber}`
                : ""}
            </Braille>
          )}

          {props.displayLetters && (
            <>
              {props.isTitle && props.text.length === 0 && !props.editMode && props.pristine && 
                <Placeholder
                  style={{ height: props.height }}
                  preview={previewMode}
                  xmlns={"http://www.w3.org/1999/xhtml"}
                  className={"label-black"}
                  tabIndex={1}
                  value={"(titel)"}
                >
                  {t("editor:title_placeholder")}
                </Placeholder>
              }
              <Black
                style={{ height: props.height }}
                isTitle={props.isTitle}
                preview={previewMode}
                xmlns={"http://www.w3.org/1999/xhtml"}
                disabled={!props.editMode}
                className={"label-black"}
                onClick={() =>
                  props.isTitle &&
                  props.braille.length === 0 &&
                  changeText(dispatch, "", props.uuid)
                }
                onKeyDown={event => event.stopPropagation()}
                onChange={(event) =>
                  changeText(
                    dispatch,
                    event.target.value,
                    props.uuid,
                    props.isTitle
                  )
                }
                onBlur={() => exitEditMode(dispatch, props.uuid)}
                tabIndex={1}
                id={"editable_" + props.uuid}
                value={props.isKey ? props.keyVal : props.text}
              />
              {props.isTitle && pageNumber > 1 && !props.pristine && (
                <Pagenumbers
                  className={"label-black page-numbers"}
                  style={{ left: titleWidth + 18 }}
                >{` ${currentPageNumber}/${pageNumber}`}</Pagenumbers>
              )}
            </>
          )}
        </Container>
      </foreignObject>
    </g>
  );
};

export default Label;
