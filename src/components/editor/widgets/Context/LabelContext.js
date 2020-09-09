import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Checkbox} from "../../../gui/Checkbox";
import {Multiline, Textinput} from "../../../gui/Input";
import {find} from "lodash";
import styled from "styled-components";
import {useTranslation} from "react-i18next";
import Well from "../../../gui/Well";
import Expander from "../../../gui/Expander";

const BraillePreview = styled(Well)`
  font-family: "tacpic swell braille";
  margin-top: 6px;
  font-size: 28pt;
  white-space: pre-wrap;
  line-height: 28pt;
`;

const CodePreview = styled(Well)`
  font-family: Monospace;
  margin-top: 0;
  font-size: 14pt;
  white-space: pre-wrap;
  line-height: 18pt;
`;

const changeProp = (dispatch, uuid, prop, value) => {
    dispatch({
        type: 'OBJECT_PROP_CHANGED',
        uuid,
        prop,
        value
    });
};

const LabelContext = props => {
    const selectedObject = useSelector(
        state => find(state.editor.file.present.pages[state.editor.ui.currentPage].objects, {uuid: state.editor.ui.selectedObjects[0]}) || {}
    );
    const dispatch = useDispatch();
    const t = useTranslation().t;

    const onChangeHandler = event => {
        changeProp(dispatch, selectedObject.uuid, "text", event.currentTarget.value);
    };

    return (
        <>
            <Multiline onChange={onChangeHandler} style={{margin: 0}} value={selectedObject.text}
                       label={"Text"}/>
            <div>
                <Expander>
                    <span>Vorschau</span>
                    <div>
                        <BraillePreview>{selectedObject.braille}</BraillePreview>
                        <span>Braillecode in Schwarzschrift:</span>
                        <CodePreview>{selectedObject.braille}</CodePreview>
                    </div>
                </Expander>
            </div>

            <fieldset>
                <legend>Legende</legend>
                <Checkbox name={"is-key"}
                          value={selectedObject.isKey}
                          onChange={() => changeProp(
                              dispatch,
                              selectedObject.uuid,
                              "isKey",
                              !selectedObject.isKey)
                          }
                          label={"Schlüssel"}/>

                <Textinput disabled={!selectedObject.isKey}
                           onChange={event => changeProp(
                               dispatch,
                               selectedObject.uuid,
                               "keyVal",
                               event.currentTarget.value)}
                           value={selectedObject.keyVal}
                           aria-labelledby={"is-key"}/>
                <p>{t("editor:cb_braille-key-explanation")}</p>
            </fieldset>

            <fieldset>
                <legend>Punktschrift</legend>
                <Checkbox name={"display-dots"}
                          value={selectedObject.displayDots}
                          onChange={() => changeProp(dispatch, selectedObject.uuid, "displayDots", !selectedObject.displayDots)}
                          label={"Beschriftung in Punktschrift"}/>

                <Checkbox name={"full-character"}
                          value={selectedObject.fullCharPrefix}
                          onChange={() => changeProp(dispatch, selectedObject.uuid, "fullCharPrefix", !selectedObject.fullCharPrefix)}
                          label={"editor:cb_braille-full-character"}/>

                <Checkbox name={"show-border"}
                          value={selectedObject.border}
                          onChange={() => changeProp(dispatch, selectedObject.uuid, "border", !selectedObject.border)}
                          label={"editor:cb_braille-show-border"}/>
            </fieldset>

            <fieldset>
                <legend>Schwarzschrift</legend>
                <Checkbox name={"black-letter"}
                          value={selectedObject.displayLetters}
                          onChange={() => changeProp(dispatch, selectedObject.uuid, "displayLetters", !selectedObject.displayLetters)}
                          label={"Beschriftung in Schwarzschrift"}/>

            </fieldset>
        </>
    );
};

export default LabelContext;